import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
<%  if (cssType == 'CSS only') { %>
import "./styles/global.css";<% } if (cssType == 'SASS') { %>
import "./styles/global.scss";<% } if (cssType == 'LESS') { %>
import "./styles/global.less";<% } if (cssType == 'Stylus') { %>
import "./styles/global.styl";<% } %>

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
