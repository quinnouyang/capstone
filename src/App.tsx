import { Flex, Stack } from "@chakra-ui/react";
import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./components/Canvas";
import { Provider } from "./components/ui/provider";
import Sidebar from "./components/workspace/Sidebar";
import Toolbar from "./components/workspace/Toolbar";

export default function App() {
  return (
    <Provider>
      <ReactFlowProvider>
        <Flex w="100vw" h="100vh" direction="column">
          <Toolbar />
          <Stack h="full">
            <Sidebar />
            <Canvas />
          </Stack>
        </Flex>
      </ReactFlowProvider>
    </Provider>
  );
}
