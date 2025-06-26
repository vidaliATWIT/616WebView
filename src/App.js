
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Box from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { React, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import * as Juce from "juce-framework-frontend";

import "./App.css";

// Custom attributes in React must be in all lower case
const controlParameterIndexAnnotation = "controlparameterindex";


function JuceSlider({ identifier, title }) {
  JuceSlider.propTypes = {
    identifier: PropTypes.string,
    title: PropTypes.string,
  };

  const sliderState = Juce.getSliderState(identifier);

  const [value, setValue] = useState(sliderState.getNormalisedValue());
  const [properties, setProperties] = useState(sliderState.properties);

  const handleChange = (event, newValue) => {
    sliderState.setNormalisedValue(newValue);
    setValue(newValue);
  };

  const mouseDown = () => {
    sliderState.sliderDragStarted();
  };

  const changeCommitted = (event, newValue) => {
    sliderState.setNormalisedValue(newValue);
    sliderState.sliderDragEnded();
  };

  useEffect(() => {
    const valueListenerId = sliderState.valueChangedEvent.addListener(() => {
      setValue(sliderState.getNormalisedValue());
    });
    const propertiesListenerId = sliderState.propertiesChangedEvent.addListener(
      () => setProperties(sliderState.properties)
    );

    return function cleanup() {
      sliderState.valueChangedEvent.removeListener(valueListenerId);
      sliderState.propertiesChangedEvent.removeListener(propertiesListenerId);
    };
  });

  function calculateValue() {
    return sliderState.getScaledValue();
  }

  return (
    <Box
      {...{
        [controlParameterIndexAnnotation]:
          sliderState.properties.parameterIndex,
      }}
    >
      <Typography sx={{ mt: 1.5 }}>
        {properties.name}: {sliderState.getScaledValue()} {properties.label}
      </Typography>
      <Slider
        aria-label={title}
        value={value}
        scale={calculateValue}
        onChange={handleChange}
        min={0}
        max={1}
        step={1 / (properties.numSteps - 1)}
        onChangeCommitted={changeCommitted}
        onMouseDown={mouseDown}
      />
    </Box>
  );
}

function JuceCheckbox({ identifier }) {
  JuceCheckbox.propTypes = {
    identifier: PropTypes.string,
  };

  const checkboxState = Juce.getToggleState(identifier);

  const [value, setValue] = useState(checkboxState.getValue());
  const [properties, setProperties] = useState(checkboxState.properties);

  const handleChange = (event) => {
    checkboxState.setValue(event.target.checked);
    setValue(event.target.checked);
  };

  useEffect(() => {
    const valueListenerId = checkboxState.valueChangedEvent.addListener(() => {
      setValue(checkboxState.getValue());
    });
    const propertiesListenerId =
      checkboxState.propertiesChangedEvent.addListener(() =>
        setProperties(checkboxState.properties)
      );

    return function cleanup() {
      checkboxState.valueChangedEvent.removeListener(valueListenerId);
      checkboxState.propertiesChangedEvent.removeListener(propertiesListenerId);
    };
  });

  const cb = <Checkbox checked={value} onChange={handleChange} />;

  return (
    <Box
      {...{
        [controlParameterIndexAnnotation]:
          checkboxState.properties.parameterIndex,
      }}
    >
      <FormGroup>
        <FormControlLabel control={cb} label={properties.name} />
      </FormGroup>
    </Box>
  );
}

function JuceComboBox({ identifier }) {
  JuceComboBox.propTypes = {
    identifier: PropTypes.string,
  };

  const comboBoxState = Juce.getComboBoxState(identifier);

  const [value, setValue] = useState(comboBoxState.getChoiceIndex());
  const [properties, setProperties] = useState(comboBoxState.properties);

  const handleChange = (event) => {
    comboBoxState.setChoiceIndex(event.target.value);
    setValue(event.target.value);
  };

  useEffect(() => {
    const valueListenerId = comboBoxState.valueChangedEvent.addListener(() => {
      setValue(comboBoxState.getChoiceIndex());
    });
    const propertiesListenerId =
      comboBoxState.propertiesChangedEvent.addListener(() => {
        setProperties(comboBoxState.properties);
      });

    return function cleanup() {
      comboBoxState.valueChangedEvent.removeListener(valueListenerId);
      comboBoxState.propertiesChangedEvent.removeListener(propertiesListenerId);
    };
  });

  return (
    <Box
      {...{
        [controlParameterIndexAnnotation]:
          comboBoxState.properties.parameterIndex,
      }}
    >
      <FormControl fullWidth>
        <InputLabel id={identifier}>{properties.name}</InputLabel>
        <Select
          labelId={identifier}
          value={value}
          label={properties.name}
          onChange={handleChange}
        >
          {properties.choices.map((choice, i) => (
            <MenuItem value={i} key={i}>
              {choice}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

const sayHello = Juce.getNativeFunction("sayHello");

const SpectrumDataReceiver_eventId = "spectrumData";


function App() {
  const controlParameterIndexUpdater = new Juce.ControlParameterIndexUpdater(
    controlParameterIndexAnnotation
  );

  document.addEventListener("mousemove", (event) => {
    controlParameterIndexUpdater.handleMouseMove(event);
  });

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setMessage] = useState("No message received yet");

  const openSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div className="looper-plugin">

      <div className="plugin-header">
        <h1 className="plugin-title">Looper Delay</h1>
      </div>

              <div className="controls-grid">
        {/* Loop Controls */}
        <div className="control-section">
          <h3 className="section-title">Loop Controls</h3>
          
          <JuceSlider identifier="samplingRate" title="Sampling Rate" />
          <JuceComboBox identifier="loopLength" />
          <JuceSlider identifier="feedback" title="Feedback" />
          <JuceSlider identifier="mix" title="Mix" />
        </div>

        {/* Transport Controls */}
        <div className="control-section">
          <h3 className="section-title">Transport</h3>
          
          <div className="button-row">
            <JuceCheckbox identifier="freeze" title="Freeze" />
            <JuceCheckbox identifier="reverse" title="Reverse" />
          </div>
        </div>

        {/* Modulation Section */}
        <div className="control-section modulation-section">
          <h3 className="section-title">Modulation</h3>
          
          <div className="mod-controls">
            <JuceSlider identifier="modRate" title="Mod Rate" />
            <JuceSlider identifier="modDepth" title="Mod Depth" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;


