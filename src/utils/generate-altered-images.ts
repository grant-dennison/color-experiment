import Color from "color"
import { makeCurveFunction } from "./curve"
import { GenerationParams } from "./generation-params"
import { BufferedImageData } from "./image-data"
import { ColorKey, detectPalette, keyToRgb, rgbToKey } from "./palette"
import { makeRandomGenerator, RandomGenerator, randomRanged } from "./random"

export async function generateAlteredImages(
  imageData: BufferedImageData,
  params: GenerationParams,
): Promise<readonly BufferedImageData[]> {
  const random = makeRandomGenerator(params.seed)
  const originalPalette = detectPalette(imageData)

  const results: BufferedImageData[] = []

  for (let i = 0; i < params.howMany; i++) {
    results.push(
      generateAlteredImage(imageData, originalPalette, random, params),
    )
  }

  return results
}

function generateAlteredImage(
  imageData: BufferedImageData,
  originalPalette: Set<ColorKey>,
  random: RandomGenerator,
  params: GenerationParams,
) {
  const hueCurve = makeCurveFunction(params.howHueShift)
  const hueRandom = () => hueCurve(random())
  const saturationCurve = makeCurveFunction(params.howSaturationShift)
  const saturationRandom = () => saturationCurve(random())
  const lightnessCurve = makeCurveFunction(params.howLightnessShift)
  const lightnessRandom = () => lightnessCurve(random())
  function transformColor(
    r: number,
    g: number,
    b: number,
  ): [number, number, number] {
    let c = Color({ r, g, b })
    const hueSign = random() < 0.5 ? -1 : 1
    if (params.minHueShift === params.maxHueShift) {
      // Eat random
      hueRandom()
      c = c.rotate(hueSign * params.minHueShift * 180)
    } else {
      c = c.rotate(
        hueSign *
          randomRanged(
            params.minHueShift * 180,
            params.maxHueShift * 180,
            hueRandom,
          ),
      )
    }
    const saturationSign = random() < 0.5 ? -1 : 1
    if (params.minSaturationShift === params.maxSaturationShift) {
      // Eat random
      saturationRandom()
      c = c.saturate(saturationSign * params.minSaturationShift)
    } else {
      c = c.saturate(
        saturationSign *
          randomRanged(
            params.minSaturationShift,
            params.maxSaturationShift,
            saturationRandom,
          ),
      )
    }
    const lightenSign = random() < 0.5 ? -1 : 1
    if (params.minLightnessShift === params.maxLightnessShift) {
      // Eat random
      lightnessRandom()
      c = c.lighten(lightenSign * params.minLightnessShift)
    } else {
      c = c.lighten(
        lightenSign *
          randomRanged(
            params.minLightnessShift,
            params.maxLightnessShift,
            lightnessRandom,
          ),
      )
    }
    return [c.red(), c.green(), c.blue()]
  }

  const mappedPalette = new Map<ColorKey, ColorKey>()
  for (const key of originalPalette) {
    const [r, g, b] = keyToRgb(key)
    const [r2, g2, b2] = transformColor(r, g, b)
    mappedPalette.set(key, rgbToKey(r2, g2, b2))
  }
  // Create a new ImageData instance
  const data = new Uint8ClampedArray(imageData.buffer)

  for (let i = 0; i < data.length; i += 4) {
    const [r0, g0, b0] = [data[i], data[i + 1], data[i + 2]]
    const [r, g, b] = keyToRgb(mappedPalette.get(rgbToKey(r0, g0, b0))!)
    data[i] = r
    data[i + 1] = g
    data[i + 2] = b
    // Alpha channel remains unchanged
  }

  return {
    width: imageData.width,
    height: imageData.height,
    buffer: data,
  }
}
