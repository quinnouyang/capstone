import { type StoreApi, type UseBoundStore, create } from "zustand";
import { useShallow } from "zustand/shallow";
import { type ReactFlowSlice, createReactFlowSlice } from "./reactFlow";
import { type WebAudioSlice, createWebAudioSlice } from "./webAudio";
import { type WorkspaceSlice, createWorkspaceSlice } from "./workspace";

type Slices = ReactFlowSlice & WebAudioSlice & WorkspaceSlice;

const useCustomStore = create<Slices>()(
  (...a) => ({
    ...createReactFlowSlice(...a),
    ...createWebAudioSlice(...a),
    ...createWorkspaceSlice(...a),
  }),
  // // [FIX] Does not paste correctly with
  //   {
  //     // [PATCH] Redux DevTools can't serialize BigInt: https://github.com/reduxjs/redux-devtools/issues/1541
  //     serialize: {
  //       replacer: (_key: string, value: any) => {
  //         return typeof value === "bigint" ? value.toString() : value;
  //       },
  //     },
  //     // stateSanitizer: (state) =>
  //     //   state.data ? { ...state, data: "<<LONG_BLOB>>" } : state,
  //   },
  // ),
);

export default function useShallowStore<T>(selector: (state: Slices) => T): T {
  return useCustomStore(useShallow(selector));
}

// https://zustand.docs.pmnd.rs/guides/auto-generating-selectors
type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const useSelectedStore = createSelectors(useCustomStore).use;
