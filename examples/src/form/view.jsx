import React from "react";

export default ({ childViews: { First, Second } }) => () => (
  <div style={{ margin: "30px" }}>
    <h1>planck-state form example</h1>
    <h2>Open console to see the latest state</h2>
    <First />
    <Second />
    <div style={{ marginTop: "50px" }}>
      npm: <a href="https://www.npmjs.com/package/@linasmatkasse/planck-state">
        @linasmatkasse/planck-state
      </a>
    </div>
  </div>
);
