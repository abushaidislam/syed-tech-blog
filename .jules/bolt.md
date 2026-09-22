## 2024-05-27 - Scroll Event Listener Throttling
**Learning:** High-frequency events like `scroll` can block the main thread and cause layout thrashing and excessive re-renders in React when triggering state updates unthrottled.
**Action:** Always wrap state updates within high-frequency event listeners (like scroll, resize, or mousemove) in `requestAnimationFrame` with a `ticking` lock flag, and store the animation frame ID to properly cancel it during cleanup on component unmount.
