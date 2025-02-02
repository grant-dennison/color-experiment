import { styled } from "goober"
import { useEffect, useState } from "preact/hooks"
import { GenerationParams } from "utils/generation-params"
import { BufferedImageData } from "utils/image-data"
import { imageWorker } from "worker"
import ImageCanvas from "./components/image-canvas"
import ImageUploader from "./components/image-uploader"

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

const Controls = styled("div")`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 20px auto;
`

const InputGroup = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`

const Label = styled("label")`
  text-align: left;
`

const Select = styled("select")`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`

function App() {
  const [worker] = useState(() => imageWorker.create())
  const [imageData, setImageData] = useState<BufferedImageData | null>(null)
  const [modifiedImages, setModifiedImages] = useState<
    readonly BufferedImageData[] | null
  >(null)

  // Add state for generation parameters
  const [params, setParams] = useState<GenerationParams>({
    howMany: 3,
    seed: 0,
    minHueShift: 0.0,
    maxHueShift: 0.8,
    howHueShift: "spread",
  })

  useEffect(() => {
    if (!imageData) {
      return
    }
    setModifiedImages(null)
    worker
      .generateAlteredImages(imageData, params)
      .then(setModifiedImages, (e) => {
        console.error(e)
      })
  }, [imageData, params])

  const handleParamChange = <Key extends keyof GenerationParams>(
    key: Key,
    value: GenerationParams[Key],
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <AppContainer>
      <h1>Image Canvas Upload</h1>
      <ImageUploader onImageUpload={setImageData} />

      {imageData && (
        <>
          <Controls>
            <InputGroup>
              <Label>Number of Images:</Label>
              <input
                type="number"
                min="1"
                max="10"
                value={params.howMany}
                onChange={(e) =>
                  handleParamChange(
                    "howMany",
                    parseInt(e.currentTarget.value, 10),
                  )
                }
              />
            </InputGroup>

            <InputGroup>
              <Label>Seed:</Label>
              <input
                type="number"
                value={params.seed}
                onChange={(e) =>
                  handleParamChange("seed", parseInt(e.currentTarget.value, 10))
                }
              />
            </InputGroup>

            <InputGroup>
              <Label>Min Hue Shift:</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.minHueShift}
                onChange={(e) =>
                  handleParamChange(
                    "minHueShift",
                    parseFloat(e.currentTarget.value),
                  )
                }
              />
              <span>{params.minHueShift.toFixed(1)}</span>
            </InputGroup>

            <InputGroup>
              <Label>Max Hue Shift:</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.maxHueShift}
                onChange={(e) =>
                  handleParamChange(
                    "maxHueShift",
                    parseFloat(e.currentTarget.value),
                  )
                }
              />
              <span>{params.maxHueShift.toFixed(1)}</span>
            </InputGroup>

            <InputGroup>
              <Label>Hue Shift Type:</Label>
              <Select
                value={params.howHueShift}
                onChange={(e) =>
                  handleParamChange("howHueShift", e.currentTarget.value)
                }
              >
                <option value="minor">Minor</option>
                <option value="spread">Even Spread</option>
                <option value="extreme">Extreme</option>
              </Select>
            </InputGroup>
          </Controls>

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
              modifiedImages.map((mi, index) => (
                <div key={index}>
                  <h3>Randomized Colors</h3>
                  <ImageCanvas imageData={mi} />
                </div>
              ))}
          </div>
        </>
      )}
    </AppContainer>
  )
}

export default App
