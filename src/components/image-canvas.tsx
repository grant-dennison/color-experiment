import { styled } from "goober"
import { useEffect, useRef } from "preact/hooks"
import { JSXInternal } from "preact/src/jsx"
import { BufferedImageData } from "utils/image-data"

const Canvas = styled("canvas")`
  max-width: 100%;
  border: 1px solid #ccc;
  margin-top: 20px;
`

interface ImageCanvasProps {
  imageData: BufferedImageData
  transformColor?: (r: number, g: number, b: number) => [number, number, number]
  style?: JSXInternal.CSSProperties
}

const ImageCanvas = ({
  imageData,
  style,
  transformColor,
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = imageData.width
    canvas.height = imageData.height

    // Create a new ImageData instance
    const newImageData = new ImageData(
      new Uint8ClampedArray(imageData.buffer),
      imageData.width,
      imageData.height,
    )

    // Draw the image data to the canvas
    ctx.putImageData(newImageData, 0, 0)
  }, [imageData, transformColor])

  return <canvas style={style} ref={canvasRef} />
}

export default ImageCanvas
