import React from 'react'

export default ({ actions }) => {
  const onClick = () => actions.fetch()

  return ({ state }) => (
    <div style={{ padding: '15px 0' }}>
      <div>
        <button onClick={onClick}>Fetch</button>
      </div>
      <div>
        <code>{JSON.stringify(state, null, 2)}</code>
      </div>
    </div>
  )
}
