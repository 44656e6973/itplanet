import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderTest } from '../test/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('рендерит название компании', () => {
    renderTest(<Footer />);
    expect(screen.getByText('IT Planet')).toBeInTheDocument();
  });

  it('рендерит копирайт', () => {
    renderTest(<Footer />);
    expect(screen.getByText(/© 2026 IT Planet\. All rights reserved\./i)).toBeInTheDocument();
  });

  it('рендерит секцию Resources', () => {
    renderTest(<Footer />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('рендерит секцию Follow', () => {
    renderTest(<Footer />);
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });

  it('рендерит ссылки на ресурсы', () => {
    renderTest(<Footer />);
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('рендерит ссылки на соцсети', () => {
    renderTest(<Footer />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });
});
