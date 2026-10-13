export interface LiquidGlassElementConfig {
  blurAmount: number;
  refraction: number;
  chromAberration: number;
  edgeHighlight: number;
  specular: number;
  fresnel: number;
  distortion: number;
  cornerRadius: number;
  zRadius: number;
  opacity: number;
  saturation: number;
  tintStrength: number;
  brightness: number;
  shadowOpacity: number;
  shadowSpread: number;
  shadowOffsetY: number;
  floating: boolean;
  button: boolean;
  bevelMode: number;
}

export const defaultLiquidGlassConfig: LiquidGlassElementConfig = {
  blurAmount: 0.25,
  refraction: 0.8,
  chromAberration: 0.05,
  edgeHighlight: 0.1,
  specular: 0.2,
  fresnel: 1.0,
  distortion: 0.0,
  cornerRadius: 32,
  zRadius: 32,
  opacity: 1.0,
  saturation: 0.1,
  tintStrength: 0.0,
  brightness: 0.0,
  shadowOpacity: 0.35,
  shadowSpread: 10,
  shadowOffsetY: 8,
  floating: true,
  button: false,
  bevelMode: 0,
};

export const liquidGlassPresets: Record<string, Partial<LiquidGlassElementConfig>> = {
  crystal: {
    blurAmount: 0.0,
    refraction: 1.1,
    chromAberration: 0.08,
    edgeHighlight: 0.2,
    specular: 0.4,
    fresnel: 1.2,
    cornerRadius: 32,
    zRadius: 32,
    shadowOpacity: 0.3,
  },
  frosted: {
    blurAmount: 0.45,
    refraction: 0.4,
    chromAberration: 0.02,
    edgeHighlight: 0.05,
    specular: 0.1,
    cornerRadius: 24,
    zRadius: 24,
    shadowOpacity: 0.25,
  },
  magnifier: {
    bevelMode: 1,
    blurAmount: 0.0,
    refraction: 1.5,
    chromAberration: 0.12,
    edgeHighlight: 0.25,
    specular: 0.5,
    cornerRadius: 45,
    zRadius: 45,
    shadowOpacity: 0.4,
  },
  prismNeon: {
    blurAmount: 0.15,
    refraction: 1.25,
    chromAberration: 0.18,
    edgeHighlight: 0.3,
    specular: 0.6,
    brightness: 0.1,
    saturation: 0.4,
    cornerRadius: 28,
    zRadius: 28,
  },
  deepDark: {
    blurAmount: 0.3,
    refraction: 0.6,
    chromAberration: 0.03,
    edgeHighlight: 0.1,
    brightness: -0.25,
    shadowOpacity: 0.6,
    cornerRadius: 32,
    zRadius: 32,
  },
};
