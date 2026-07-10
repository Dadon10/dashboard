import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "react-loading-skeleton/dist/skeleton.css";
import NetworkWrapper from './components/Network/NetworkWrapper.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NetworkWrapper>
      <App />
    </NetworkWrapper>
  </StrictMode>
);
