'use client';

import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  Radio as RadioIcon,
  Search,
  Sliders,
  Sparkles,
  ToggleLeft,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CustomLiquidEngine } from '@/lib/CustomLiquidEngine';
import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

export interface WebGLGlassCanvasProps {
  config: LiquidGlassElementConfig;
  bgMode: number;
}

export default function WebGLGlassCanvas({ config, bgMode }: WebGLGlassCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liquidGlassInstanceRef = useRef<CustomLiquidEngine | null>(null);

  // UI Interactive States
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'latest'>('all');
  const [inputText, setInputText] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [sliderValue, setSliderValue] = useState(70);
  const [isChecked1, setIsChecked1] = useState(true);
  const [isChecked2, setIsChecked2] = useState(false);
  const [radioChoice, setRadioChoice] = useState<'standard' | 'premium'>('premium');
  const [selectedMonth, setSelectedMonth] = useState(10);
  const [selectedDay, setSelectedDay] = useState(13);
  const [selectValue, setSelectValue] = useState('high-refraction');

  const bgImageSrc = bgMode === 1 ? '/background-1.avif' : bgMode === 2 ? '/background-2.avif' : '/background-3.avif';

  // 1. Initialise Custom WebGL Liquid Glass Engine
  useEffect(() => {
    if (!rootRef.current) return;

    if (liquidGlassInstanceRef.current) {
      liquidGlassInstanceRef.current.destroy();
      liquidGlassInstanceRef.current = null;
    }

    const glassElements = rootRef.current.querySelectorAll<HTMLElement>('.liquid-glass-item');
    if (glassElements.length === 0) return;

    glassElements.forEach((el) => {
      const itemConfig = { ...config };
      if (el.classList.contains('liquid-glass-lens')) {
        itemConfig.bevelMode = 1;
        itemConfig.cornerRadius = 60;
        itemConfig.zRadius = 60;
        itemConfig.refraction = Math.max(config.refraction, 1.2);
      }
      el.dataset.config = JSON.stringify(itemConfig);
    });

    const instance = new CustomLiquidEngine({
      root: rootRef.current,
      glassElements,
      defaultConfig: config,
    });

    liquidGlassInstanceRef.current = instance;

    return () => {
      if (liquidGlassInstanceRef.current) {
        liquidGlassInstanceRef.current.destroy();
        liquidGlassInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Update config dynamically when props change
  useEffect(() => {
    if (!rootRef.current || !liquidGlassInstanceRef.current) {
      return;
    }

    const glassElements = rootRef.current.querySelectorAll<HTMLElement>('.liquid-glass-item');
    glassElements.forEach((el) => {
      const itemConfig = { ...config };
      if (el.classList.contains('liquid-glass-lens')) {
        itemConfig.bevelMode = 1;
        itemConfig.cornerRadius = 60;
        itemConfig.zRadius = 60;
        itemConfig.refraction = Math.max(config.refraction, 1.2);
      }
      el.dataset.config = JSON.stringify(itemConfig);
    });

    try {
      liquidGlassInstanceRef.current.updateConfig(config);
      liquidGlassInstanceRef.current.markChanged();
    } catch {}
  }, [config]);

  // 3. Mark background changed when image changes
  useEffect(() => {
    if (liquidGlassInstanceRef.current) {
      setTimeout(() => {
        try {
          liquidGlassInstanceRef.current?.markChanged();
        } catch {}
      }, 50);
    }
  }, [bgMode]);

  return (
    <div
      ref={rootRef}
      className="relative w-full min-h-[920px] md:min-h-[820px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl select-none"
      style={{
        position: 'relative',
        touchAction: 'pan-y',
      }}
    >
      {/* Background sibling image captured by LiquidGlass WebGL shader */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgImageSrc}
        alt="Shader Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        onLoad={() => {
          if (liquidGlassInstanceRef.current) {
            liquidGlassInstanceRef.current.markChanged();
          }
        }}
      />

      {/* Decorative background text & high-contrast graphics to highlight refraction distortion */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white/30 tracking-widest drop-shadow-lg">
          REFRACTION
        </h2>
        <p className="text-base sm:text-xl md:text-2xl font-bold text-white/40 tracking-wider">
          WebGL Shaders • Real-time Light Bending & Chromatic Aberration
        </p>
        <div className="flex gap-4 opacity-30 mt-4">
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-cyan-400 blur-sm animate-bounce" />
          <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-fuchsia-500 blur-sm" />
          <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-amber-400 blur-sm" />
        </div>
      </div>

      {/* 1. Glass Container (컨테이너): 종합 컴포넌트 뷰 */}
      <div
        className="liquid-glass-item absolute top-6 left-4 md:top-8 md:left-8 w-[calc(100%-2rem)] max-w-sm md:w-[360px] p-5 md:p-6 z-10 text-white rounded-[32px] cursor-grab active:cursor-grabbing"
        style={{ minHeight: '340px' }}
      >
        <div className="liquid-glass-content space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Layers className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">Glass Container</h3>
                <p className="text-[11px] text-white/70">폼 컨트롤 & 옵션</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
              드래그 가능
            </span>
          </div>

          {/* Input & Button (인풋 & 버튼) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">글래스 인풋 & 버튼</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="텍스트 입력..."
                  className="w-full h-9 pl-8 pr-3 text-xs rounded-xl bg-white/15 border border-white/25 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:bg-white/25 transition"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              </div>
              <button
                type="button"
                className="h-9 px-3 text-xs font-semibold rounded-xl bg-white/30 hover:bg-white/40 active:scale-95 text-white border border-white/30 transition shadow-sm"
              >
                적용
              </button>
            </div>
          </div>

          {/* Switch & Slider (스위치 & 슬라이더) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ToggleLeft className="w-4 h-4 text-emerald-300" />
                <span className="text-xs text-white/90">스위치 토글</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSwitchOn(!isSwitchOn)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSwitchOn ? 'bg-cyan-500/80' : 'bg-white/20'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isSwitchOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-300" /> 슬라이더
                </span>
                <span className="font-mono">{sliderValue}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-cyan-300"
              />
            </div>
          </div>

          {/* Checkbox (체크박스) */}
          <div className="pt-2 border-t border-white/15 space-y-2">
            <div className="text-[11px] font-semibold text-white/70">체크박스</div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/90">
                <input
                  type="checkbox"
                  checked={isChecked1}
                  onChange={(e) => setIsChecked1(e.target.checked)}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                    isChecked1 ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-white/10 border-white/30'
                  }`}
                >
                  {isChecked1 && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span>실시간 굴절</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/90">
                <input
                  type="checkbox"
                  checked={isChecked2}
                  onChange={(e) => setIsChecked2(e.target.checked)}
                  className="hidden"
                />
                <span
                  className={`w-4 h-4 rounded-md flex items-center justify-center border transition ${
                    isChecked2 ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-white/10 border-white/30'
                  }`}
                >
                  {isChecked2 && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span>블러 적용</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Glass Card & Tabs & Select & Radio (카드, 탭, 셀렉트, 라디오) */}
      <div
        className="liquid-glass-item absolute top-96 left-4 md:top-8 md:left-auto md:right-8 w-[calc(100%-2rem)] max-w-sm md:w-[360px] p-5 md:p-6 z-10 text-white rounded-[32px] cursor-grab active:cursor-grabbing"
        style={{ minHeight: '340px' }}
      >
        <div className="liquid-glass-content space-y-4">
          {/* Card Header & Tabs (탭) */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-wide text-white">Glass Card & Tabs</h3>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
              옵션 카드
            </span>
          </div>

          {/* Tabs (탭) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/25 rounded-xl border border-white/15">
            {(['all', 'popular', 'latest'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 text-xs font-semibold rounded-lg transition ${
                  activeTab === tab ? 'bg-white/30 text-white shadow-sm' : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'all' ? '전체' : tab === 'popular' ? '인기' : '최신'}
              </button>
            ))}
          </div>

          {/* Select (셀렉트) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/80">글래스 셀렉트 (Select)</label>
            <div className="relative">
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                className="w-full h-9 px-3 pr-8 text-xs rounded-xl bg-white/15 border border-white/25 text-white appearance-none focus:outline-none focus:border-cyan-400 focus:bg-white/25 transition cursor-pointer"
              >
                <option value="high-refraction" className="bg-slate-900 text-white">
                  고굴절 크리스탈 모드
                </option>
                <option value="frosted-soft" className="bg-slate-900 text-white">
                  프로스티드 소프트 글래스
                </option>
                <option value="dome-lens" className="bg-slate-900 text-white">
                  볼록 렌즈 돋보기 모드
                </option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          </div>

          {/* Radio (라디오) */}
          <div className="space-y-2 pt-1 border-t border-white/15">
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
              <RadioIcon className="w-3.5 h-3.5 text-purple-300" />
              <span>라디오 옵션 선택</span>
            </div>
            <div className="space-y-1.5">
              <label
                onClick={() => setRadioChoice('standard')}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                  radioChoice === 'standard'
                    ? 'bg-white/20 border-cyan-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      radioChoice === 'standard' ? 'border-cyan-300' : 'border-white/40'
                    }`}
                  >
                    {radioChoice === 'standard' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />}
                  </span>
                  <span className="text-xs text-white font-medium">스탠다드 글래스</span>
                </div>
                <span className="text-[11px] text-white/60">기본 왜곡</span>
              </label>

              <label
                onClick={() => setRadioChoice('premium')}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                  radioChoice === 'premium'
                    ? 'bg-white/20 border-cyan-400/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      radioChoice === 'premium' ? 'border-cyan-300' : 'border-white/40'
                    }`}
                  >
                    {radioChoice === 'premium' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />}
                  </span>
                  <span className="text-xs text-white font-medium">프리미엄 리퀴드</span>
                </div>
                <span className="text-[11px] text-cyan-300 font-semibold">색수차 특화</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Glass Calendar (캘린더) */}
      <div
        className="liquid-glass-item absolute top-[720px] left-4 md:top-[400px] md:left-8 w-[calc(100%-2rem)] max-w-sm md:w-[360px] p-5 md:p-6 z-10 text-white rounded-[32px] cursor-grab active:cursor-grabbing"
        style={{ minHeight: '340px' }}
      >
        <div className="liquid-glass-content space-y-3">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <CalendarIcon className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">Glass Calendar</h3>
                <p className="text-[11px] text-white/70">2026년 {selectedMonth}월</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedMonth(Math.max(1, selectedMonth - 1))}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedMonth(Math.min(12, selectedMonth + 1))}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-white/60 py-1">
            <span>일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Empty slots for day alignment */}
            <span />
            <span />
            <span />
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === selectedDay;
              const isToday = day === 13;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`h-8 rounded-lg flex items-center justify-center font-medium transition ${
                    isSelected
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-md scale-105'
                      : isToday
                        ? 'border border-cyan-400/60 text-cyan-200 bg-white/10'
                        : 'hover:bg-white/20 text-white/90'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/80">
            <span>선택된 날짜:</span>
            <span className="font-mono text-cyan-300 font-semibold">
              2026-10-{selectedDay.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Circular Magnifier Lens (돋보기 렌즈 - 볼록 굴절) */}
      <div className="liquid-glass-item liquid-glass-lens absolute top-[1080px] left-6 md:top-[430px] md:left-[420px] w-40 h-40 md:w-48 md:h-48 z-20 text-white rounded-full cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center p-4">
        <div className="liquid-glass-content flex flex-col items-center space-y-1">
          <Search className="w-6 h-6 text-cyan-300" />
          <span className="font-black text-xs md:text-sm text-white tracking-wider">LENS DOME</span>
          <span className="text-[10px] text-white/90 font-mono">볼록 돋보기 렌즈</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-cyan-200">글자 위로 드래그</span>
        </div>
      </div>

      {/* 5. Center Prism Pill (글래스 버튼 & 뱃지) */}
      <div className="liquid-glass-item absolute top-[1260px] left-1/2 -translate-x-1/2 md:top-[680px] md:left-1/2 md:-translate-x-1/2 px-6 py-4 z-10 text-white rounded-[32px] cursor-grab active:cursor-grabbing max-w-[90%]">
        <div className="liquid-glass-content flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm md:text-base tracking-wide text-white">Liquid Glass Components</h4>
            <p className="text-[11px] text-white/80">
              컨테이너, 버튼, 인풋, 탭, 스위치, 슬라이더, 체크박스, 라디오, 카드, 셀렉트, 캘린더
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
