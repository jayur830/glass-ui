'use client';

import { Info, Layers, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { LiquidGlassElementConfig } from '@/types/liquidGlass';
import { defaultLiquidGlassConfig } from '@/types/liquidGlass';

// SSR 비활성화로 WebGL 및 DOM 캔버스 초기화 보장
const WebGLGlassCanvas = dynamic(() => import('@/components/WebGLGlassCanvas'), { ssr: false });

const WebGLBottomController = dynamic(() => import('@/components/WebGLBottomController'), { ssr: false });

export default function Home() {
  const [config, setConfig] = useState<LiquidGlassElementConfig>(defaultLiquidGlassConfig);
  const [bgMode, setBgMode] = useState<number>(1);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden pb-72">
      {/* Header Section */}
      <header className="pt-10 pb-6 px-6 max-w-7xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>Real WebGL Shader Refraction Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
          Liquid{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
            Glass UI
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          참고 사이트(
          <a
            href="https://liquid-glass.ybouane.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 underline hover:text-indigo-300"
          >
            liquid-glass.ybouane.com
          </a>
          )의 실제 WebGL 셰이더 파이프라인을 연동하여, 컴포넌트를 드래그할 때 배경의 실제 빛 굴절(Refraction)과
          색수차(Chromatic Aberration) 왜곡을 실시간으로 렌더링합니다.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <Layers className="w-3.5 h-3.5" /> 각 글래스 카드를 자유롭게 드래그해보세요
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Info className="w-3.5 h-3.5" /> 하단 컨트롤러로 굴절률(Refraction) 실시간 조절
          </span>
        </div>
      </header>

      {/* WebGL Canvas & Draggable Components */}
      <section className="max-w-7xl mx-auto px-4">
        <WebGLGlassCanvas config={config} bgMode={bgMode} />
      </section>

      {/* Bottom Sticky WebGL Optics Controller */}
      <WebGLBottomController config={config} onChange={setConfig} bgMode={bgMode} onBgModeChange={setBgMode} />
    </main>
  );
}
