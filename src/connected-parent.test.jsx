import renderer from "react-test-renderer";
import React from "react";
import ConnectedParent from "./connected-parent";
import Connect from "./index";

test("ConnectedParent", () => {
  const initialState = {
    value: "initial"
  };

  const updaters = {
    setValue: value => state => Object.assign({}, state, { value })
  };

  const Model = props => ({
    initialState: Object.assign({}, initialState, { id: props.id }),
    updaters
  });

  // eslint-disable-next-line react/prop-types
  const ViewFactory = ({ actions }) => ({ state }) => (
    <div>
      <input
        type="text"
        value={state.value}
        onChange={domEvent => actions.setValue(domEvent.target.value)}
      />
    </div>
  );

  const TextField = props => Connect(props)(Model(props))(ViewFactory);

  const propsTree = {
    first: {
      props: {
        id: "theFirstId",
        label: "first text field"
      },
      type: "textField"
    },
    second: {
      props: {
        id: "theSecondId",
        label: "second text field"
      },
      type: "textField"
    }
  };

  const componentFactoriesByType = {
    textField: TextField
  };

  const component = ConnectedParent({
    componentFactoriesByType,
    propsTree
  })(({ childViews: { First, Second } }) => () => (
    <div> <First /> <Second /> </div>
  ));

  const expectedPromise = component.stateStream
    .skip(1)
    .take(1)
    .forEach(state => {
      expect(state).toMatchSnapshot();

      const { View } = component;

      const tree = renderer.create(<View />).toJSON();
      expect(tree).toMatchSnapshot();
    });

  component.children.first.actions.setValue("testing");

  return expectedPromise;
});
