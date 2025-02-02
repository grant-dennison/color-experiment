export type ShiftCurve = "extreme" | "spread" | "minor"

export function makeCurveFunction(curve: ShiftCurve) {
  if (curve === "extreme") {
    return (x: number) => Math.pow(x, 1 / 5)
  }
  if (curve === "minor") {
    return (x: number) => Math.pow(x, 5)
  }
  return (x: number) => x
}
