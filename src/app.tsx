import { styled } from "goober"
import { useState, useCallback, useEffect, useMemo } from "preact/hooks"
import ImageCanvas from "./components/image-canvas"
import ImageUploader from "./components/image-uploader"
import { loadImageData } from "./utils/load-image-data"
import { BufferedImageData } from "utils/image-data"
import { imageWorker } from "worker"

const AppContainer = styled("div")`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`

const Button = styled("button")`
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

const StyledCanvas = styled("canvas")`
  margin-top: 20px;
`

function App() {
  const [worker] = useState(() => imageWorker.create())

  const [imageData, setImageData] = useState<BufferedImageData | null>(null)
  const [modifiedImages, setModifiedImages] = useState<
    readonly BufferedImageData[] | null
  >(null)

  useEffect(() => {
    if (!imageData) {
      return
    }
    setModifiedImages(null)
    worker
      .generateAlteredImages(imageData, {
        howMany: 3,
        seed: 0,
        minHueShift: 0.0,
        maxHueShift: 0.8,
        howHueShift: "extreme",
      })
      .then(setModifiedImages, (e) => {
        console.error(e)
      })
  }, [imageData])

  return (
    <AppContainer>
      <h1>Image Canvas Upload</h1>
      <ImageUploader onImageUpload={setImageData} />
      {imageData && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3>Original Image</h3>
            <ImageCanvas imageData={imageData} />
          </div>
          {modifiedImages &&
            modifiedImages.map((mi) => (
              <div>
                <h3>Randomized Colors</h3>
                <ImageCanvas imageData={mi} />
              </div>
            ))}
        </div>
      )}
    </AppContainer>
  )
}

export default App
