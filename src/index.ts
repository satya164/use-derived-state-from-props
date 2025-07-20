import * as React from 'react';

type GetDerivedStateFromProps<Props, State> = (
  props: Props,
  state: State
) => State | null;

/**
 * React hook which implements `getDerivedStateFromProps` for function components.
 */
export function useDerivedStateFromProps<Props, State>(
  props: Props,
  initialState: State,
  getDerivedStateFromProps: GetDerivedStateFromProps<Props, State>
): State {
  const [{ state, prevProps }, update] = React.useState(() => {
    let derivedState = getDerivedStateFromProps(props, initialState);

    if (isPlainObject(initialState) && isPlainObject(derivedState)) {
      derivedState = { ...initialState, ...derivedState };
    }

    if (derivedState === null) {
      derivedState = initialState;
    }

    return {
      state: derivedState,
      prevProps: props,
    };
  });

  if (!Object.is(prevProps, props)) {
    let derivedState = getDerivedStateFromProps(props, state);

    if (derivedState !== null && !Object.is(derivedState, state)) {
      if (isPlainObject(state) && isPlainObject(derivedState)) {
        derivedState = { ...state, ...derivedState };
      }

      update({ state: derivedState, prevProps: props });

      return derivedState;
    }
  }

  return state;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    value === null ||
    Object.getPrototypeOf(value) === Object.prototype ||
    Object.getPrototypeOf(value) === null
  );
}
