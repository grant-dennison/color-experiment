import { styled } from "goober"
import { useRef, useState } from "preact/hooks"
import { BufferedImageData } from "utils/image-data"
import { loadImageData } from "utils/load-image-data"

const UploadButton = styled("button")`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049;
  }
`

const ErrorMessage = styled("p")`
  color: red;
`

interface ImageUploaderProps {
  onImageUpload: (imageData: BufferedImageData) => void
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>("")

  const handleFileChange = (event: unknown) => {
    const file: File | undefined = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setError("")
        loadImageData(file).then(
          (buffered) => onImageUpload(buffered),
          (e) => {
            console.error(e)
            setError(e)
          },
        )
      } else {
        setError("Please upload an image file")
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <UploadButton onClick={() => fileInputRef.current?.click()}>
        Upload Image
      </UploadButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}
export default ImageUploader
