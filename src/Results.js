import React from 'react';

function Results(props) {

  return (
    <div>
      <h1>
        {props.title}
      </h1>

      <h2>
        Area: {props.area}
      </h2>

      <img src={props.src}  />
    </div>
  );
}

export default Results;
