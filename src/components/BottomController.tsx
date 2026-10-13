'use client';

import React from 'react';
import { GlassStyleConfig, presets, defaultGlassConfig } from '@/types/glass';
import { generateCSSCode } from '@/utils/glassStyle';
import { Sliders, Copy, Check, RotateCcw, ChevronUp, ChevronDown, Palette } from 'lucide-react';

interface BottomControllerProps {
  config: GlassStyleConfig;
  onChange: (newConfig: GlassStyleConfig) => void;
  bgMode: number;
  onBgModeChange: (mode: number) => void;
}

export const BottomController: React.FC<BottomControllerProps> = ({
  config,
  onChange,
  bgMode,
  onBgModeChange,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'physics' | 'border' | 'light' | 'code'>('physics');

  const updateParam = <K extends keyof GlassStyleConfig>(key: K, value: GlassStyleConfig[K]) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const copyCSS = () => {
    const code = generateCSSCode(config);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToDefault = () => {
    onChange(defaultGlassConfig);
  };

  const applyPreset = (presetName: string) => {
    const p = presets[presetName];
    if (p) {
      onChange({
        ...config,
        ...p,
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Drawer Container */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="bg-slate-900/80 backdrop-blur-2xl text-slate-100 rounded-3xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm tracking-wide">Glass Style Controller</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                Real-time
              </span>
            </div>

            {/* Presets and Actions */}
            <div className="flex items-center space-x-2">
              {/* Presets Pill buttons */}
              <div className="hidden sm:flex items-center space-x-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
                <span className="text-[11px] text-white/50 px-2 font-medium">프리셋:</span>
                {Object.keys(presets).map((name) => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className="px-2.5 py-1 text-xs rounded-lg hover:bg-white/15 text-white/80 hover:text-white capitalize transition"
                  >
                    {name === 'obsidianDark' ? 'Obsidian' : name === 'neonCyan' ? 'Neon' : name === 'sunsetAmber' ? 'Amber' : name}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={resetToDefault}
                title="초기화"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition border border-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Copy CSS Button */}
              <button
                onClick={copyCSS}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : 'CSS 복사'}</span>
              </button>

              {/* Collapse/Expand Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expandable Body */}
          {isExpanded && (
            <div className="p-6 space-y-5 max-h-[460px] overflow-y-auto">
              {/* Controller Tabs & Background Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-white/10">
                {/* Tabs */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('physics')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      activeTab === 'physics'
                        ? 'bg-white/25 text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    굴절 & 투명도 (Refraction)
                  </button>
                  <button
                    onClick={() => setActiveTab('border')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      activeTab === 'border'
                        ? 'bg-white/25 text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    경계선 & 하이라이트 (Rim & Glow)
                  </button>
                  <button
                    onClick={() => setActiveTab('light')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      activeTab === 'light'
                        ? 'bg-white/25 text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    크기 & 그림자 (Shape & Shadows)
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      activeTab === 'code'
                        ? 'bg-white/25 text-white shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    CSS 코드 확인
                  </button>
                </div>

                {/* Background Selector */}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-white/60 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> 배경:
                  </span>
                  {[
                    { id: 1, label: '오로라 그라디언트' },
                    { id: 2, label: '추상 패턴 (다크)' },
                    { id: 3, label: '생동감 넘치는 메시' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => onBgModeChange(bg.id)}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        bgMode === bg.id
                          ? 'bg-white/25 text-white font-medium border border-white/30'
                          : 'bg-black/20 text-white/60 hover:text-white'
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: Physics & Appearance */}
              {activeTab === 'physics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Blur Amount */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">블러 강도 (Blur)</span>
                      <span className="font-mono text-white/50">{config.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={config.blur}
                      onChange={(e) => updateParam('blur', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">투명도 (Opacity)</span>
                      <span className="font-mono text-white/50">{Math.round(config.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={config.opacity}
                      onChange={(e) => updateParam('opacity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Glass Base Color */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">유리 틴트 색상 (Tint Color)</span>
                      <span className="font-mono text-white/50">{config.glassColor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.glassColor}
                        onChange={(e) => updateParam('glassColor', e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-white/20"
                      />
                      <input
                        type="text"
                        value={config.glassColor}
                        onChange={(e) => updateParam('glassColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Tint Intensity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">색상 반영비 (Tint Intensity)</span>
                      <span className="font-mono text-white/50">{Math.round(config.tintIntensity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.tintIntensity}
                      onChange={(e) => updateParam('tintIntensity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">배경 채도 (Saturation)</span>
                      <span className="font-mono text-white/50">{config.saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="5"
                      value={config.saturation}
                      onChange={(e) => updateParam('saturation', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Brightness */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">밝기 조정 (Brightness)</span>
                      <span className="font-mono text-white/50">{config.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="5"
                      value={config.brightness}
                      onChange={(e) => updateParam('brightness', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Border & Edge Highlight */}
              {activeTab === 'border' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Border Width */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">경계선 두께 (Border Width)</span>
                      <span className="font-mono text-white/50">{config.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.5"
                      value={config.borderWidth}
                      onChange={(e) => updateParam('borderWidth', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Border Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">경계선 투명도 (Border Opacity)</span>
                      <span className="font-mono text-white/50">{Math.round(config.borderOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.borderOpacity}
                      onChange={(e) => updateParam('borderOpacity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Border Color */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">경계선 색상 (Border Color)</span>
                      <span className="font-mono text-white/50">{config.borderColor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.borderColor}
                        onChange={(e) => updateParam('borderColor', e.target.value)}
                        className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-white/20"
                      />
                      <input
                        type="text"
                        value={config.borderColor}
                        onChange={(e) => updateParam('borderColor', e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-black/30 border border-white/20 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Edge Highlight (Rim Glow) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">상단 림 하이라이트 (Edge Rim)</span>
                      <span className="font-mono text-white/50">{Math.round(config.edgeHighlight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.edgeHighlight}
                      onChange={(e) => updateParam('edgeHighlight', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Specular Highlight */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">광택 스펙큘러 (Specular)</span>
                      <span className="font-mono text-white/50">{Math.round(config.specular * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={config.specular}
                      onChange={(e) => updateParam('specular', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Refraction Distortion */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">굴절 렌즈 왜곡 (Refraction)</span>
                      <span className="font-mono text-white/50">{config.refraction}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.05"
                      value={config.refraction}
                      onChange={(e) => updateParam('refraction', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Chromatic Aberration */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">색수차 왜곡 (Chrom. Aberration)</span>
                      <span className="font-mono text-white/50">{config.chromaticAberration}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={config.chromaticAberration}
                      onChange={(e) => updateParam('chromaticAberration', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Shape & Shadows */}
              {activeTab === 'light' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {/* Border Radius */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">모서리 곡률 (Border Radius)</span>
                      <span className="font-mono text-white/50">{config.borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="2"
                      value={config.borderRadius}
                      onChange={(e) => updateParam('borderRadius', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Padding */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">내부 여백 (Padding)</span>
                      <span className="font-mono text-white/50">{config.padding}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      step="4"
                      value={config.padding}
                      onChange={(e) => updateParam('padding', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Shadow Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">그림자 농도 (Shadow Opacity)</span>
                      <span className="font-mono text-white/50">{Math.round(config.shadowOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.8"
                      step="0.05"
                      value={config.shadowOpacity}
                      onChange={(e) => updateParam('shadowOpacity', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Shadow Blur */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">그림자 퍼짐 (Shadow Blur)</span>
                      <span className="font-mono text-white/50">{config.shadowBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="2"
                      value={config.shadowBlur}
                      onChange={(e) => updateParam('shadowBlur', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Shadow Spread */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80">그림자 확산 (Shadow Spread)</span>
                      <span className="font-mono text-white/50">{config.shadowSpread}px</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="20"
                      step="1"
                      value={config.shadowSpread}
                      onChange={(e) => updateParam('shadowSpread', parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-1.5 bg-white/20 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Generated CSS Code */}
              {activeTab === 'code' && (
                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {generateCSSCode(config)}
                  </pre>
                  <button
                    onClick={copyCSS}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs flex items-center gap-1.5 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '복사 완료' : '전체 복사'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
