import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
<%  if (cssType == 'CSS only') { %>
import "./styles/global.css";<% } if (cssType == 'SASS') { %>
import "./styles/global.scss";<% } if (cssType == 'LESS') { %>
import "./styles/global.less";<% } if (cssType == 'Stylus') { %>
import "./styles/global.styl";<% } %>

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
