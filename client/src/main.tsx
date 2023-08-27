import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pages from './routes/Pages';
import App from './routes/App';
import './global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:*?" Component={Pages} />
        <Route path="/app/:*?" Component={App} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
