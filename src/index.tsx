import "preact/debug"

import { isMainThread } from "blue-tie"
import { setup } from "goober"
import { h, render } from "preact"
import App from "./app"

if (isMainThread) {
  // Setup goober to work with React
  setup(h)

  const container = document.getElementById("root")
  if (!container) throw new Error("Failed to find the root element")
  render(<App />, container)
}
