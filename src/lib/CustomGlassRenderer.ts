import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

import { FS_BLUR, FS_GLASS, VS_GLASS, VS_QUAD } from './liquidGlassShaders';

interface FBO {
  fbo: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
}

interface FBOSet {
  bg: FBO;
  blurA: FBO;
  blurB: FBO;
}

const BLUR_ITERATIONS = 3;
export const SHADOW_PAD = 48;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${err}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${err}`);
  }
  return program;
}

export class CustomGlassRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  private readonly cropCanvas: HTMLCanvasElement;
  private readonly cropCtx: CanvasRenderingContext2D;

  private blurP: WebGLProgram;
  private blurU: Record<string, WebGLUniformLocation | null>;
  private glassP: WebGLProgram;
  private glassU: Record<string, WebGLUniformLocation | null>;

  private quadBuf: WebGLBuffer;
  private panelBuf: WebGLBuffer;

  private readonly fboCache = new Map<string, FBOSet>();
  private activeFBOs: FBOSet | null = null;
  private bgTex: WebGLTexture | null = null;

  width = 0;
  height = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);

    this.cropCanvas = document.createElement('canvas');
    this.cropCtx = this.cropCanvas.getContext('2d')!;

    const gl = this.canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      throw new Error('WebGL is not supported in this browser.');
    }
    this.gl = gl;

    // Programs
    this.blurP = createProgram(gl, VS_QUAD, FS_BLUR);
    this.blurU = {
      u_tex: gl.getUniformLocation(this.blurP, 'u_tex'),
      u_dir: gl.getUniformLocation(this.blurP, 'u_dir'),
    };

    this.glassP = createProgram(gl, VS_GLASS, FS_GLASS);
    this.glassU = {
      u_bgTex: gl.getUniformLocation(this.glassP, 'u_bgTex'),
      u_blurTex: gl.getUniformLocation(this.glassP, 'u_blurTex'),
      u_center: gl.getUniformLocation(this.glassP, 'u_center'),
      u_size: gl.getUniformLocation(this.glassP, 'u_size'),
      u_radius: gl.getUniformLocation(this.glassP, 'u_radius'),
      u_res: gl.getUniformLocation(this.glassP, 'u_res'),
      u_pad: gl.getUniformLocation(this.glassP, 'u_pad'),
      u_refract: gl.getUniformLocation(this.glassP, 'u_refract'),
      u_chroma: gl.getUniformLocation(this.glassP, 'u_chroma'),
      u_edgeHL: gl.getUniformLocation(this.glassP, 'u_edgeHL'),
      u_spec: gl.getUniformLocation(this.glassP, 'u_spec'),
      u_fresnel: gl.getUniformLocation(this.glassP, 'u_fresnel'),
      u_distort: gl.getUniformLocation(this.glassP, 'u_distort'),
      u_alpha: gl.getUniformLocation(this.glassP, 'u_alpha'),
      u_sat: gl.getUniformLocation(this.glassP, 'u_sat'),
      u_tint: gl.getUniformLocation(this.glassP, 'u_tint'),
      u_zRadius: gl.getUniformLocation(this.glassP, 'u_zRadius'),
      u_brightness: gl.getUniformLocation(this.glassP, 'u_brightness'),
      u_shadowAlpha: gl.getUniformLocation(this.glassP, 'u_shadowAlpha'),
      u_shadowSpread: gl.getUniformLocation(this.glassP, 'u_shadowSpread'),
      u_shadowOffY: gl.getUniformLocation(this.glassP, 'u_shadowOffY'),
      u_bevelMode: gl.getUniformLocation(this.glassP, 'u_bevelMode'),
    };

    // Buffers
    this.quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    this.panelBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.panelBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), gl.STATIC_DRAW);
  }

  destroy(): void {
    const gl = this.gl;
    for (const fboSet of this.fboCache.values()) {
      this.freeFBOSet(fboSet);
    }
    this.fboCache.clear();
    if (this.bgTex) gl.deleteTexture(this.bgTex);
    if (this.quadBuf) gl.deleteBuffer(this.quadBuf);
    if (this.panelBuf) gl.deleteBuffer(this.panelBuf);
    if (this.blurP) gl.deleteProgram(this.blurP);
    if (this.glassP) gl.deleteProgram(this.glassP);
    this.canvas.remove();
  }

  private freeFBOSet(f: FBOSet): void {
    const gl = this.gl;
    [f.bg, f.blurA, f.blurB].forEach((entry) => {
      gl.deleteFramebuffer(entry.fbo);
      gl.deleteTexture(entry.tex);
    });
  }

  private createFBO(w: number, h: number): FBO {
    const gl = this.gl;
    const fbo = gl.createFramebuffer()!;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { fbo, tex, w, h };
  }

  private setActiveSize(w: number, h: number): boolean {
    if (w <= 0 || h <= 0) return false;
    this.width = w;
    this.height = h;

    const key = `${w}x${h}`;
    let fboSet = this.fboCache.get(key);
    if (!fboSet) {
      const bw = Math.max(1, Math.round(w * 0.5));
      const bh = Math.max(1, Math.round(h * 0.5));
      fboSet = {
        bg: this.createFBO(w, h),
        blurA: this.createFBO(bw, bh),
        blurB: this.createFBO(bw, bh),
      };
      this.fboCache.set(key, fboSet);
    }
    this.activeFBOs = fboSet;

    if (this.canvas.width < w || this.canvas.height < h) {
      this.canvas.width = Math.max(this.canvas.width, w);
      this.canvas.height = Math.max(this.canvas.height, h);
    }
    return true;
  }

  private drawQuad(prog: WebGLProgram, buf: WebGLBuffer): void {
    const gl = this.gl;
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.disableVertexAttribArray(aPos);
  }

  uploadAndBlur(
    sourceCanvas: HTMLCanvasElement,
    sourceX: number,
    sourceY: number,
    width: number,
    height: number,
    blurAmount: number,
  ): void {
    const gl = this.gl;
    if (!this.setActiveSize(width, height)) return;

    const W = this.width;
    const H = this.height;
    const fboSet = this.activeFBOs!;

    this.cropCanvas.width = W;
    this.cropCanvas.height = H;
    this.cropCtx.clearRect(0, 0, W, H);
    this.cropCtx.drawImage(sourceCanvas, -sourceX, -sourceY);

    if (!this.bgTex) {
      this.bgTex = gl.createTexture();
    }
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.cropCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

    // Copy to bg FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.bg.fbo);
    gl.viewport(0, 0, W, H);
    // Draw bgTex onto bg FBO using blur program with dir=0
    gl.useProgram(this.blurP);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.bgTex);
    gl.uniform1i(this.blurU.u_tex, 0);
    gl.uniform2f(this.blurU.u_dir, 0, 0);
    this.drawQuad(this.blurP, this.quadBuf);

    // Copy bgFBO -> blurA
    const bw = fboSet.blurA.w;
    const bh = fboSet.blurA.h;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurA.fbo);
    gl.viewport(0, 0, bw, bh);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.bg.tex);
    gl.uniform2f(this.blurU.u_dir, 0, 0);
    this.drawQuad(this.blurP, this.quadBuf);

    // Gaussian blur passes
    if (blurAmount > 0) {
      const spread = blurAmount * 2.5;
      for (let i = 0; i < BLUR_ITERATIONS; i++) {
        // Horizontal
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurB.fbo);
        gl.viewport(0, 0, bw, bh);
        gl.bindTexture(gl.TEXTURE_2D, fboSet.blurA.tex);
        gl.uniform2f(this.blurU.u_dir, spread / bw, 0);
        this.drawQuad(this.blurP, this.quadBuf);

        // Vertical
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboSet.blurA.fbo);
        gl.viewport(0, 0, bw, bh);
        gl.bindTexture(gl.TEXTURE_2D, fboSet.blurB.tex);
        gl.uniform2f(this.blurU.u_dir, 0, spread / bh);
        this.drawQuad(this.blurP, this.quadBuf);
      }
    }
  }

  clear(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  renderGlassPanel(config: LiquidGlassElementConfig, width: number, height: number, dpr: number): void {
    const gl = this.gl;
    const W = this.width;
    const H = this.height;
    const fboSet = this.activeFBOs!;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.glassP);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.bg.tex);
    gl.uniform1i(this.glassU.u_bgTex, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, fboSet.blurA.tex);
    gl.uniform1i(this.glassU.u_blurTex, 1);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, this.canvas.height - H, W, H);

    gl.uniform2f(this.glassU.u_res, W, H);
    gl.uniform2f(this.glassU.u_center, W * 0.5, H * 0.5);
    gl.uniform2f(this.glassU.u_size, width * dpr, height * dpr);
    gl.uniform1f(this.glassU.u_radius, config.cornerRadius * dpr);
    gl.uniform1f(this.glassU.u_pad, SHADOW_PAD * dpr);
    gl.uniform1f(this.glassU.u_refract, config.refraction);
    gl.uniform1f(this.glassU.u_chroma, config.chromAberration);
    gl.uniform1f(this.glassU.u_edgeHL, config.edgeHighlight);
    gl.uniform1f(this.glassU.u_spec, config.specular);
    gl.uniform1f(this.glassU.u_fresnel, config.fresnel);
    gl.uniform1f(this.glassU.u_distort, config.distortion);
    gl.uniform1f(this.glassU.u_alpha, config.opacity);
    gl.uniform1f(this.glassU.u_sat, config.saturation);
    gl.uniform1f(this.glassU.u_tint, config.tintStrength);
    gl.uniform1f(this.glassU.u_zRadius, config.zRadius * dpr);
    gl.uniform1f(this.glassU.u_brightness, config.brightness);
    gl.uniform1f(this.glassU.u_shadowAlpha, config.shadowOpacity);
    gl.uniform1f(this.glassU.u_shadowSpread, config.shadowSpread * dpr);
    gl.uniform1f(this.glassU.u_shadowOffY, config.shadowOffsetY * dpr);
    gl.uniform1f(this.glassU.u_bevelMode, config.bevelMode);

    this.drawQuad(this.glassP, this.panelBuf);
  }
}
