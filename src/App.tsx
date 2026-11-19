import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from './components/ui';
import { AppRoutes } from './routes/AppRoutes';
import { useAppStore } from './store/appStore';

export default function App() {
  const initializeApp = useAppStore((s) => s.initializeApp);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}
