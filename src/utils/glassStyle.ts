import React from 'react';
import { GlassStyleConfig } from '@/types/glass';

export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function generateGlassStyle(config: GlassStyleConfig): React.CSSProperties {
  const bgRgba = hexToRgba(config.glassColor, config.opacity * config.tintIntensity);
  const borderRgba = hexToRgba(config.borderColor, config.borderOpacity);
  
  // Specular top highlight & Edge rim reflection (프레넬 림 조명)
  const rimColor = `rgba(255, 255, 255, ${config.edgeHighlight})`;
  const bottomRim = `rgba(0, 0, 0, ${config.shadowOpacity * 0.4})`;
  
  const innerShadows = [
    `inset 0 1.5px 2px 0 ${rimColor}`,
    `inset 0 -1.5px 3px 0 ${bottomRim}`,
  ];

  // 굴절(Refraction)을 흉내내는 렌즈 왜곡 굴절 섀도우 (Inner Refraction Ring)
  if (config.refraction > 0) {
    const refrStrength = (config.refraction * 0.4).toFixed(2);
    innerShadows.push(`inset 0 0 ${Math.round(config.refraction * 35)}px ${Math.round(config.refraction * 8)}px rgba(255, 255, 255, ${refrStrength})`);
  }

  // 상단 스펙큘러 조명
  if (config.specular > 0) {
    innerShadows.push(`inset 0 16px 32px -12px rgba(255, 255, 255, ${(config.specular * 0.75).toFixed(2)})`);
  }

  // 색수차 (Chromatic Aberration) 효과 섀도우
  if (config.chromaticAberration > 0) {
    const ca = config.chromaticAberration;
    innerShadows.push(`inset ${ca}px 0 ${ca * 2}px rgba(255, 0, 100, 0.25)`);
    innerShadows.push(`inset -${ca}px 0 ${ca * 2}px rgba(0, 200, 255, 0.25)`);
  }

  const dropShadow = `0 16px ${config.shadowBlur}px ${config.shadowSpread}px rgba(0, 0, 0, ${config.shadowOpacity})`;

  return {
    backgroundColor: bgRgba,
    backdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%) brightness(${config.brightness}%)`,
    WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%) brightness(${config.brightness}%)`,
    borderRadius: `${config.borderRadius}px`,
    borderWidth: `${config.borderWidth}px`,
    borderStyle: config.borderWidth > 0 ? 'solid' : 'none',
    borderColor: borderRgba,
    boxShadow: `${innerShadows.join(', ')}, ${dropShadow}`,
    padding: `${config.padding}px`,
  };
}

export function generateCSSCode(config: GlassStyleConfig): string {
  const bgRgba = hexToRgba(config.glassColor, config.opacity * config.tintIntensity);
  const borderRgba = hexToRgba(config.borderColor, config.borderOpacity);
  const rimColor = `rgba(255, 255, 255, ${config.edgeHighlight})`;
  const bottomRim = `rgba(0, 0, 0, ${config.shadowOpacity * 0.4})`;
  
  const inners = [
    `inset 0 1.5px 2px 0 ${rimColor}`,
    `inset 0 -1.5px 3px 0 ${bottomRim}`,
  ];
  if (config.refraction > 0) {
    inners.push(`inset 0 0 ${Math.round(config.refraction * 35)}px ${Math.round(config.refraction * 8)}px rgba(255, 255, 255, ${(config.refraction * 0.4).toFixed(2)})`);
  }
  if (config.specular > 0) {
    inners.push(`inset 0 16px 32px -12px rgba(255, 255, 255, ${(config.specular * 0.75).toFixed(2)})`);
  }
  if (config.chromaticAberration > 0) {
    inners.push(`inset ${config.chromaticAberration}px 0 ${config.chromaticAberration * 2}px rgba(255, 0, 100, 0.25)`);
    inners.push(`inset -${config.chromaticAberration}px 0 ${config.chromaticAberration * 2}px rgba(0, 200, 255, 0.25)`);
  }

  return `/* Liquid Glass Refraction & Light Effect */
background: ${bgRgba};
backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%) brightness(${config.brightness}%);
-webkit-backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%) brightness(${config.brightness}%);
border-radius: ${config.borderRadius}px;
border: ${config.borderWidth}px solid ${borderRgba};
box-shadow: 
  ${inners.join(',\n  ')},
  0 16px ${config.shadowBlur}px ${config.shadowSpread}px rgba(0, 0, 0, ${config.shadowOpacity});
padding: ${config.padding}px;`;
}
