'use client';

import { ChevronDown, ChevronUp, Palette, RotateCcw, Sliders } from 'lucide-react';
import { useState } from 'react';

import type { LiquidGlassElementConfig } from '@/types/liquidGlass';
import { defaultLiquidGlassConfig, liquidGlassPresets } from '@/types/liquidGlass';

/**
 * WebGL 하단 컨트롤러 컴포넌트의 Props 인터페이스
 */
export interface WebGLBottomControllerProps {
  config: LiquidGlassElementConfig;
  onChange(newConfig: LiquidGlassElementConfig): void;
  bgMode: number;
  onBgModeChange(mode: number): void;
}

export default function WebGLBottomController({
  config,
  onChange,
  bgMode,
  onBgModeChange,
}: WebGLBottomControllerProps) {
  // 모바일 기기에서는 화면을 가리지 않도록 기본 접힘(false), 데스크톱에서는 기본 펼침(true)으로 초기화
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const [activeTab, setActiveTab] = useState<'optics' | 'shape' | 'light' | 'json'>('optics');

  const updateParam = <K extends keyof LiquidGlassElementConfig>(key: K, value: LiquidGlassElementConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const resetToDefault = () => {
    onChange(defaultLiquidGlassConfig);
  };

  const applyPreset = (presetName: string) => {
    const p = liquidGlassPresets[presetName];
    if (p) {
      onChange({
        ...config,
        ...p,
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="bg-slate-950/85 backdrop-blur-2xl text-slate-100 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header Bar: 클릭/탭하면 언제든지 열리고 닫히도록 전체 영역 토글 지원 */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-white/5 cursor-pointer select-none active:bg-white/10 transition"
          >
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs sm:text-sm tracking-wide">WebGL Liquid Shader Controller</span>
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
                Live Optics
              </span>
            </div>

            {/* Presets and Actions */}
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <div className="hidden sm:flex items-center space-x-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                <span className="text-[11px] text-white/50 px-2 font-medium">프리셋:</span>
                {Object.keys(liquidGlassPresets).map((name) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className="px-2.5 py-1 text-xs rounded-lg hover:bg-white/15 text-white/80 hover:text-white capitalize transition font-medium"
                  >
                    {name === 'prismNeon' ? 'Prism' : name === 'deepDark' ? 'Dark' : name}
                  </button>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToDefault();
                }}
                title="기본값 복원"
                className="p-2 sm:p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition border border-white/10 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                aria-label="접힘/펼침 토글"
                className="p-2 sm:p-1.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-white transition active:scale-95"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expandable Controls Body */}
          {isExpanded && (
            <div className="p-6 space-y-5 max-h-110 overflow-y-auto">
              {/* Tabs & Background Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('optics')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'optics'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    빛 굴절 & 광학 (Refraction Optics)
                  </button>
                  <button
                    onClick={() => setActiveTab('light')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'light'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    조명 & 반사 (Specular & Fresnel)
                  </button>
                  <button
                    onClick={() => setActiveTab('shape')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'shape'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    형태 & 곡률 (Bevel & Radius)
                  </button>
                  <button
                    onClick={() => setActiveTab('json')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      activeTab === 'json'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    data-config JSON
                  </button>
                </div>

                {/* Background Selector */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-white/60 flex items-center gap-1 font-medium">
                    <Palette className="w-3.5 h-3.5" /> 배경 이미지:
                  </span>
                  {[
                    { id: 1, label: '숲 & 자연' },
                    { id: 2, label: '모던 건축' },
                    { id: 3, label: '화려한 네온' },
                    { id: 4, label: '컬러 그라디언트' },
                    { id: 5, label: '프리즘 홀로그램' },
                    { id: 6, label: '사이버 사이언스' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => onBgModeChange(bg.id)}
                      className={`px-2.5 py-1 rounded-lg transition font-medium ${
                        bgMode === bg.id
                          ? 'bg-indigo-500 text-white shadow'
                          : 'bg-black/30 text-white/60 hover:text-white'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: Optics & Refraction */}
              {activeTab === 'optics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Refraction */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
                    <div className="flex justify-between text-xs">
                      <span className="text-indigo-200 font-bold">빛 굴절률 (Refraction)</span>
                      <span className="font-mono text-cyan-300 font-bold">{config.refraction}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2.0"
                      step="0.02"
                      value={config.refraction}
                      onChange={(e) => updateParam('refraction', parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-white/50">빛이 유리 렌즈를 통과하며 꺾이는 강도</p>
                  </div>

                  {/* Chromatic Aberration */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-fuchsia-950/30 border border-fuchsia-500/20">
                    <div className="flex justify-between text-xs">
                      <span className="text-fuchsia-200 font-bold">색수차 왜곡 (Chrom. Aberration)</span>
                      <span className="font-mono text-fuchsia-300 font-bold">{config.chromAberration}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.3"
                      step="0.005"
                      value={config.chromAberration}
                      onChange={(e) => updateParam('chromAberration', parseFloat(e.target.value))}
                      className="w-full accent-fuchsia-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-white/50">가장자리 프리즘 무지개 색 번짐 효과</p>
                  </div>

                  {/* Blur Amount */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">배경 블러 (Blur Amount)</span>
                      <span className="font-mono text-white/60">{config.blurAmount}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.02"
                      value={config.blurAmount}
                      onChange={(e) => updateParam('blurAmount', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                    <p className="text-[10px] text-white/50">0이면 크리스탈 선명함, 높으면 프로스트</p>
                  </div>

                  {/* Distortion */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">유리 표면 굴곡 (Distortion)</span>
                      <span className="font-mono text-white/60">{config.distortion}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.distortion}
                      onChange={(e) => updateParam('distortion', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">채도 조정 (Saturation)</span>
                      <span className="font-mono text-white/60">{config.saturation}</span>
                    </div>
                    <input
                      type="range"
                      min="-1.0"
                      max="1.0"
                      step="0.05"
                      value={config.saturation}
                      onChange={(e) => updateParam('saturation', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Brightness */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">밝기 조정 (Brightness)</span>
                      <span className="font-mono text-white/60">{config.brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.5"
                      max="0.5"
                      step="0.02"
                      value={config.brightness}
                      onChange={(e) => updateParam('brightness', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Light & Reflection */}
              {activeTab === 'light' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Specular */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">광택 하이라이트 (Specular)</span>
                      <span className="font-mono text-white/60">{config.specular}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.specular}
                      onChange={(e) => updateParam('specular', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Edge Highlight */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">가장자리 림 조명 (Edge Highlight)</span>
                      <span className="font-mono text-white/60">{config.edgeHighlight}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.edgeHighlight}
                      onChange={(e) => updateParam('edgeHighlight', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Fresnel */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">프레넬 반사율 (Fresnel)</span>
                      <span className="font-mono text-white/60">{config.fresnel}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2.0"
                      step="0.1"
                      value={config.fresnel}
                      onChange={(e) => updateParam('fresnel', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Shadow Opacity */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">그림자 농도 (Shadow Opacity)</span>
                      <span className="font-mono text-white/60">{config.shadowOpacity}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={config.shadowOpacity}
                      onChange={(e) => updateParam('shadowOpacity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Shadow Spread */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">그림자 확산 (Shadow Spread)</span>
                      <span className="font-mono text-white/60">{config.shadowSpread}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={config.shadowSpread}
                      onChange={(e) => updateParam('shadowSpread', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Shape & Bevel */}
              {activeTab === 'shape' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Corner Radius */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">모서리 반경 (Corner Radius)</span>
                      <span className="font-mono text-white/60">{config.cornerRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="2"
                      value={config.cornerRadius}
                      onChange={(e) => updateParam('cornerRadius', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Z Radius (Curvature Depth) */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">베벨 곡면 깊이 (Z-Radius)</span>
                      <span className="font-mono text-white/60">{config.zRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="80"
                      step="2"
                      value={config.zRadius}
                      onChange={(e) => updateParam('zRadius', parseFloat(e.target.value))}
                      className="w-full accent-indigo-400 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Bevel Mode */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/90 font-medium">베벨 렌즈 모드 (Bevel Mode)</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {config.bevelMode === 0 ? '0 (Pill 알약)' : '1 (Dome 돋보기)'}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateParam('bevelMode', 0)}
                        className={`flex-1 py-1 text-xs rounded-lg transition font-medium ${
                          config.bevelMode === 0 ? 'bg-indigo-600 text-white' : 'bg-black/30 text-white/60'
                        }`}
                      >
                        양면 Pill (0)
                      </button>
                      <button
                        onClick={() => updateParam('bevelMode', 1)}
                        className={`flex-1 py-1 text-xs rounded-lg transition font-medium ${
                          config.bevelMode === 1 ? 'bg-indigo-600 text-white' : 'bg-black/30 text-white/60'
                        }`}
                      >
                        반구형 Dome (1)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: JSON config code */}
              {activeTab === 'json' && (
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {`element.dataset.config = JSON.stringify(${JSON.stringify(config, null, 2)});`}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
