import { styled } from "goober"
import { useEffect, useRef } from "preact/hooks"

const Canvas = styled("canvas")`
  max-width: 100%;
  border: 1px solid #ccc;
  margin-top: 20px;
`

interface ImageCanvasProps {
  imageFile: File | null
}

const ImageCanvas = ({ imageFile }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!imageFile || !canvasRef.current) return

    const canvas = canvasRef.current
    console.log(canvas)
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.src = URL.createObjectURL(imageFile)

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image to canvas
      ctx.drawImage(img, 0, 0)

      // Clean up object URL
      URL.revokeObjectURL(img.src)
    }
  }, [imageFile])

  return <canvas ref={canvasRef} />
}

export default ImageCanvas
