import { describe, it, expect, vi } from 'vitest';

// Мок для CSS модулей
vi.mock('../../tailwind.css', () => ({}));

describe('Footer', () => {
  it('рендерит секцию контактов', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');

    render(<Footer />);
    expect(screen.getByText('Контакты:')).toBeInTheDocument();
  });

  it('рендерит секцию о нас', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');

    render(<Footer />);
    expect(screen.getByText('О нас:')).toBeInTheDocument();
  });

  it('рендерит ссылку на политику конфиденциальности', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');

    render(<Footer />);
    expect(screen.getByText('Политика конфиденциальности')).toBeInTheDocument();
  });

  it('рендерит подпись социальных ссылок', async () => {
    const { render, screen } = await import('@testing-library/react');
    const { Footer } = await import('./Footer');

    render(<Footer />);
    expect(screen.getByText('Ищите нас здесь')).toBeInTheDocument();
  });
});
