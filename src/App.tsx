import { RouterProvider } from 'react-router-dom';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { router } from './router';

function App() {
  useTokenRefresh();

  return <RouterProvider router={router} />;
}

export default App;
