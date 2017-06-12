import React from "react";

export default ({ props, actions }) => {
  const onChange = domEvent => {
    actions.setValue(domEvent.target.value);
  };

  return ({ state }) => (
    <div style={{ margin: "30px" }}>
      <div style={{ margin: "15px" }}>
        <label htmlFor={props.id}>{props.label}</label>
        <input
          style={{ marginLeft: "5px" }}
          id={props.id}
          type="text"
          onChange={onChange}
          value={state.value}
        />
      </div>
      <div style={{ margin: "15px" }}>
        <div style={{ margin: "15px" }}>
          <code><h3>state: {JSON.stringify(state, null, 2)}</h3></code>
        </div>
        <div style={{ margin: "15px" }}>
          <code>
            props: {JSON.stringify(props, null, 2)}
          </code>
        </div>
      </div>
    </div>
  );
};
