'use client';

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
      <header className="pt-8 pb-4 px-6 max-w-7xl mx-auto text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          Liquid{' '}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-300 via-indigo-300 to-fuchsia-300">
            Glass UI
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          컴포넌트를 드래그하여 실시간 WebGL 굴절(Refraction)을 확인하세요
        </p>
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
