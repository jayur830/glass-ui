'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import type { LiquidGlassElementConfig } from '@/types/liquidGlass';

const glassButtonVariants = cva(
  'liquid-glass-item group/glass-btn relative inline-flex items-center justify-center font-medium select-none cursor-pointer overflow-hidden transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation',
  {
    variants: {
      variant: {
        default: 'bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-lg backdrop-blur-xl',
        primary:
          'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-100 border border-cyan-400/40 shadow-lg shadow-cyan-500/10 backdrop-blur-xl',
        prism:
          'bg-gradient-to-r from-fuchsia-500/20 via-indigo-500/20 to-cyan-500/20 hover:from-fuchsia-500/30 hover:to-cyan-500/30 text-white border border-white/30 shadow-xl backdrop-blur-xl',
        dark: 'bg-black/40 hover:bg-black/60 text-slate-100 border border-white/15 shadow-2xl backdrop-blur-2xl',
        outline: 'bg-transparent hover:bg-white/10 text-white border-2 border-white/30 backdrop-blur-md',
      },
      size: {
        sm: 'h-8 px-3.5 text-xs rounded-xl gap-1.5',
        md: 'h-10 px-5 text-sm rounded-2xl gap-2',
        lg: 'h-12 px-6 text-base rounded-[20px] gap-2.5',
        icon: 'h-10 w-10 p-0 rounded-2xl justify-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassButtonVariants> {
  /**
   * WebGL Liquid Shader 광학 설정 커스텀 파라미터 (선택)
   */
  glassConfig?: Partial<LiquidGlassElementConfig>;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, glassConfig, children, ...props }, ref) => {
    const configData = glassConfig ? JSON.stringify(glassConfig) : undefined;

    return (
      <button
        ref={ref}
        type="button"
        data-config={configData}
        className={cn(glassButtonVariants({ variant, size, className }))}
        {...props}
      >
        <span className="liquid-glass-content relative z-10 flex items-center justify-center gap-2 pointer-events-none">
          {children}
        </span>
      </button>
    );
  },
);

GlassButton.displayName = 'GlassButton';

export { glassButtonVariants };
export default GlassButton;
