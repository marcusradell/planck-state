const setValue = value => state => Object.assign({}, state, { value });

const updaters = { setValue };

export default props => {
  const { id } = props;
  const initialState = {
    value: "",
    id
  };

  const model = { initialState, updaters };

  return model;
};
