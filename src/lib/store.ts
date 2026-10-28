import { useSyncExternalStore } from "react";

type State = {
  /** What the visitor packed in "Tahanan". Later chapters answer it. */
  packed: string[];
  sound: boolean;
  /** The 3D scenes are built and the page may scroll (see LoadGate). */
  ready: boolean;
};

const initial: State = { packed: [], sound: false, ready: false };
let state: State = initial;
const listeners = new Set<() => void>();

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}
