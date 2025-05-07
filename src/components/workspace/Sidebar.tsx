import { Accordion, Box, Icon, Stack } from "@chakra-ui/react";
import { BiSignal5 } from "react-icons/bi";
import STORE_SELECTORS from "../../store/store";

export default function Sidebar() {
  const sidebarOpen = STORE_SELECTORS.sidebarOpen();
  const idToNodes = STORE_SELECTORS.idToNodes();

  return (
    <Box
      position="absolute"
      h="full"
      bg="bg.panel"
      shadow={sidebarOpen ? "md" : undefined}
      transform={sidebarOpen ? "translateX(0)" : "translateX(-100%)"}
      transition="transform 0.3s ease-in-out"
      zIndex={2}
      overflow="hidden"
    >
      {
        <Stack width="full" m={4}>
          <Accordion.Root
            multiple
            collapsible
            value={Array.from(idToNodes.keys())}
          >
            {Array.from(idToNodes.values()).map(({ id, data }) => (
              <Accordion.Item key={id} value={id}>
                <Accordion.ItemTrigger>
                  <Icon>
                    <BiSignal5 />
                  </Icon>
                  {id}
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    {JSON.stringify(data)}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
      }
    </Box>
  );
}
