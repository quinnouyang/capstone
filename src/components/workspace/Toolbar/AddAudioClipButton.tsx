import { BiPlus } from "react-icons/bi";
import STORE_SELECTORS from "../../../store/store";
import { initNode } from "../../AudioClipNode/utils";
import TooltipButton from "../TooltipButton";

export default function AddAudioClipButton() {
  const addNodes = STORE_SELECTORS.addNodes();
  const nodeCount = STORE_SELECTORS.nodeCount();

  return (
    <TooltipButton
      label="Add Audio Clip"
      onClick={() => addNodes([initNode(nodeCount, { x: 50, y: 50 })])}
    >
      <BiPlus />
    </TooltipButton>
  );
}
