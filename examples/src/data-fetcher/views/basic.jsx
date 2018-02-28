import React from 'react'

/* eslint-disable react/prop-types */
const SuccessState = ({ state }) => (
  <div>
    <h4>Success!</h4>
    {state.items.map((item, key) => <div key={key}>{item.companyName}</div>)}
  </div>
)
const ErrorState = ({ state }) => (
  <div>
    <h4>Errors</h4>
    {state.errors.map((item, key) => <div key={key}>{item.title}</div>)}
  </div>
)
const LoadingState = ({ state }) => (
  <div>
    <h4>Loading</h4>
    {state.items.map((item, key) => <div key={key}>{item.title}</div>)}
  </div>
)
const NonInitialState = ({ state }) => (
  <div>
    {state.errors ? (
      <ErrorState state={state} />
    ) : state.loading ? (
      <LoadingState state={state} />
    ) : (
      <SuccessState state={state} />
    )}
  </div>
)
const InitialState = () => <h4>Nothing loaded yet</h4>

export default ({ actions }) => {
  const onClick = () => actions.fetch()

  return ({ state }) => (
    <div style={{ padding: '15px 0' }}>
      <div>
        <button
          style={{
            color: 'yellow',
            background: 'black',
            padding: '10px',
            border: 'none',
            fontSize: '16px',
          }}
          onClick={onClick}
        >
          Fetch
        </button>
      </div>
      <div>
        {state.isInitial ? <InitialState /> : <NonInitialState state={state} />}
      </div>
    </div>
  )
}
