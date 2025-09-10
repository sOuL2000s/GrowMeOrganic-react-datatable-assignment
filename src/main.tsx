import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// PrimeReact Theme and Core CSS
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Choose your preferred theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // PrimeIcons for icons
import 'primeflex/primeflex.css'; // PrimeFlex for utility classes (essential for layout)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);