import React from 'react';

function MyComponent() {
  return (
    <div>
      my component 2
      {List()}
      </div>
  )
}

function List() {
  const items = ['another div', 'My Component']
  return items.map(i => <div className="someStyle">{i}</div>);
}

export default MyComponent