// import TextField from "./text-field";
import Form from "./form";

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

export default () => Form(propsTree);
