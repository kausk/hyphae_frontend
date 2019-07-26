import React from 'react';

function Results(props) {

  return (
    <div>
      <h1>
        Analysis Results: {props.title}
      </h1>

      <h2>
        Area: {props.area}
      </h2>

      <img width="160" height="160" ng-src={props.src}  />
    </div>
  );
}

export default Results;
