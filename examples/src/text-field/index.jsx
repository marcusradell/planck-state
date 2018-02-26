import ConnectedComponent from "planck-state";
import Model from "./model";
import View from "./view";

export default props => ConnectedComponent(props)(Model(props))(View);
