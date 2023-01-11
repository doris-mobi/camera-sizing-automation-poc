export const playVideo = (video: HTMLVideoElement) => {
  const playPromise = video.play()

  if (playPromise !== undefined) {
    playPromise
      .then(_ => {
        // Automatic playback started!
        // Show playing UI.
        // We can now safely pause video...
      })
      .catch(_error => {
        // Auto-play was prevented
        // Show paused UI.
      })
  }
}