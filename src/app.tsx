import { styled } from "goober"
import { useState } from "preact/hooks"
import ImageCanvas from './components/image-canvas'
import ImageUploader from './components/image-uploader'

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
  const [imageFile, setImageFile] = useState<File | null>(null)

  return (
    <AppContainer>
      <h1>Image Canvas Upload</h1>
      <ImageUploader onImageUpload={setImageFile} />
      {imageFile && <ImageCanvas imageFile={imageFile} />}
    </AppContainer>
  )
}

export default App
