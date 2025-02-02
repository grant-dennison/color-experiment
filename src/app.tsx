import { styled } from "goober"
import { useEffect, useState } from "preact/hooks"
import { GenerationParams } from "utils/generation-params"
import { BufferedImageData } from "utils/image-data"
import { imageWorker } from "worker"
import ImageCanvas from "./components/image-canvas"
import ImageUploader from "./components/image-uploader"

const AppContainer = styled("div")`
  margin: 0 auto;
  padding: 10px;
`

const Controls = styled("div")`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
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

// Add new styled component for the layout
const FlexLayout = styled("div")`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ControlsSection = styled("div")`
  flex: 0 0 300px;
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
  }
`

const VariationsSection = styled("div")`
  flex: 1;
  min-width: 300px;
  width: 100%;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`

const OriginalImageContainer = styled("div")`
  max-width: 200px;
  margin: 0 auto;
  width: 100%;
`

// Update the grid container styles in the JSX
const GridContainer = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
`

function App() {
  const [worker] = useState(() => imageWorker.create())
  const [imageData, setImageData] = useState<BufferedImageData | null>(null)
  const [modifiedImages, setModifiedImages] = useState<
    readonly BufferedImageData[] | null
  >(null)

  // Add state for generation parameters
  const [params, setParams] = useState<GenerationParams>({
    howMany: 10,
    seed: 0,
    minHueShift: 0.0,
    maxHueShift: 0.8,
    howHueShift: "spread",
    minSaturationShift: 0.0,
    maxSaturationShift: 0.2,
    howSaturationShift: "spread",
    minLightnessShift: 0.0,
    maxLightnessShift: 0.1,
    howLightnessShift: "spread",
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
      <FlexLayout>
        <ControlsSection>
          <ImageUploader onImageUpload={setImageData} />

          {imageData && (
            <>
              <Controls>
                <InputGroup>
                  <Label>Number of Images:</Label>
                  <input
                    type="number"
                    min="1"
                    max="128"
                    step="1"
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
                      handleParamChange(
                        "seed",
                        parseInt(e.currentTarget.value, 10),
                      )
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
                  <span>{params.minHueShift * 100}%</span>
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
                  <span>{params.maxHueShift * 100}%</span>
                </InputGroup>

                <InputGroup>
                  <Label>Hue Shift Type:</Label>
                  <Select
                    value={params.howHueShift}
                    onChange={(e: Event) =>
                      handleParamChange(
                        "howHueShift",
                        (e.currentTarget as HTMLSelectElement).value,
                      )
                    }
                  >
                    <option value="minor">Minor</option>
                    <option value="spread">Even Spread</option>
                    <option value="extreme">Extreme</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Min Saturation Shift:</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.minSaturationShift}
                    onChange={(e) =>
                      handleParamChange(
                        "minSaturationShift",
                        parseFloat(e.currentTarget.value),
                      )
                    }
                  />
                  <span>{params.minSaturationShift * 100}%</span>
                </InputGroup>

                <InputGroup>
                  <Label>Max Saturation Shift:</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.maxSaturationShift}
                    onChange={(e) =>
                      handleParamChange(
                        "maxSaturationShift",
                        parseFloat(e.currentTarget.value),
                      )
                    }
                  />
                  <span>{params.maxSaturationShift * 100}%</span>
                </InputGroup>

                <InputGroup>
                  <Label>Saturation Shift Type:</Label>
                  <Select
                    value={params.howSaturationShift}
                    onChange={(e: Event) =>
                      handleParamChange(
                        "howSaturationShift",
                        (e.currentTarget as HTMLSelectElement).value,
                      )
                    }
                  >
                    <option value="minor">Minor</option>
                    <option value="spread">Even Spread</option>
                    <option value="extreme">Extreme</option>
                  </Select>
                </InputGroup>

                <InputGroup>
                  <Label>Min Lightness Shift:</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.minLightnessShift}
                    onChange={(e) =>
                      handleParamChange(
                        "minLightnessShift",
                        parseFloat(e.currentTarget.value),
                      )
                    }
                  />
                  <span>{params.minLightnessShift * 100}%</span>
                </InputGroup>

                <InputGroup>
                  <Label>Max Lightness Shift:</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={params.maxLightnessShift}
                    onChange={(e) =>
                      handleParamChange(
                        "maxLightnessShift",
                        parseFloat(e.currentTarget.value),
                      )
                    }
                  />
                  <span>{params.maxLightnessShift * 100}%</span>
                </InputGroup>

                <InputGroup>
                  <Label>Lightness Shift Type:</Label>
                  <Select
                    value={params.howLightnessShift}
                    onChange={(e: Event) =>
                      handleParamChange(
                        "howLightnessShift",
                        (e.currentTarget as HTMLSelectElement).value,
                      )
                    }
                  >
                    <option value="minor">Minor</option>
                    <option value="spread">Even Spread</option>
                    <option value="extreme">Extreme</option>
                  </Select>
                </InputGroup>
              </Controls>

              <div>
                <h3>Original Image</h3>
                <OriginalImageContainer>
                  <ImageCanvas
                    imageData={imageData}
                    style={{ width: "100%", height: "auto" }}
                  />
                </OriginalImageContainer>
              </div>
            </>
          )}
        </ControlsSection>

        {modifiedImages && modifiedImages.length > 0 && (
          <VariationsSection>
            <h3>Variations</h3>
            <GridContainer>
              {modifiedImages.map((mi, index) => (
                <div key={index} style={{ width: "100%", minWidth: 0 }}>
                  <ImageCanvas
                    imageData={mi}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              ))}
            </GridContainer>
          </VariationsSection>
        )}
      </FlexLayout>
    </AppContainer>
  )
}

export default App
