export type RandomGenerator = () => number
export const defaultRandomGenerator = Math.random
// export const defaultRandomGenerator = makeRandomGenerator(0)

type int = number

/**
 * Math.random() is uniform distribution. This is normal.
 */
export function randomNormal(
  random: RandomGenerator = defaultRandomGenerator,
): number {
  // Implementation from https://stackoverflow.com/a/49434653/4639640
  let u = 0,
    v = 0
  while (u === 0) u = random() //Converting [0,1) to (0,1)
  while (v === 0) v = random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) return randomNormal(random) // resample between 0 and 1
  return num
}
/**
 * random integer between 1 and num (inclusive)
 */
export function randomInt(
  num: number,
  random: RandomGenerator = defaultRandomGenerator,
) {
  return Math.floor(random() * num + 1)
}
/**
 * random integer between min and max (inclusive)
 */
export function randomRangedInt(
  min: int,
  max: int,
  random: RandomGenerator = defaultRandomGenerator,
): int {
  const howManyIntegers = max - min + 1
  const whichOnePicked = randomInt(howManyIntegers, random)
  return whichOnePicked + min - 1
}
/**
 * random number between min and max (exclusive)
 */
export function randomRanged(
  min: number,
  max: number,
  random: RandomGenerator = defaultRandomGenerator,
): number {
  return random() * (max - min) + min
}
/**
 * Return a seeded drop-in replacement for Math.random
 */
export function makeRandomGenerator(seed: string | number): () => number {
  const seedFunc = xmur3(`${seed}`)
  return xoshiro128ss(seedFunc(), seedFunc(), seedFunc(), seedFunc())
}
// From https://stackoverflow.com/a/47593316
function xmur3(str: string): () => int {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19))
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
// From https://stackoverflow.com/a/47593316
function xoshiro128ss(a: int, b: int, c: int, d: int): () => number {
  return function () {
    var t = b << 9,
      r = a * 5
    r = ((r << 7) | (r >>> 25)) * 9
    c ^= a
    d ^= b
    b ^= c
    a ^= d
    c ^= t
    d = (d << 11) | (d >>> 21)
    return (r >>> 0) / 4294967296
  }
}
