import { GenerationParams } from "./generation-params"
import { BufferedImageData } from "./image-data"
import { ColorKey, detectPalette, keyToRgb, rgbToKey } from "./palette"

function transformColor(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  // return [255, 0, 255]
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ]
}

export async function generateAlteredImages(
  imageData: BufferedImageData,
  params: GenerationParams,
): Promise<readonly BufferedImageData[]> {
  const originalPalette = detectPalette(imageData)
  const mappedPalette = new Map<ColorKey, ColorKey>()
  for (const key of originalPalette) {
    const [r, g, b] = keyToRgb(key)
    const [r2, g2, b2] = transformColor(r, g, b)
    mappedPalette.set(key, rgbToKey(r2, g2, b2))
  }
  // Create a new ImageData instance
  const data = new Uint8ClampedArray(imageData.buffer)

  for (let i = 0; i < data.length; i += 4) {
    // const [r, g, b] = transformColor(data[i], data[i + 1], data[i + 2]);
    const [r0, g0, b0] = [data[i], data[i + 1], data[i + 2]]
    const [r, g, b] = keyToRgb(mappedPalette.get(rgbToKey(r0, g0, b0))!)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    // Alpha channel remains unchanged
  }

  return [
    {
      width: imageData.width,
      height: imageData.height,
      buffer: data,
    },
  ]
}
