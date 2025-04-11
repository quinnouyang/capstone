import { Box } from "@chakra-ui/react";
import { ReactFlowProvider } from "@xyflow/react";
import NodeCanvas from "./components/NodeCanvas";
import { Provider } from "./components/ui/provider";

export default function App() {
  return (
    <Provider forcedTheme="light">
      <ReactFlowProvider>
        <Box width="100vw" height="100vh">
          <NodeCanvas />
        </Box>
      </ReactFlowProvider>
    </Provider>
  );
}
