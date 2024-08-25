import React from "react";

interface Props {
  msg: string;
}

const HelloWorld: React.FC<Props> = (props: Props) => {
  return (
    <div className="container">
      <h1 className="heading">
        {props.msg}
      </h1>
      <p>
        This is a webpack + React project.
      </p>
    </div>
  );
}

export default HelloWorld;
