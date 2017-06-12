/* globals document */

import React from "react";
import ReactDOM from "react-dom";
import Application from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

const application = Application();

const View = application.View;

// @NOTE: Open the javascript console to see the entire state tree.
// This is often used to submit the state to the server.
application.stateStream.forEach(state => {
  console.clear();
  console.log(state);
});

ReactDOM.render(<View />, document.getElementById("root"));
registerServiceWorker();
