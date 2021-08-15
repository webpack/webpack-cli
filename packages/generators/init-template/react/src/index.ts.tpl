import React from 'react';
import ReactDOM from 'react-dom';
import logo from "./index.png";

ReactDOM.render(
    <>
        <h1>Hello from webpack!</h1>
        <img src={logo} alt="webpack logo" />
    </>,
    document.getElementById("root")
);
