import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider
      desiredChainId={ChainId.Sepolia}
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>
);