// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap everything inside HashRouter
root.render(
  <React.StrictMode>
    <HashRouter>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <App />
      </DndProvider>
    </HashRouter>
  </React.StrictMode>
);

