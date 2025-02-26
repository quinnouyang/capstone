import { Box, Theme } from "@chakra-ui/react";
import NodeCanvas from "./components/NodeCanvas";
import { Provider } from "./components/ui/provider";
import { ReactFlowProvider } from "@xyflow/react";

export default function App() {
  return (
    <Provider>
      <Theme appearance="light">
        <Box width="100vw" height="100vh">
          <ReactFlowProvider>
            <NodeCanvas />
          </ReactFlowProvider>
        </Box>
      </Theme>
    </Provider>
  );
}
