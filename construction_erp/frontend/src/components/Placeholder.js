import React from "react";

const Placeholder = ({ title, description }) => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};

export default Placeholder;
