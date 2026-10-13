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
  ToggleLeft,
} from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { GlassButton } from '@/components/ui/GlassButton';
import { CustomLiquidEngine } from '@/lib/CustomLiquidEngine';
import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

export const BACKGROUND_LIST = [
  { id: 1, name: '숲 & 자연', src: '/background-1.avif' },
  { id: 2, name: '모던 건축', src: '/background-2.avif' },
  { id: 3, name: '화려한 네온', src: '/background-3.avif' },
  { id: 4, name: '컬러 그라디언트', src: '/background-4.jpg' },
  { id: 5, name: '프리즘 홀로그램', src: '/background-5.jpg' },
  { id: 6, name: '사이버 사이언스', src: '/background-6.jpg' },
];

export interface WebGLGlassCanvasProps {
  config: LiquidGlassElementConfig;
  bgMode: number;
  onBgModeChange?: (mode: number) => void;
}

export default function WebGLGlassCanvas({ config, bgMode, onBgModeChange }: WebGLGlassCanvasProps) {
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

  const currentBg = BACKGROUND_LIST.find((bg) => bg.id === bgMode) || BACKGROUND_LIST[0];
  const bgImageSrc = currentBg.src;

  const handlePrevBg = () => {
    if (!onBgModeChange) return;
    const currentIndex = BACKGROUND_LIST.findIndex((bg) => bg.id === bgMode);
    const prevIndex = (currentIndex - 1 + BACKGROUND_LIST.length) % BACKGROUND_LIST.length;
    onBgModeChange(BACKGROUND_LIST[prevIndex].id);
  };

  const handleNextBg = () => {
    if (!onBgModeChange) return;
    const currentIndex = BACKGROUND_LIST.findIndex((bg) => bg.id === bgMode);
    const nextIndex = (currentIndex + 1) % BACKGROUND_LIST.length;
    onBgModeChange(BACKGROUND_LIST[nextIndex].id);
  };

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
      className="relative w-full min-h-[1250px] md:min-h-[900px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl select-none"
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

      {/* Top Background Carousel Bar (배경 넘기기 바) */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-lg">
        <button
          type="button"
          onClick={handlePrevBg}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition active:scale-95"
          title="이전 배경"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">이전 배경</span>
        </button>

        {/* Background Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-[65%] sm:max-w-none">
          <div className="hidden md:flex items-center gap-1 text-[11px] text-white/60 font-medium mr-1 shrink-0">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
            <span>배경 선택:</span>
          </div>
          {BACKGROUND_LIST.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => onBgModeChange?.(bg.id)}
              className={`px-2.5 py-1 text-xs rounded-xl font-medium shrink-0 transition ${
                bgMode === bg.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
              }`}
            >
              {bg.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNextBg}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition active:scale-95"
          title="다음 배경"
        >
          <span className="hidden sm:inline">다음 배경</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Glass Button (독립 디자인 시스템 컴포넌트) */}
      <div className="absolute top-20 left-4 md:top-24 md:left-8 z-10 flex gap-2">
        <GlassButton variant="primary" size="md" className="w-40">
          {/* <Sparkles className="w-4 h-4 text-cyan-300" /> */}
          <span>Glass Button</span>
        </GlassButton>
      </div>

      {/* 2. Glass Input (인풋) */}
      <div className="liquid-glass-item absolute top-36 left-4 md:top-24 md:left-64 px-4 py-2.5 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing w-[calc(100%-2rem)] max-w-xs md:w-64">
        <div className="liquid-glass-content flex items-center gap-2">
          <Search className="w-4 h-4 text-white/60 shrink-0" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Glass Input 입력..."
            className="w-full bg-transparent text-xs text-white placeholder-white/50 focus:outline-none"
          />
        </div>
      </div>

      {/* 3. Glass Tabs (탭) */}
      <div className="liquid-glass-item absolute top-52 left-4 md:top-24 md:left-140 p-1.5 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content flex items-center gap-1">
          {(['all', 'popular', 'latest'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                activeTab === tab ? 'bg-white/30 text-white shadow-sm' : 'text-white/60 hover:text-white'
              }`}
            >
              {tab === 'all' ? '전체' : tab === 'popular' ? '인기' : '최신'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Glass Switch (스위치) */}
      <div className="liquid-glass-item absolute top-68 left-4 md:top-44 md:left-8 px-4 py-3 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content flex items-center gap-3">
          <ToggleLeft className="w-4 h-4 text-emerald-300" />
          <span className="text-xs font-semibold">스위치 토글</span>
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
      </div>

      {/* 5. Glass Slider (슬라이더) */}
      <div className="liquid-glass-item absolute top-84 left-4 md:top-44 md:left-64 px-4 py-3 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing w-[calc(100%-2rem)] max-w-xs md:w-64">
        <div className="liquid-glass-content space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="flex items-center gap-1 text-white/90">
              <Sliders className="w-3.5 h-3.5 text-cyan-300" /> 글래스 슬라이더
            </span>
            <span className="font-mono text-cyan-300 font-bold">{sliderValue}%</span>
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

      {/* 6. Glass Select (셀렉트) */}
      <div className="liquid-glass-item absolute top-104 left-4 md:top-44 md:left-140 px-3.5 py-2.5 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing w-[calc(100%-2rem)] max-w-xs md:w-56">
        <div className="liquid-glass-content relative">
          <select
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            className="w-full text-xs text-white bg-transparent pr-7 appearance-none focus:outline-none cursor-pointer font-medium"
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
          <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
        </div>
      </div>

      {/* 7. Glass Checkbox (체크박스) */}
      <div className="liquid-glass-item absolute top-120 left-4 md:top-68 md:left-8 px-4 py-3 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
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
              {isChecked1 && <Check className="w-3 h-3 stroke-3" />}
            </span>
            <span>실시간 굴절</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
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
              {isChecked2 && <Check className="w-3 h-3 stroke-3" />}
            </span>
            <span>블러 적용</span>
          </label>
        </div>
      </div>

      {/* 8. Glass Radio (라디오) */}
      <div className="liquid-glass-item absolute top-136 left-4 md:top-68 md:left-80 px-4 py-3 z-10 text-white rounded-2xl cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold mr-1">
            <RadioIcon className="w-3.5 h-3.5" />
            <span>라디오:</span>
          </div>
          <label onClick={() => setRadioChoice('standard')} className="flex items-center gap-2 cursor-pointer">
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                radioChoice === 'standard' ? 'border-cyan-300' : 'border-white/40'
              }`}
            >
              {radioChoice === 'standard' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />}
            </span>
            <span>스탠다드</span>
          </label>

          <label onClick={() => setRadioChoice('premium')} className="flex items-center gap-2 cursor-pointer">
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                radioChoice === 'premium' ? 'border-cyan-300' : 'border-white/40'
              }`}
            >
              {radioChoice === 'premium' && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />}
            </span>
            <span className="text-cyan-200">프리미엄</span>
          </label>
        </div>
      </div>

      {/* 9. Glass Container & Card (컨테이너 & 카드) */}
      <div className="liquid-glass-item absolute top-154 left-4 md:top-92 md:left-8 w-[calc(100%-2rem)] max-w-sm md:w-84 p-5 z-10 text-white rounded-[28px] cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Layers className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Glass Container</h3>
                <p className="text-[11px] text-white/70">독립 카드 컴포넌트</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
              Card
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            리퀴드 글래스 엔진이 투명 재질과 가장자리 하이라이트를 실시간 굴절 연산합니다.
          </p>
        </div>
      </div>

      {/* 10. Glass Calendar (캘린더) */}
      <div className="liquid-glass-item absolute top-200 left-4 md:top-92 md:left-100 w-[calc(100%-2rem)] max-w-sm md:w-88 p-5 z-10 text-white rounded-[28px] cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content space-y-3">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                <CalendarIcon className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="font-bold text-xs tracking-wide">Calendar (2026. {selectedMonth})</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedMonth(Math.max(1, selectedMonth - 1))}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedMonth(Math.min(12, selectedMonth + 1))}
                className="p-1 rounded-lg hover:bg-white/20 transition"
              >
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-white/60 py-0.5">
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
                  className={`h-7 rounded-lg flex items-center justify-center font-medium transition ${
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
        </div>
      </div>

      {/* 11. Circular Magnifier Lens (돋보기 렌즈 - 볼록 굴절) */}
      <div className="liquid-glass-item liquid-glass-lens absolute top-250 left-6 md:top-40 md:right-12 w-40 h-40 md:w-44 md:h-44 z-20 text-white rounded-full cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center p-4">
        <div className="liquid-glass-content flex flex-col items-center space-y-1">
          <Search className="w-6 h-6 text-cyan-300" />
          <span className="font-black text-xs md:text-sm text-white tracking-wider">LENS DOME</span>
          <span className="text-[10px] text-white/90 font-mono">볼록 돋보기 렌즈</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-cyan-200">글자 위로 드래그</span>
        </div>
      </div>
    </div>
  );
}
