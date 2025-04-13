const CTX = new AudioContext();
const SOURCES = new Map<string, MediaElementAudioSourceNode>();

CTX.suspend();

// export function play() {
//   if (CTX.state === "suspended") CTX.resume();
//   else console.warn("AudioContext is already playing", CTX);
// }

// export function pause() {
//   if (CTX.state === "running") CTX.suspend();
//   else console.warn("AudioContext is already paused", CTX);
// }

export function toggleCtxState() {
  CTX.state === "running" ? CTX.suspend() : CTX.resume();
}

export function createAudioNodeSource(el: HTMLAudioElement) {
  if (SOURCES.has(el.id)) {
    console.warn("Audio source already exists", el.id);
    return;
  }

  const srcNode = CTX.createMediaElementSource(el);
  SOURCES.set(el.id, srcNode);
  srcNode.connect(CTX.destination);
}

export function play(id: string) {
  const srcNode = SOURCES.get(id);
  if (!srcNode) {
    console.warn("Could not find audio source", id);
    return;
  }

  srcNode.mediaElement.play();
}
