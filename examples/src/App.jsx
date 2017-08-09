import React from "react";
import Form from "./form";
import * as DataFetcher from "./data-fetcher";

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

export default ({ services }) => {
  const form = Form(propsTree);
  const basicDataFetcher = DataFetcher.BasicDataFetcher({ services });
  const debugDataFetcher = DataFetcher.DebugDataFetcher({ services });

  const View = () => (
    <div style={{ margin: "30px" }}>
      <h1>planck-state examples</h1>
      <div>
        <div style={{ marginTop: "50px" }}>
          npm:
          <a href="https://www.npmjs.com/package/@linasmatkasse/planck-state">
            @linasmatkasse/planck-state
          </a>
        </div>

        <h2>Form example</h2>
        <p>Open console to see the latest state</p>
        <form.View />
      </div>
      <div style={{ paddingTop: "100px" }}>
        <h2>Epics and multi-view example</h2>
        <p>
          You only define fetch services (Promises) and state updaters. Planck-state makes it work.
        </p>
        <p>
          Write your component state once, and the team can extend it with multiple views.
        </p>
        <h3>Basic data fetcher view</h3>
        <basicDataFetcher.View />
        <h3>Debug data fetcher view</h3>
        <debugDataFetcher.View />
      </div>
    </div>
  );

  // @NOTE: Open the javascript console to see the entire state tree.
  // This is often used to submit the state to the server.
  form.stateStream.forEach(state => {
    // eslint-disable-next-line no-console
    console.log(state);
  });

  return View;
};
