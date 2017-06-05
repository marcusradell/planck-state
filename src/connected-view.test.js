import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import renderer from "react-test-renderer";
import Connect from "../src";

test("actions", () => {
  const initialState = {
    value: "initial"
  };

  const updaters = {
    setValue: value => state => Object.assign({}, state, { value })
  };

  const epics = {};

  const ViewFactory = ({ actions, props }) => {
    const onClick = domEvent => {
      actions.setValue(domEvent.target.value);
    };

    // eslint-disable-next-line react/prop-types
    return ({ state }) => (
      <div>
        <div>actions: {JSON.stringify(Object.keys(actions), null, 2)}</div>
        <button onClick={onClick}>
          setValue
        </button>

        <div>props: {JSON.stringify(props, null, 2)}</div>
        <div>state: {JSON.stringify(state, null, 2)}</div>
      </div>
    );
  };

  const props = { label: "a thing" };

  const connectedView = Connect(props)({
    initialState,
    updaters,
    epics
  })(ViewFactory);

  const expectationPromise = connectedView.viewStateStream
    .skip(1)
    .take(1)
    .forEach(state => {
      const { PureView } = connectedView;
      const tree = renderer.create(<PureView state={state} />).toJSON();
      expect(tree).toMatchSnapshot();
    });

  connectedView.actions.setValue("new Promised value for self");

  return expectationPromise;
});
