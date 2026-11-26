import { describe, expect, it } from "vitest";
import { createStore } from "zustand/vanilla";
import { createWorkspaceSlice } from "../src/store/workspace";

describe("workspace controls", () => {
  it("toggles sidebar and devtools independently", () => {
    const store = createStore(createWorkspaceSlice);
    expect(store.getState()).toMatchObject({
      sidebarOpen: true,
      devtoolsOpen: false,
    });
    store.getState().toggleSidebar();
    store.getState().toggleDevtools();
    expect(store.getState()).toMatchObject({
      sidebarOpen: false,
      devtoolsOpen: true,
    });
    store.getState().toggleSidebar();
    expect(store.getState()).toMatchObject({
      sidebarOpen: true,
      devtoolsOpen: true,
    });
  });
});
