import { ShiftCurve } from "./curve"

export type GenerationParams = {
  howMany: number
  seed: number
  minHueShift: number
  maxHueShift: number
  howHueShift: ShiftCurve
}
