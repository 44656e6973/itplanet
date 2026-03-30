import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initializeAuth } from './stores/authStore'
import './tailwind.css'

// Initialize auth state before rendering
const initializeApp = async () => {
  await initializeAuth();
};

// Wrapper component to initialize auth
const AppWrapper = () => {
  useEffect(() => {
    initializeApp();
  }, []);

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
