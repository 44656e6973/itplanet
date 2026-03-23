import { describe, it, expect, vi } from 'vitest';

// Мок для CSS модулей
vi.mock('../../index.css', () => ({}));

describe('Footer', () => {
  it('рендерит название компании', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');
    
    render(<Footer />);
    expect(screen.getByText('IT Planet')).toBeInTheDocument();
  });

  it('рендерит копирайт', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');
    
    render(<Footer />);
    expect(screen.getByText(/© 2026 IT Planet\. All rights reserved\./i)).toBeInTheDocument();
  });

  it('рендерит секцию Resources', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');
    
    render(<Footer />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('рендерит секцию Follow', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');
    
    render(<Footer />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
