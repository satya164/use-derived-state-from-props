# use-derived-state-from-props

React hook that implements `getDerivedStateFromProps` for function components.

It works similarly to how [`getDerivedStateFromProps`](https://react.dev/reference/react/Component#static-getderivedstatefromprops) works in class components, and is intended to simplify migration from class components to function components.

## Installation

Open a Terminal in the project root and run:

```sh
npm install use-derived-state-from-props
```

## Usage

The `useDerivedStateFromProps` takes 3 arguments:

- `props`: The current props object to derive the state from.
- `initialState`: The initial state object.
- `getDerivedStateFromProps`: A function that derives the new state from the current props and state.

```js
import { useDerivedStateFromProps } from 'use-derived-state-from-props';

// ...

function MyComponent({ userID, defaultEmail }) {
  const state = useDerivedStateFromProps(
    { userID, defaultEmail },
    { email: '' },
    (props, state) => {
      if (props.userID !== state.prevUserID) {
        return {
          prevUserID: props.userID,
          email: props.defaultEmail,
        };
      }

      return null;
    }
  );

  return <>{/* whatever */}</>;
}
```

The `getDerivedStateFromProps` is called on initial and subsequent renders. It should return a state object to update the state or `null` if no state update is needed. If it returns an object,it will be shallow merged with the current state.

It is recommended to keep a previous value of the prop in the state so that you can compare it to determine if the state needs to be updated the next time `getDerivedStateFromProps` is called. Without a check, it may lead to infinite re-renders.
