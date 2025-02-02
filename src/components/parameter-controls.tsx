import { styled } from "goober"
import { ShiftCurve } from "utils/curve"
import { GenerationParams } from "utils/generation-params"

const Controls = styled("div")`
  margin: 20px auto;
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

interface ImageControlsProps {
  params: GenerationParams
  setParams: (mutate: (prev: GenerationParams) => GenerationParams) => void
}

function ImageControls({ params, setParams }: ImageControlsProps) {
  const onParamChange = <Key extends keyof GenerationParams>(
    key: Key,
    value: GenerationParams[Key],
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Controls>
      <InputGroup>
        <Label>Random Seed:</Label>
        <input
          type="number"
          value={params.seed}
          onChange={(e) =>
            onParamChange("seed", parseInt(e.currentTarget.value, 10))
          }
        />
      </InputGroup>

      {/* <InputGroup>
        <Label>Min Hue Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.minHueShift}
          onChange={(e) =>
            onParamChange("minHueShift", parseFloat(e.currentTarget.value))
          }
        />
        <span>{params.minHueShift * 100}%</span>
      </InputGroup> */}

      <InputGroup>
        <Label>Max Hue Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.maxHueShift}
          onChange={(e) =>
            onParamChange("maxHueShift", parseFloat(e.currentTarget.value))
          }
        />
        <span>{params.maxHueShift * 100}%</span>
      </InputGroup>

      <InputGroup>
        <Label>Degree of Hue Shift:</Label>
        <Select
          value={params.howHueShift}
          onChange={(e) =>
            onParamChange("howHueShift", e.currentTarget.value as ShiftCurve)
          }
        >
          <option value="minor">Minor</option>
          <option value="spread">Even Spread</option>
          <option value="extreme">Extreme</option>
        </Select>
      </InputGroup>

      {/* <InputGroup>
        <Label>Min Saturation Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.minSaturationShift}
          onChange={(e) =>
            onParamChange(
              "minSaturationShift",
              parseFloat(e.currentTarget.value),
            )
          }
        />
        <span>{params.minSaturationShift * 100}%</span>
      </InputGroup> */}

      <InputGroup>
        <Label>Max Saturation Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.maxSaturationShift}
          onChange={(e) =>
            onParamChange(
              "maxSaturationShift",
              parseFloat(e.currentTarget.value),
            )
          }
        />
        <span>{params.maxSaturationShift * 100}%</span>
      </InputGroup>

      <InputGroup>
        <Label>Degree of Saturation Shift:</Label>
        <Select
          value={params.howSaturationShift}
          onChange={(e) =>
            onParamChange(
              "howSaturationShift",
              e.currentTarget.value as ShiftCurve,
            )
          }
        >
          <option value="minor">Minor</option>
          <option value="spread">Even Spread</option>
          <option value="extreme">Extreme</option>
        </Select>
      </InputGroup>

      {/* <InputGroup>
        <Label>Min Lightness Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.minLightnessShift}
          onChange={(e) =>
            onParamChange(
              "minLightnessShift",
              parseFloat(e.currentTarget.value),
            )
          }
        />
        <span>{params.minLightnessShift * 100}%</span>
      </InputGroup> */}

      <InputGroup>
        <Label>Max Lightness Shift:</Label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={params.maxLightnessShift}
          onChange={(e) =>
            onParamChange(
              "maxLightnessShift",
              parseFloat(e.currentTarget.value),
            )
          }
        />
        <span>{params.maxLightnessShift * 100}%</span>
      </InputGroup>

      <InputGroup>
        <Label>Degree of Lightness Shift:</Label>
        <Select
          value={params.howLightnessShift}
          onChange={(e) =>
            onParamChange(
              "howLightnessShift",
              e.currentTarget.value as ShiftCurve,
            )
          }
        >
          <option value="minor">Minor</option>
          <option value="spread">Even Spread</option>
          <option value="extreme">Extreme</option>
        </Select>
      </InputGroup>

      <InputGroup>
        <Label>Number of Variations:</Label>
        <input
          type="number"
          min="1"
          max="128"
          step="1"
          value={params.howMany}
          onChange={(e) =>
            onParamChange("howMany", parseInt(e.currentTarget.value, 10))
          }
        />
      </InputGroup>
    </Controls>
  )
}

export default ImageControls
