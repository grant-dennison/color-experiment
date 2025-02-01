import { defineWorker, getBrowserScript } from "blue-tie"
import { generateAlteredImages } from "utils/generate-altered-images"

export const imageWorker = defineWorker("image-worker", getBrowserScript(), {
  generateAlteredImages: generateAlteredImages,
})
