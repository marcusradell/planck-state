import Rx from "rxjs";

const dataToComponent = ({
  propsTree,
  componentFactoriesByType,
  ViewFactory
}) => {
  const children = Object.keys(propsTree).reduce((accumulator, key) => {
    const { type, props } = propsTree[key];
    // eslint-disable-next-line no-param-reassign
    accumulator[key] = componentFactoriesByType[type](props);
    return accumulator;
  }, {});

  const childViews = Object.keys(children).reduce((accumulator, key) => {
    const { View } = children[key];
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    // eslint-disable-next-line no-param-reassign
    accumulator[capitalizedKey] = View;
    return accumulator;
  }, {});

  const View = ViewFactory({ childViews });

  const stateStreamArray = Object.keys(children).map(
    key => children[key].stateStream
  );

  const stateStreamKeysByIndex = Object.keys(children);

  const stateStream = Rx.Observable.combineLatest(
    ...stateStreamArray,
    (...stateArray) =>
      stateArray.reduce((accumulator, state, index) => {
        // eslint-disable-next-line no-param-reassign
        accumulator[stateStreamKeysByIndex[index]] = state;
        return accumulator;
      }, {})
  );

  return { children, View, stateStream };
};

export default ({ componentFactoriesByType, propsTree }) => ViewFactory => {
  const component = dataToComponent({
    propsTree,
    componentFactoriesByType,
    ViewFactory
  });
  return component;
};
