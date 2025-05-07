import { Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { ReactFlowProvider } from "@xyflow/react";
import Canvas from "./components/Canvas";
import { Provider } from "./components/ui/provider";
import Sidebar from "./components/workspace/Sidebar";
import Toolbar from "./components/workspace/Toolbar";

export default function App() {
  const { open, setOpen } = useDisclosure();

  return (
    <Provider forcedTheme="light">
      <ReactFlowProvider>
        <Flex w="100vw" h="100vh" direction="column">
          <Toolbar open={open} setOpen={setOpen} />
          <Stack h="full">
            <Sidebar isOpen={open} />
            <Canvas />
          </Stack>
        </Flex>
      </ReactFlowProvider>
    </Provider>
  );
}
