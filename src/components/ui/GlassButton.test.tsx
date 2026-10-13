import '@testing-library/jest-dom/jest-globals';

import { fireEvent, render, screen } from '@testing-library/react';

import { GlassButton } from './GlassButton';

describe('GlassButton Component', () => {
  it('renders correctly with label', () => {
    render(<GlassButton>Liquid Click</GlassButton>);
    expect(screen.getByRole('button', { name: /liquid click/i })).toBeInTheDocument();
  });

  it('renders with variants and sizes', () => {
    const { container } = render(
      <GlassButton variant="primary" size="lg">
        Primary Large
      </GlassButton>,
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('liquid-glass-item');
  });

  it('handles click events properly', () => {
    const handleClick = jest.fn();
    render(<GlassButton onClick={handleClick}>Trigger</GlassButton>);
    fireEvent.click(screen.getByRole('button', { name: /trigger/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports custom glassConfig data attribute', () => {
    const { container } = render(
      <GlassButton glassConfig={{ refraction: 1.5, blurAmount: 0.2 }}>Configured Button</GlassButton>,
    );
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('data-config');
    expect(button?.getAttribute('data-config')).toContain('"refraction":1.5');
  });
});
