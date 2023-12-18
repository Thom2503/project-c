import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const baseUrl = "/";
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

reportWebVitals();

root.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>);


