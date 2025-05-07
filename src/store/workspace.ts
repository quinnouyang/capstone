import { StateCreator } from "zustand";

type State = {
  sidebarOpen: boolean;
  devtoolsOpen: boolean;
};

type Functions = {
  toggleSidebar: () => void;
  toggleDevtools: () => void;
};

export type WorkspaceSlice = State & Functions;

export const createWorkspaceSlice: StateCreator<
  WorkspaceSlice,
  [],
  [],
  WorkspaceSlice
> = (set) => {
  return {
    sidebarOpen: false,
    devtoolsOpen: false,

    toggleSidebar: () => {
      set((state) => ({ sidebarOpen: !state.sidebarOpen }));
    },
    toggleDevtools: () => {
      set((state) => ({ devtoolsOpen: !state.devtoolsOpen }));
    },
  };
};
