import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import "./styles/global.<%= styleExtension %>";

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
