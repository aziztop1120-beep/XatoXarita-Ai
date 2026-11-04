import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LangProvider } from './i18n/LangContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/auth.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
