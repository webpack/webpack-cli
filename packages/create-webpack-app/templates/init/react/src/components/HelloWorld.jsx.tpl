import React from "react";


const HelloWorld = ({ msg })  => {
  return (
    <div className="container">
      <h1 className="heading">
        {msg}
      </h1>
      <p>
        This is a webpack + React project.
      </p>
    </div>
  );
}

export default HelloWorld;
