import React from 'react';
import ReactDOM from 'react-dom';
import logo from "./index.png";
import "./styles/global.css";

ReactDOM.render(
    <>
        <h1 className={"heading"}>Hello from webpack!</h1>
        <img src={logo} alt="webpack logo" />
    </>,
    document.getElementById("root")
);
