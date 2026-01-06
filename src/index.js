// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap everything inside HashRouter
root.render(
  <React.StrictMode>
    <HashRouter>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </HashRouter>
  </React.StrictMode>
);

