import { create } from "zustand";
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
