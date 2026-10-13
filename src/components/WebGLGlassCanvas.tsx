'use client';

import { Music, Pause, Play, Search, ShieldCheck, SkipBack, SkipForward, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CustomLiquidEngine } from '@/lib/CustomLiquidEngine';
import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

/**
 * WebGL 글래스 캔버스 쇼케이스 컴포넌트의 Props 인터페이스
 */
export interface WebGLGlassCanvasProps {
  config: LiquidGlassElementConfig;
  bgMode: number;
}

export default function WebGLGlassCanvas({ config, bgMode }: WebGLGlassCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const liquidGlassInstanceRef = useRef<CustomLiquidEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

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
      className="relative w-full min-h-205 md:min-h-187.5 rounded-3xl overflow-hidden border border-white/15 shadow-2xl select-none"
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

      {/* Direct Children 1: Liquid Glass Stat Card */}
      <div
        className="liquid-glass-item absolute top-6 left-4 md:top-12 md:left-8 w-[calc(100%-2rem)] max-w-xs md:w-80 p-5 md:p-6 z-10 text-white rounded-[28px] md:rounded-[32px] cursor-grab active:cursor-grabbing"
        style={{
          minHeight: '180px',
        }}
      >
        <div className="liquid-glass-content space-y-3 md:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-white/25 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">Liquid Pro</h3>
                <p className="text-[11px] text-white/80">WebGL Shader Card</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-bold rounded-full bg-emerald-500/50 text-white border border-emerald-300/40">
              드래그 가능
            </span>
          </div>

          <div>
            <p className="text-2xl md:text-3xl font-black text-white tracking-tight">$128,490</p>
            <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
              <span>↑ 34.2%</span>
              <span className="text-white/80">진짜 빛 굴절 효과</span>
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex justify-between text-[10px] md:text-[11px] text-white/90 font-mono">
            <span>Refraction: {config.refraction}</span>
            <span>Blur: {config.blurAmount}</span>
          </div>
        </div>
      </div>

      {/* Direct Children 2: Liquid Glass Media Player */}
      <div
        className="liquid-glass-item absolute top-52.5 left-4 md:top-12 md:left-auto md:right-8 w-[calc(100%-2rem)] max-w-xs md:w-88 p-5 md:p-6 z-10 text-white rounded-[28px] md:rounded-[32px] cursor-grab active:cursor-grabbing"
        style={{
          minHeight: '190px',
        }}
      >
        <div className="liquid-glass-content space-y-3 md:space-y-4">
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-linear-to-tr from-pink-500 to-indigo-600 flex items-center justify-center shadow-lg text-white">
              <Music className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs md:text-sm font-bold text-white truncate">Aura Glass Symphony</h4>
              <p className="text-[11px] text-white/80 truncate">Liquid Shader Engine</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 pointer-events-none">
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-3/5" />
            </div>
            <div className="flex justify-between text-[10px] text-white/90 font-mono">
              <span>02:14</span>
              <span>03:45</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center space-x-4 pt-1 pointer-events-auto">
            <button className="p-1.5 rounded-full text-white hover:bg-white/20 transition">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-full bg-white text-slate-900 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-slate-900" />
              ) : (
                <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
              )}
            </button>
            <button className="p-1.5 rounded-full text-white hover:bg-white/20 transition">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Direct Children 3: Circular Magnifier Lens (Bevel Mode 1: Dome) */}
      <div className="liquid-glass-item liquid-glass-lens absolute bottom-28 left-6 md:bottom-24 md:left-16 w-36 h-36 md:w-44 md:h-44 z-20 text-white rounded-full cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center p-3 md:p-4">
        <div className="liquid-glass-content flex flex-col items-center space-y-1">
          <Search className="w-5 h-5 md:w-6 md:h-6 text-white" />
          <span className="font-black text-[11px] md:text-xs text-white tracking-wider">LENS DOME</span>
          <span className="text-[9px] md:text-[10px] text-white/90 font-mono">굴절 돋보기</span>
          <span className="text-[8px] md:text-[9px] px-2 py-0.5 rounded-full bg-black/50 text-cyan-200">
            글자 위로 드래그
          </span>
        </div>
      </div>

      {/* Direct Children 4: Navigation Bar */}
      <div className="liquid-glass-item absolute bottom-28 right-6 md:bottom-24 md:right-16 w-[calc(100%-12rem)] max-w-xs md:w-80 p-3 md:p-4 z-10 text-white rounded-[24px] md:rounded-[28px] cursor-grab active:cursor-grabbing">
        <div className="liquid-glass-content flex items-center justify-around pointer-events-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[11px] md:text-xs font-semibold transition ${
              activeTab === 'home' ? 'bg-white/40 text-white shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            홈
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[11px] md:text-xs font-semibold transition ${
              activeTab === 'feed' ? 'bg-white/40 text-white shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            피드
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-xl text-[11px] md:text-xs font-semibold transition ${
              activeTab === 'settings' ? 'bg-white/40 text-white shadow' : 'text-white/80 hover:text-white'
            }`}
          >
            설정
          </button>
        </div>
      </div>

      {/* Direct Children 5: Center High-Refraction Prism Pill */}
      <div className="liquid-glass-item absolute top-107.5 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 px-5 py-3 md:px-8 md:py-5 z-10 text-white rounded-[32px] md:rounded-[40px] cursor-grab active:cursor-grabbing max-w-[90%]">
        <div className="liquid-glass-content flex items-center gap-2.5 md:gap-3">
          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-cyan-300 shrink-0" />
          <div>
            <h4 className="font-extrabold text-sm md:text-base tracking-wide text-white">Liquid Prism Glass</h4>
            <p className="text-[10px] md:text-xs text-white/90">배경 굴절 왜곡을 실시간으로 확인하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
