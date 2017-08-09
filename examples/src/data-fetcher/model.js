const initialState = {
  isInitial: true,
  loading: false,
  data: [],
  errors: []
};

const FetchEpics = ({ fetchService: service }) => {
  const actionUpdater = () => state =>
    Object.assign({}, state, { loading: true });

  const successUpdater = data => state =>
    Object.assign({}, state, {
      isInitial: false,
      loading: false,
      errors: false,
      data
    });

  const errorUpdater = errors => state =>
    Object.assign({}, state, {
      isInitial: false,
      loading: false,
      errors
    });

  return {
    service,
    actionUpdater,
    successUpdater,
    errorUpdater
  };
};

export default ({ fetchService }) => {
  const epics = {
    fetch: FetchEpics({ fetchService })
  };

  return { initialState, epics };
};
