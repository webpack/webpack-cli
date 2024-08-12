import React<% if (useReactState) { %>, { useState } <% } %> from "react";
import webpackLogo from "../assets/webpack.png";
import HelloWorld from "./HelloWorld";
<% if (cssType !== 'none' && isCSS) { %>
import "./Home.css";
<% } %>

const App = () => {
<% if (useReactState) { %>
  const [ count, setCount ] = useState(0);
  const increment = () => setCount(count => count + 1);
  const decrement = () => setCount(count => count - 1);
<% } %>

  return (
    <main>
      <div id="app">
        <img alt="Webpack logo" src={webpackLogo} />
          <HelloWorld msg="Hello World" />
    <% if (useReactState) { %>
          <p>Count: {count}</p>
          <button className="btn-primary" onClick={decrement}>Decrement</button>
          <button className="btn-secondary" onClick={increment}>Increment</button>
    <% } %>
      </div>
    </main>
  );
}

export default App;
