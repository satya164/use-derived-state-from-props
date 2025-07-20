import { it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDerivedStateFromProps } from './index';

type Props = {
  userID: number;
  defaultEmail: string;
};

type State = {
  email: string;
  prevUserID?: number | null;
};

it('returns initial state on first render when returning null', () => {
  const initialState = { email: '' };
  const props = { userID: 1, defaultEmail: 'test@example.com' };

  const getDerivedStateFromProps = vi.fn(
    (_props: Props, _state: State) => null
  );

  const { result } = renderHook(() =>
    useDerivedStateFromProps(props, initialState, getDerivedStateFromProps)
  );

  expect(result.current).toEqual(initialState);
  expect(getDerivedStateFromProps).toHaveBeenCalledWith(props, initialState);
});

it('derives state from props on first render when returning state', () => {
  const initialState = { email: '' };
  const props = { userID: 1, defaultEmail: 'test@example.com' };

  const getDerivedStateFromProps = (props: Props, _state: State) => ({
    prevUserID: props.userID,
    email: props.defaultEmail,
  });

  const { result } = renderHook(() =>
    useDerivedStateFromProps(props, initialState, getDerivedStateFromProps)
  );

  expect(result.current).toEqual({
    email: 'test@example.com',
    prevUserID: 1,
  });
});

it('merges derived state with initial state on first render', () => {
  const initialState = { email: '', name: 'John' };
  const props = { userID: 1, defaultEmail: 'test@example.com' };

  const getDerivedStateFromProps = (props: Props, _state: State) => ({
    prevUserID: props.userID,
    email: props.defaultEmail,
  });

  const { result } = renderHook(() =>
    useDerivedStateFromProps(props, initialState, getDerivedStateFromProps)
  );

  expect(result.current).toEqual({
    email: 'test@example.com',
    name: 'John',
    prevUserID: 1,
  });
});

it('updates state when props change and new state is returned', () => {
  const initialState = { email: '', prevUserID: null };
  const props = { userID: 1, defaultEmail: 'test@example.com' };

  const getDerivedStateFromProps = (props: Props, state: State) => {
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail,
      };
    }

    return null;
  };

  const { result, rerender } = renderHook(
    ({ props }) =>
      useDerivedStateFromProps(props, initialState, getDerivedStateFromProps),
    { initialProps: { props } }
  );

  expect(result.current).toEqual({
    email: 'test@example.com',
    prevUserID: 1,
  });

  rerender({
    props: { userID: 2, defaultEmail: 'new@example.com' },
  });

  expect(result.current).toEqual({
    email: 'new@example.com',
    prevUserID: 2,
  });
});

it('does not update state when props change but null is returned', () => {
  const initialState = { email: 'test@example.com', prevUserID: 1 };
  const props = { userID: 1, defaultEmail: 'test@example.com' };

  const getDerivedStateFromProps = (props: Props, state: State) => {
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail,
      };
    }

    return null;
  };

  const { result, rerender } = renderHook(
    ({ props, initialState, getDerivedStateFromProps }) =>
      useDerivedStateFromProps(props, initialState, getDerivedStateFromProps),
    { initialProps: { props, initialState, getDerivedStateFromProps } }
  );

  expect(result.current).toEqual(initialState);

  rerender({
    props: { userID: 1, defaultEmail: 'different@example.com' },
    initialState,
    getDerivedStateFromProps,
  });

  expect(result.current).toEqual(initialState);
});
