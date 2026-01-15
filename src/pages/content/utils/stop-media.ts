export function stopMedia() {
  const mediaElements = document.querySelectorAll("video, audio");
  mediaElements.forEach((el) => {
    const media = el as HTMLMediaElement;
    if (!media.paused) {
      media.pause();
    }
  });
}
