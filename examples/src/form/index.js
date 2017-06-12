import { ConnectedParent } from "@linasmatkasse/planck-state";
import TextField from "../text-field";
import View from "./view";

const componentFactoriesByType = {
  textField: TextField
};

export default propsTree =>
  ConnectedParent({
    componentFactoriesByType,
    propsTree
  })(View);
