/**
 * Pure WebGL 1.0 Shader sources for Liquid Glass refraction effect.
 */

export const VS_QUAD = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export const FS_BLUR = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_dir;
varying vec2 v_uv;
void main() {
  vec4 s  = texture2D(u_tex, v_uv) * 0.227027;
  s += texture2D(u_tex, v_uv + u_dir * 1.0) * 0.194594;
  s += texture2D(u_tex, v_uv - u_dir * 1.0) * 0.194594;
  s += texture2D(u_tex, v_uv + u_dir * 2.0) * 0.121622;
  s += texture2D(u_tex, v_uv - u_dir * 2.0) * 0.121622;
  s += texture2D(u_tex, v_uv + u_dir * 3.0) * 0.054054;
  s += texture2D(u_tex, v_uv - u_dir * 3.0) * 0.054054;
  s += texture2D(u_tex, v_uv + u_dir * 4.0) * 0.016216;
  s += texture2D(u_tex, v_uv - u_dir * 4.0) * 0.016216;
  gl_FragColor = s;
}
`;

export const VS_GLASS = `
attribute vec2 a_pos;
uniform vec2 u_center;
uniform vec2 u_size;
uniform vec2 u_res;
uniform float u_pad;
varying vec2 v_localPx;
varying vec2 v_screenUV;

void main() {
  vec2 total = u_size + vec2(u_pad * 2.0);
  v_localPx = a_pos * total;
  vec2 px = u_center + a_pos * total;
  v_screenUV = vec2(px.x / u_res.x, 1.0 - px.y / u_res.y);
  vec2 ndc = (px / u_res) * 2.0 - 1.0;
  ndc.y = -ndc.y;
  gl_Position = vec4(ndc, 0.0, 1.0);
}
`;

export const FS_GLASS = `
precision highp float;

uniform sampler2D u_bgTex;
uniform sampler2D u_blurTex;
uniform vec2 u_size;
uniform float u_radius;
uniform vec2 u_res;

uniform float u_refract;
uniform float u_chroma;
uniform float u_edgeHL;
uniform float u_spec;
uniform float u_fresnel;
uniform float u_distort;
uniform float u_alpha;
uniform float u_sat;
uniform float u_tint;
uniform float u_zRadius;
uniform float u_brightness;
uniform float u_shadowAlpha;
uniform float u_shadowSpread;
uniform float u_shadowOffY;
uniform float u_bevelMode;

varying vec2 v_localPx;
varying vec2 v_screenUV;

float rrSDF(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + vec2(r);
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - r;
}

float bevelHeight(float d, float zR) {
  if (d <= 0.0) return 0.0;
  if (d >= zR) return zR;
  return sqrt(d * (2.0 * zR - d));
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 half_ = u_size * 0.5;
  float r = min(u_radius, min(half_.x, half_.y));
  float sdf = rrSDF(v_localPx, half_, r);

  // Drop shadow
  if (sdf > 0.0) {
    float sdfShadow = rrSDF(v_localPx - vec2(0.0, u_shadowOffY), half_, r);
    float d = max(sdfShadow - 1.0, 0.0);
    float spread = max(u_shadowSpread, 1.0);
    float falloff = 1.0 / (spread * spread);
    float outerShadow = exp(-d * d * falloff) * 0.65;
    float contactShadow = exp(-d * 0.08 / max(spread * 0.04, 0.01)) * 0.35;
    float shadow = (outerShadow + contactShadow) * u_shadowAlpha;
    gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
    return;
  }

  // Anti-aliased mask
  float mask = 1.0 - smoothstep(-1.5, 0.5, sdf);
  float maxD = min(half_.x, half_.y);
  float inside = -sdf;
  float edge = smoothstep(maxD * 0.35, 0.0, inside);

  // Surface normal
  float zR = u_zRadius;
  float e = 2.0;
  float dC = inside;
  float dR = -rrSDF(v_localPx + vec2(e, 0.0), half_, r);
  float dL = -rrSDF(v_localPx - vec2(e, 0.0), half_, r);
  float dU = -rrSDF(v_localPx + vec2(0.0, e), half_, r);
  float dD = -rrSDF(v_localPx - vec2(0.0, e), half_, r);
  float hC = bevelHeight(dC, zR);
  float hR = bevelHeight(dR, zR);
  float hL = bevelHeight(dL, zR);
  float hU = bevelHeight(dU, zR);
  float hD = bevelHeight(dD, zR);
  vec2 hGrad = vec2(hR - hL, hU - hD) / (2.0 * e);
  vec3 N = normalize(vec3(-hGrad, 1.0));

  float depth = smoothstep(0.0, zR, inside);

  // Refraction calculation
  vec2 pxToUV = vec2(1.0, -1.0) / u_res;
  float ior = 1.5;
  float refrPow = 1.0 - 1.0 / ior;
  float thickness = hC * 2.0;
  float thickNorm = thickness / max(zR * 2.0, 1.0);
  vec2 refrPx;

  if (u_bevelMode < 0.5) {
    vec2 exitRefr = hGrad * refrPow;
    vec2 entryRefr = hGrad * refrPow;
    vec2 throughRefr = entryRefr * thickNorm * 0.5;
    refrPx = (exitRefr + entryRefr + throughRefr) * u_refract * 30.0;
    vec2 centerDir = -v_localPx / max(half_, vec2(1.0));
    refrPx += centerDir * u_refract * 4.0 * depth;
  } else {
    refrPx = -v_localPx * u_refract * depth * 0.35;
  }
  vec2 refr = refrPx * pxToUV;

  // Micro-distortion
  vec2 ns = v_localPx * 0.08;
  vec2 absPxToUV = vec2(1.0) / u_res;
  vec2 micro = (vec2(hash(ns), hash(ns + vec2(37.0))) - 0.5) * u_distort * 4.0 * absPxToUV;

  // Chromatic aberration
  float caS = u_chroma * 18.0 * (edge * 0.7 + 0.3) * 2.0;
  vec2 caD = N.xy * caS * pxToUV;
  vec2 base = v_screenUV + refr + micro;

  vec3 sharp = vec3(
    texture2D(u_bgTex, base + caD).r,
    texture2D(u_bgTex, base).g,
    texture2D(u_bgTex, base - caD).b
  );
  vec3 blur = vec3(
    texture2D(u_blurTex, base + caD).r,
    texture2D(u_blurTex, base).g,
    texture2D(u_blurTex, base - caD).b
  );

  float edgeMix = (1.0 - edge * 0.15);
  vec3 col = mix(sharp, blur, edgeMix);

  col *= 1.0 + u_brightness;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 1.0 + u_sat);
  col = mix(col, col * vec3(0.92, 0.95, 1.05), u_tint);
  col *= 1.0 + 0.06 * depth;

  // Fresnel & Specular
  float fres = pow(1.0 - abs(N.z), 4.0) * u_fresnel;
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(0.4, 0.7, 1.0));
  vec3 H1 = normalize(L1 + V);
  float sp1 = pow(max(dot(N, H1), 0.0), 90.0);
  vec3 L2 = normalize(vec3(-0.3, -0.5, 1.0));
  vec3 H2 = normalize(L2 + V);
  float sp2 = pow(max(dot(N, H2), 0.0), 50.0) * 0.3;
  vec3 L3 = normalize(vec3(0.1, 0.3, 1.0));
  float spB = pow(max(dot(N, L3), 0.0), 6.0) * 0.1;
  vec3 L4 = normalize(vec3(0.0, 0.9, 0.4));
  vec3 H4 = normalize(L4 + V);
  float sp4 = pow(max(dot(N, H4), 0.0), 120.0) * 0.6;
  float totalSpec = (sp1 + sp2 + spB + sp4) * u_spec;

  float borderWidth = 1.5;
  float innerStroke = smoothstep(-borderWidth - 1.0, -borderWidth, sdf) * (1.0 - smoothstep(-1.0, 0.0, sdf));
  float topBias = 0.5 + 0.5 * (-v_localPx.y / half_.y);
  innerStroke *= (0.4 + 0.6 * topBias);

  float rim = edge * u_edgeHL * 0.22;
  float innerGlow = smoothstep(5.0, 0.0, -sdf) * u_edgeHL * 0.15;
  float envRefl = (N.y * 0.5 + 0.5) * fres * 0.08;

  vec3 fin = col;
  fin += vec3(totalSpec);
  fin += vec3(rim + innerGlow);
  fin += vec3(innerStroke * u_edgeHL * 0.55);
  fin += vec3(envRefl);
  fin = mix(fin, vec3(1.0), fres * 0.2);

  gl_FragColor = vec4(fin, mask * u_alpha);
}
`;
