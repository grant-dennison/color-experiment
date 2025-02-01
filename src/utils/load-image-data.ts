import { BufferedImageData } from "./image-data"

export async function loadImageData(file: File): Promise<BufferedImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      // Create an offscreen canvas
      const canvas = new OffscreenCanvas(img.width, img.height)
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Draw the image and get its data
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)

      // Clean up
      URL.revokeObjectURL(img.src)

      resolve({
        width: img.width,
        height: img.height,
        buffer: imageData.data,
      })
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }
  })
}
