import { Box, Theme } from "@chakra-ui/react";
import NodeCanvas from "./components/NodeCanvas";
import { Provider } from "./components/ui/provider";

export default function App() {
  return (
    <Provider>
      <Theme appearance="light">
        <Box width="100vw" height="100vh">
          <NodeCanvas />
        </Box>
      </Theme>
    </Provider>
  );
}
