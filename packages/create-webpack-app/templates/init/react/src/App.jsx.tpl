import React from "react";
<%if (useReactRouter) { %>
import AppRouter from "./router";
<%} else {%>
import Home from "./components/Home";
<%}%>

const App = () => {
  return (
      <%if (useReactRouter) { %>
      <AppRouter />
      <%} else {%>
      <Home />
      <% } %>
  );
}

export default App;
