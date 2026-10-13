'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';

interface DraggableGlassCardProps {
  id: string;
  initialPos: { x: number; y: number };
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  title?: string;
}

export const DraggableGlassCard: React.FC<DraggableGlassCardProps> = ({
  id,
  initialPos,
  className = '',
  style = {},
  children,
  title,
}) => {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, posX: initialPos.x, posY: initialPos.y });

  const handlePointerDown = (e: React.PointerEvent) => {
    // 인풋이나 버튼 등 대화형 요소 클릭 시에는 드래그 방지
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select, textarea')) {
      return;
    }

    setIsDragging(true);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    };

    if (dragRef.current) {
      dragRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    setPosition({
      x: startPosRef.current.posX + dx,
      y: startPosRef.current.posY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragRef.current) {
      try {
        dragRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  return (
    <div
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        ...style,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 40 : 20,
        userSelect: 'none',
        touchAction: 'none',
      }}
      className={`relative transition-shadow duration-200 ${isDragging ? 'scale-[1.02] shadow-2xl' : ''} ${className}`}
    >
      {/* Drag Handle Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 opacity-70 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 text-[11px] text-white/80 font-medium">
          <Move className="w-3.5 h-3.5 text-indigo-300" />
          <span>{title || '드래그 가능'}</span>
        </div>
        <span className="text-[10px] text-white/50 font-mono">
          X: {Math.round(position.x)}, Y: {Math.round(position.y)}
        </span>
      </div>

      {children}
    </div>
  );
};
