import React, { Component } from 'react'

export const makeView = ({ viewStateStream, PureView }) => {
  class View extends Component {
    componentDidMount() {
      this.subscription = viewStateStream.subscribe(
        state => {
          this.setState(() => state)
        },
        console.error, // eslint-disable-line no-console,
        () => {
          console.error(
            `Observable::completed called inside componentDidMount in the ConnectedView function.
              This should not happen, and the state will not update anymore.`
          )
        }
      )
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    render() {
      return this.state && React.createElement(PureView, this.state, this.props.children)
    }
  }

  return View
}
