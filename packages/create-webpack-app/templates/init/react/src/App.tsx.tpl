import React from "react";
<%if (useReactRouter) { %>
import AppRouter from "./router";
<%} else {%>
import Home from "./components/Home";
<%}%>

const App: React.FC = () => {
  return (
      <%if (useReactRouter) { %>
      <AppRouter />
      <%} else {%>
      <Home />
      <%}%>
  );
}

export default App;
