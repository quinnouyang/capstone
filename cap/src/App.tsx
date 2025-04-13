import { Box } from "@chakra-ui/react";
import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./components/Canvas";
import { Provider } from "./components/ui/provider";

export default function App() {
  return (
    <Provider forcedTheme="light">
      <ReactFlowProvider>
        <Box width="100vw" height="100vh">
          <Canvas />
        </Box>
      </ReactFlowProvider>
    </Provider>
  );
}
