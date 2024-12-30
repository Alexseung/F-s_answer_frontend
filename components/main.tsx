import './main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

const root = ReactDOM.createRoot(
  document.querySelector('#rootReact') as HTMLElement
);

root.render(
  <>
    <App />
  </>
);
