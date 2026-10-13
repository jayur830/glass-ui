'use client';

import React from 'react';
import { GlassStyleConfig } from '@/types/glass';
import { generateGlassStyle } from '@/utils/glassStyle';
import { DraggableGlassCard } from '@/components/DraggableGlassCard';
import { Play, Pause, SkipForward, SkipBack, Heart, Send, Check, Sparkles, Bell, Compass, Music, User, ShieldCheck, Search, Image as ImageIcon } from 'lucide-react';

interface ComponentShowcaseProps {
  config: GlassStyleConfig;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ config }) => {
  const glassStyle = generateGlassStyle(config);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isLiked, setIsLiked] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('feed');
  const [inputText, setInputText] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 relative">
      {/* Visual background reference patterns to test refraction when dragging over */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-40 select-none">
        <div className="w-72 h-72 rounded-full border-4 border-dashed border-indigo-400/40 animate-[spin_60s_linear_infinite]" />
        <div className="text-white/10 font-black text-8xl tracking-widest hidden md:block">
          LIQUID
        </div>
        <div className="w-80 h-80 rounded-3xl bg-gradient-to-tr from-pink-500/20 to-cyan-500/20 blur-xl" />
      </div>

      {/* Grid containing draggable components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {/* 1. Hero Stat Card */}
        <DraggableGlassCard
          id="stat-card"
          initialPos={{ x: 0, y: 0 }}
          title="대시보드 통계 카드"
          style={glassStyle}
          className="flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-white">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white tracking-wide text-sm drop-shadow-sm">Liquid UI Pro</h3>
                <p className="text-xs text-white/75 drop-shadow-sm">Next-Gen Interface</p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 backdrop-blur-sm">
              LIVE v2.4
            </span>
          </div>

          <div className="my-2 space-y-1">
            <p className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              $84,250.00
            </p>
            <p className="text-xs font-medium text-emerald-300 drop-shadow-sm flex items-center gap-1">
              <span>↑ 24.8%</span>
              <span className="text-white/60">vs last month</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
            <span>Refraction Blur</span>
            <span className="font-mono text-white/90">{config.blur}px</span>
          </div>
        </DraggableGlassCard>

        {/* 2. Glass Media Player */}
        <DraggableGlassCard
          id="media-player"
          initialPos={{ x: 0, y: 0 }}
          title="음악 플레이어"
          style={glassStyle}
          className="flex flex-col justify-between"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center shadow-lg text-white">
              <Music className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate drop-shadow-sm">Midnight Prism Waves</h4>
              <p className="text-xs text-white/70 truncate">Aether & Liquid Strings</p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full hover:bg-white/15 transition-colors text-white"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white/80'}`} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 my-2">
            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="h-full bg-white/90 rounded-full w-2/5 shadow-sm" />
            </div>
            <div className="flex justify-between text-[11px] text-white/70 font-mono">
              <span>01:42</span>
              <span>03:58</span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-white text-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-900" /> : <Play className="w-4 h-4 fill-slate-900 ml-0.5" />}
            </button>
            <button className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </DraggableGlassCard>

        {/* 3. Interactive Input & Form */}
        <DraggableGlassCard
          id="form-card"
          initialPos={{ x: 0, y: 0 }}
          title="인터랙티브 폼"
          style={glassStyle}
          className="flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white drop-shadow-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                인터랙티브 인풋
              </h4>
              <span className="text-[11px] text-white/60">Instant</span>
            </div>
            <p className="text-xs text-white/80 mb-3 leading-relaxed drop-shadow-sm">
              글래스를 다양한 배경 요소 위로 드래그하여 투과 및 굴절 왜곡을 확인하세요.
            </p>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="피드백이나 메모 입력..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/15 text-white placeholder-white/50 text-xs border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md"
              />
            </div>

            <button
              onClick={() => {
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 2000);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white/25 hover:bg-white/35 active:bg-white/40 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/30 backdrop-blur-md shadow-sm transition-all"
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>저장 완료!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>글래스 버튼 실행</span>
                </>
              )}
            </button>
          </div>
        </DraggableGlassCard>

        {/* 4. Magnifier / Glass Lens Dome (굴절 돋보기 렌즈) */}
        <DraggableGlassCard
          id="lens-card"
          initialPos={{ x: 0, y: 0 }}
          title="굴절 렌즈 (Magnifier Dome)"
          style={{
            ...glassStyle,
            borderRadius: '9999px',
          }}
          className="flex flex-col items-center justify-center text-center p-8 aspect-square"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/25 flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Search className="w-5 h-5" />
            </div>
            <p className="font-bold text-white text-sm">Glass Magnifier</p>
            <p className="text-[11px] text-white/70 max-w-[180px]">
              배경 텍스트나 그래픽 위로 가져가면 굴절 효과를 극대화합니다.
            </p>
            <span className="inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono">
              Refraction: {config.refraction}
            </span>
          </div>
        </DraggableGlassCard>

        {/* 5. Glass Floating Navigation */}
        <DraggableGlassCard
          id="nav-bar"
          initialPos={{ x: 0, y: 0 }}
          title="플로팅 탭 내비게이션"
          style={glassStyle}
          className="flex flex-col justify-between"
        >
          <div className="flex items-center justify-around py-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${
                activeTab === 'feed' ? 'text-white bg-white/20 shadow-inner' : 'text-white/60 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>탐색</span>
            </button>
            <button
              onClick={() => setActiveTab('notice')}
              className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${
                activeTab === 'notice' ? 'text-white bg-white/20 shadow-inner' : 'text-white/60 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>알림</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${
                activeTab === 'profile' ? 'text-white bg-white/20 shadow-inner' : 'text-white/60 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>프로필</span>
            </button>
          </div>
          <div className="pt-3 border-t border-white/10 flex justify-between text-[11px] text-white/60">
            <span>Tab Indicator</span>
            <span className="capitalize text-white/90 font-medium">{activeTab}</span>
          </div>
        </DraggableGlassCard>

        {/* 6. Preset Badges & System Info */}
        <DraggableGlassCard
          id="badges-card"
          initialPos={{ x: 0, y: 0 }}
          title="상태 태그 & 칩"
          style={glassStyle}
          className="flex flex-col justify-between"
        >
          <div>
            <h4 className="text-sm font-semibold text-white drop-shadow-sm mb-2">프리셋 뱃지 모음</h4>
            <div className="flex flex-wrap gap-2 my-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 backdrop-blur-md">
                #LiquidGlass
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-100 border border-indigo-400/30 backdrop-blur-md">
                #Draggable
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/30 text-cyan-100 border border-cyan-400/30 backdrop-blur-md">
                #Refraction
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
            <span>모서리 반경</span>
            <span className="font-mono text-white/90">{config.borderRadius}px</span>
          </div>
        </DraggableGlassCard>
      </div>
    </div>
  );
};
