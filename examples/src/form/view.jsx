import React from "react";

export default ({ childViews: { First, Second } }) => () => (
  <div>
    <First />
    <Second />
  </div>
);
