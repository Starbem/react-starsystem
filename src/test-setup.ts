import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

// jsdom does not implement the Pointer Capture API; Radix UI primitives call it internally.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {}
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {}
}

// jsdom does not implement ResizeObserver; Radix UI primitives (e.g. Tooltip) call it internally.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
