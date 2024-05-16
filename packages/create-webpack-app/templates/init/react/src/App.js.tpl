import React from "react";
import webpackLogo from "./assets/webpack.png";

function App() {
    return (
        <div className="container">
            <h1 className="heading">Welcome to your React App!</h1>
            <img src={webpackLogo} alt="webpack logo" />
        </div>
    );
}

export default App;