import React from 'react'

const SuccessState = ({ state }) => (
  <div>
    <h4>Success!</h4>
    {state.service.items.map(item => (
      <div key={item.companyName}>{item.companyName}</div>
    ))}
  </div>
)
const ErrorState = ({ state }) => (
  <div>
    <h4>{state.error.title}</h4>
    <div>{state.error.description}</div>
  </div>
)

const ValidState = ({ state }) =>
  state.loading ? (
    <LoadingState state={state} />
  ) : (
    <SuccessState state={state} />
  )

const LoadingState = ({ state }) => (
  <div>
    <h4>Loading</h4>
    {state.service &&
      state.service.items.map(item => <div key={item.title}>{item.title}</div>)}
  </div>
)
const HydratedState = ({ state }) => (
  <div>
    {state.error ? <ErrorState state={state} /> : <ValidState state={state} />}
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
        {state.loading === null ? (
          <InitialState state={state} />
        ) : (
          <HydratedState state={state} />
        )}
      </div>
    </div>
  )
}
