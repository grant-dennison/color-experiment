import { styled } from "goober"
import { useEffect, useState } from "preact/hooks"
import { GenerationParams } from "utils/generation-params"
import { BufferedImageData } from "utils/image-data"
import { imageWorker } from "worker"
import ImageCanvas from "./components/image-canvas"
import ImageUploader from "./components/image-uploader"
import ImageControls from "./components/parameter-controls"

const AppContainer = styled("div")`
  margin: 0 auto;
  padding: 10px;
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

  return (
    <AppContainer>
      <FlexLayout>
        <ControlsSection>
          <ImageUploader onImageUpload={setImageData} />

          {imageData && (
            <>
              <ImageControls params={params} setParams={setParams} />

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
