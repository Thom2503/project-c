import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const baseUrl = "/";
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// serviceWorkerRegistration.register();


reportWebVitals();

navigator.serviceWorker.register('service-worker.js');
navigator.serviceWorker.ready.then((registration) => {
	return registration.pushManager.getSubscription().then(async (subscription) => {
		if (subscription) return subscription;

		// krijg de subscription
	});
});

root.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>);


