import '@testing-library/jest-dom/jest-globals';

import { render, screen } from '@testing-library/react';

import Button from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with given text', () => {
    render(<Button>Click Test</Button>);
    expect(screen.getByRole('button', { name: /click test/i })).toBeInTheDocument();
  });
});
