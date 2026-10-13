export interface GlassStyleConfig {
  // Appearance & Glass Physics
  blur: number; // px blur (0 - 40)
  opacity: number; // background opacity 0.0 - 1.0
  glassColor: string; // hex or rgb base tint (#ffffff, #000000, #3b82f6, etc.)
  tintIntensity: number; // 0.0 - 1.0 (how strong the color is)
  saturation: number; // 50 - 200%
  brightness: number; // 50 - 150%

  // Border & Reflection / Rim Highlight
  borderWidth: number; // px (0 - 4)
  borderOpacity: number; // 0.0 - 1.0
  borderColor: string; // hex
  edgeHighlight: number; // 0.0 - 1.0 (inner top/edge glow)

  // Geometry & Spacing
  borderRadius: number; // px (0 - 64)
  padding: number; // px (4 - 60)

  // Lighting & Shadows
  shadowOpacity: number; // 0.0 - 1.0
  shadowBlur: number; // px (0 - 60)
  shadowSpread: number; // px (0 - 30)
  specular: number; // 0.0 - 1.0 (glossy reflection highlight)
  chromaticAberration: number; // 0 - 20 (px dispersion offset)
  refraction: number; // 0 - 2.0 (lens distortion / refraction effect)
}

export const defaultGlassConfig: GlassStyleConfig = {
  blur: 16,
  opacity: 0.25,
  glassColor: '#ffffff',
  tintIntensity: 0.6,
  saturation: 130,
  brightness: 105,
  borderWidth: 1,
  borderOpacity: 0.35,
  borderColor: '#ffffff',
  edgeHighlight: 0.4,
  borderRadius: 24,
  padding: 24,
  shadowOpacity: 0.25,
  shadowBlur: 32,
  shadowSpread: -4,
  specular: 0.3,
  chromaticAberration: 0,
  refraction: 0.7,
};

export const presets: Record<string, Partial<GlassStyleConfig>> = {
  crystal: {
    blur: 18,
    opacity: 0.18,
    glassColor: '#ffffff',
    tintIntensity: 0.5,
    borderWidth: 1,
    borderOpacity: 0.45,
    borderColor: '#ffffff',
    edgeHighlight: 0.6,
    borderRadius: 24,
    shadowOpacity: 0.3,
    specular: 0.5,
  },
  frosted: {
    blur: 28,
    opacity: 0.45,
    glassColor: '#f8fafc',
    tintIntensity: 0.8,
    saturation: 110,
    brightness: 110,
    borderWidth: 1,
    borderOpacity: 0.25,
    edgeHighlight: 0.2,
    borderRadius: 20,
    shadowOpacity: 0.2,
  },
  obsidianDark: {
    blur: 20,
    opacity: 0.35,
    glassColor: '#090d16',
    tintIntensity: 0.85,
    saturation: 120,
    brightness: 80,
    borderWidth: 1,
    borderOpacity: 0.2,
    borderColor: '#ffffff',
    edgeHighlight: 0.3,
    borderRadius: 24,
    shadowOpacity: 0.6,
    shadowBlur: 40,
  },
  neonCyan: {
    blur: 16,
    opacity: 0.2,
    glassColor: '#06b6d4',
    tintIntensity: 0.65,
    saturation: 150,
    brightness: 110,
    borderWidth: 1.5,
    borderOpacity: 0.5,
    borderColor: '#67e8f9',
    edgeHighlight: 0.7,
    borderRadius: 28,
    shadowOpacity: 0.35,
    shadowBlur: 30,
    specular: 0.6,
  },
  sunsetAmber: {
    blur: 20,
    opacity: 0.25,
    glassColor: '#f97316',
    tintIntensity: 0.55,
    saturation: 140,
    brightness: 105,
    borderWidth: 1,
    borderOpacity: 0.4,
    borderColor: '#fed7aa',
    edgeHighlight: 0.5,
    borderRadius: 24,
    shadowOpacity: 0.3,
  },
};
