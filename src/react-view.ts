import React, { Component } from "react";

export const makeView = (viewStateStream, PureView) => {
  class View extends Component {
    private subscription: any;

    componentDidMount() {
      this.subscription = viewStateStream.subscribe(
        state => {
          this.setState(() => state);
        },
        error => {
          throw error;
        },
        () => {
          throw new Error(`Observable::completed called inside componentDidMount in the ConnectedView function.
          This should not happen, and the state will not update anymore.`);
        }
      );
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return (
        this.state &&
        React.createElement(PureView, this.state, this.props.children)
      );
    }
  }

  return View;
};
