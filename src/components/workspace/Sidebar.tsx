import { Accordion, Box, Icon, Stack } from "@chakra-ui/react";
import { BiSignal5 } from "react-icons/bi";
import useShallowStore, { storeGetters } from "../../store/store";

export default function Sidebar() {
  const { sidebarOpen } = useShallowStore((s) => ({
    sidebarOpen: s.sidebarOpen,
  }));
  const idToNodes = storeGetters.idToNodes();

  return (
    <Box
      position="absolute"
      h="full"
      bg="bg.panel"
      shadow="md"
      transform={sidebarOpen ? "translateX(0)" : "translateX(-100%)"}
      transition="transform 0.3s ease-in-out"
      zIndex={1}
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
                  {data.src}
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
