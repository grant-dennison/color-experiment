import { BufferedImageData } from "./image-data"

export function detectPalette(imageData: BufferedImageData): Set<ColorKey> {
  const palette = new Set<ColorKey>()
  const data = imageData.buffer
  for (let i = 0; i < data.length; i += 4) {
    palette.add(rgbToKey(data[i], data[i + 1], data[i + 2]))
  }
  return palette
}

export type ColorKey = number & { __brand__: "ColorKey" }

export function rgbToKey(r: number, g: number, b: number): ColorKey {
  return ((r << 16) + (g << 8) + (b << 0)) as ColorKey
}

export function keyToRgb(key: ColorKey): [number, number, number] {
  const r = (key >> 16) & 0xff
  const g = (key >> 8) & 0xff
  const b = key & 0xff
  return [r, g, b]
}
