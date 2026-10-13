import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

import { CustomGlassRenderer, SHADOW_PAD } from './CustomGlassRenderer';

export interface LiquidEngineOptions {
  root: HTMLElement;
  glassElements: NodeListOf<HTMLElement> | HTMLElement[];
  defaultConfig: LiquidGlassElementConfig;
}

interface DragState {
  active: boolean;
  element: HTMLElement | null;
  startX: number;
  startY: number;
  origTx: number;
  origTy: number;
}

export class CustomLiquidEngine {
  readonly root: HTMLElement;
  readonly glassElements: HTMLElement[];
  readonly renderer: CustomGlassRenderer;
  private readonly glassCanvases = new Map<HTMLElement, HTMLCanvasElement>();
  private readonly sceneCanvas: HTMLCanvasElement;
  private readonly sceneCtx: CanvasRenderingContext2D;
  private defaultConfig: LiquidGlassElementConfig;

  private running = false;
  private rafId = 0;
  private isDirty = true;

  private readonly drag: DragState = {
    active: false,
    element: null,
    startX: 0,
    startY: 0,
    origTx: 0,
    origTy: 0,
  };

  private readonly onResize: () => void;
  private readonly onPointerDown: (e: PointerEvent) => void;
  private readonly onPointerMove: (e: PointerEvent) => void;
  private readonly onPointerUp: (e: PointerEvent) => void;

  constructor(options: LiquidEngineOptions) {
    this.root = options.root;
    this.glassElements = Array.from(options.glassElements);
    this.defaultConfig = options.defaultConfig;

    this.renderer = new CustomGlassRenderer();
    this.sceneCanvas = document.createElement('canvas');
    this.sceneCtx = this.sceneCanvas.getContext('2d')!;

    this.setupGlassElements();

    this.onResize = this.handleResize.bind(this);
    this.onPointerDown = this.handlePointerDown.bind(this);
    this.onPointerMove = this.handlePointerMove.bind(this);
    this.onPointerUp = this.handlePointerUp.bind(this);

    window.addEventListener('resize', this.onResize);
    this.root.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);

    this.handleResize();
    this.start();
  }

  static getTranslateXY(el: HTMLElement): [number, number] {
    const style = window.getComputedStyle(el);
    const matrix = style.transform;
    if (!matrix || matrix === 'none') return [0, 0];
    const m = matrix.match(/matrix\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(',').map(Number);
      return [parts[4] || 0, parts[5] || 0];
    }
    return [0, 0];
  }

  private setupGlassElements(): void {
    for (const el of this.glassElements) {
      const pos = window.getComputedStyle(el).position;
      if (pos === 'static') {
        el.style.position = 'relative';
      }
      el.style.overflow = 'visible';

      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '-1';
      el.insertBefore(canvas, el.firstChild);

      this.glassCanvases.set(el, canvas);
    }
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rootRect = this.root.getBoundingClientRect();
    this.sceneCanvas.width = Math.round(rootRect.width * dpr);
    this.sceneCanvas.height = Math.round(rootRect.height * dpr);

    for (const el of this.glassElements) {
      const canvas = this.glassCanvases.get(el);
      if (!canvas) continue;
      const elW = Math.round(el.offsetWidth);
      const elH = Math.round(el.offsetHeight);
      const pad = SHADOW_PAD * 2;
      canvas.width = Math.round((elW + pad) * dpr);
      canvas.height = Math.round((elH + pad) * dpr);
      canvas.style.left = `${-SHADOW_PAD}px`;
      canvas.style.top = `${-SHADOW_PAD}px`;
      canvas.style.width = `${elW + pad}px`;
      canvas.style.height = `${elH + pad}px`;
    }
    this.isDirty = true;
  }

  private handlePointerDown(e: PointerEvent): void {
    // Top-most item check
    for (let i = this.glassElements.length - 1; i >= 0; i--) {
      const el = this.glassElements[i];
      const rect = el.getBoundingClientRect();
      const elW = el.offsetWidth;
      const elH = el.offsetHeight;
      const visualLeft = rect.left + (rect.width - elW) / 2;
      const visualTop = rect.top + (rect.height - elH) / 2;

      if (
        e.clientX >= visualLeft &&
        e.clientX <= visualLeft + elW &&
        e.clientY >= visualTop &&
        e.clientY <= visualTop + elH
      ) {
        const [tx, ty] = CustomLiquidEngine.getTranslateXY(el);
        this.drag.active = true;
        this.drag.element = el;
        this.drag.startX = e.clientX;
        this.drag.startY = e.clientY;
        this.drag.origTx = tx;
        this.drag.origTy = ty;
        el.style.cursor = 'grabbing';
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
        break;
      }
    }
  }

  private handlePointerMove(e: PointerEvent): void {
    if (!this.drag.active || !this.drag.element) {
      return;
    }

    const el = this.drag.element;
    const dx = e.clientX - this.drag.startX;
    const dy = e.clientY - this.drag.startY;
    let newTx = this.drag.origTx + dx;
    let newTy = this.drag.origTy + dy;

    const rootRect = this.root.getBoundingClientRect();
    const elW = el.offsetWidth;
    const elH = el.offsetHeight;
    const elRect = el.getBoundingClientRect();
    const [curTx, curTy] = CustomLiquidEngine.getTranslateXY(el);
    const baseLeft = elRect.left + (elRect.width - elW) / 2 - rootRect.left - curTx;
    const baseTop = elRect.top + (elRect.height - elH) / 2 - rootRect.top - curTy;
    const margin = 10;
    const posLeft = baseLeft + newTx;
    const posTop = baseTop + newTy;
    const maxLeft = rootRect.width - elW - margin;
    const maxTop = rootRect.height - elH - margin;

    if (posLeft < margin) newTx += margin - posLeft;
    if (posTop < margin) newTy += margin - posTop;
    if (posLeft > maxLeft) newTx -= posLeft - maxLeft;
    if (posTop > maxTop) newTy -= posTop - maxTop;

    el.style.transform = `translate(${newTx}px, ${newTy}px)`;
    this.isDirty = true;
  }

  private handlePointerUp(e: PointerEvent): void {
    if (!this.drag.active) return;
    if (this.drag.element) {
      this.drag.element.style.cursor = '';
      try {
        this.drag.element.releasePointerCapture(e.pointerId);
      } catch {}
    }
    this.drag.active = false;
    this.drag.element = null;
    this.isDirty = true;
  }

  private renderSceneBackground(dpr: number): void {
    const rootRect = this.root.getBoundingClientRect();
    const rootW = Math.round(rootRect.width * dpr);
    const rootH = Math.round(rootRect.height * dpr);

    if (this.sceneCanvas.width !== rootW || this.sceneCanvas.height !== rootH) {
      this.sceneCanvas.width = rootW;
      this.sceneCanvas.height = rootH;
    }

    const ctx = this.sceneCtx;
    ctx.clearRect(0, 0, rootW, rootH);

    // 1. Draw sibling <img> background
    const bgImg = this.root.querySelector<HTMLImageElement>('img');
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, rootW, rootH);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, rootW, rootH);
    }

    // 2. Draw high-contrast background decorative graphics (Refraction text & glowing circles)
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rootRect.width;
    const h = rootRect.height;

    // REFRACTION big text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '900 72px system-ui, -apple-system, sans-serif';
    ctx.fillText('REFRACTION', w / 2, h / 2 - 20);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('WebGL Shaders • Real-time Light Bending & Chromatic Aberration', w / 2, h / 2 + 35);

    // Glowing spheres
    ctx.fillStyle = 'rgba(34, 211, 238, 0.5)';
    ctx.beginPath();
    ctx.arc(w / 2 - 70, h / 2 + 80, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(217, 70, 239, 0.5)';
    ctx.fillRect(w / 2 - 25, h / 2 + 56, 48, 48);

    ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.beginPath();
    ctx.arc(w / 2 + 70, h / 2 + 80, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private render(): void {
    if (!this.running) return;

    if (this.isDirty || this.drag.active) {
      const dpr = window.devicePixelRatio || 1;
      const rootRect = this.root.getBoundingClientRect();

      this.renderSceneBackground(dpr);

      for (const el of this.glassElements) {
        const glassCanvas = this.glassCanvases.get(el);
        if (!glassCanvas) continue;

        let elConfig = { ...this.defaultConfig };
        if (el.dataset.config) {
          try {
            elConfig = { ...elConfig, ...JSON.parse(el.dataset.config) };
          } catch {}
        }

        const elRect = el.getBoundingClientRect();
        const elW = el.offsetWidth;
        const elH = el.offsetHeight;

        // Position relative to root
        const sampleX = (elRect.left - rootRect.left - SHADOW_PAD) * dpr;
        const sampleY = (elRect.top - rootRect.top - SHADOW_PAD) * dpr;
        const renderW = glassCanvas.width;
        const renderH = glassCanvas.height;

        this.renderer.uploadAndBlur(this.sceneCanvas, sampleX, sampleY, renderW, renderH, elConfig.blurAmount);
        this.renderer.clear();
        this.renderer.renderGlassPanel(elConfig, elW, elH, dpr);

        const ctx = glassCanvas.getContext('2d')!;
        ctx.clearRect(0, 0, renderW, renderH);
        ctx.drawImage(this.renderer.canvas, 0, 0, renderW, renderH, 0, 0, renderW, renderH);
      }

      this.isDirty = false;
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.isDirty = true;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  markChanged(): void {
    this.isDirty = true;
  }

  updateConfig(config: LiquidGlassElementConfig): void {
    this.defaultConfig = config;
    this.isDirty = true;
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);

    window.removeEventListener('resize', this.onResize);
    this.root.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);

    for (const [el, canvas] of this.glassCanvases) {
      canvas.remove();
      el.style.transform = '';
      el.style.cursor = '';
    }
    this.glassCanvases.clear();
    this.renderer.destroy();
  }
}
