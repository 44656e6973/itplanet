import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

// Базовая обёртка для тестов (без глобальных стилей)
export function renderTest(component: ReactElement, options?: Omit<RenderOptions, 'queries'>) {
  return render(component, options);
}
