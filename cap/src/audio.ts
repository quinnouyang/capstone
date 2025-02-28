const ctx = new AudioContext();

export function linkAudioElement(el: HTMLAudioElement) {
  const srcNode = ctx.createMediaElementSource(el);

  srcNode.connect(ctx.destination);
}
