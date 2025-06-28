
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

import { styled } from '@mui/material/styles';

const MetalSlider = styled(Slider)(({ theme }) => ({
  color: '#000000',
  height: '20px',
  padding: '0% 5%',
  
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor: '#ffffff',
    height: '0%',
    borderRadius: 0,
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#ffffff',
    border: '1.8px solid #000000',
    height: '100%',
    borderRadius: 0,
    opacity: 1,
    boxSizing: 'border-box',
    //width: '372px',
    width: '103%',
  },
  '& .MuiSlider-thumb': {
    height: 20,
    borderRadius: 0,
    backgroundColor: '#000000',
    border: 'none',
    boxShadow: 'none',
    marginLeft: '10%',
    // The key: make the thumb smaller so it fits within bounds
    width: 10, // Reduced from 10 to 8
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'none',
      backgroundColor: '#000000',
      // Keep the same size on hover/focus
    },
    '&:before': {
      display: 'none',
    },
  },
}));

const MetalTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '14px',
  fontWeight: 'normal',
  color: '#000000',
  backgroundColor: '#ffffff',
  textAlign: 'right',
  marginTop: '6px',
  padding: '2px 50px',
  border: 'none',
  outline: 'none',
}));

const MetalCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: '4px',
  
  '& .MuiSvgIcon-root': {
    fontSize: '18px', // Much smaller than default
    color: '#000000',
  },
  
  '&:not(.Mui-checked) .MuiSvgIcon-root': {
    backgroundColor: '#ffffff',
    border: '1.8px solid #000000',
    borderRadius: '2px',
  },
  
  '&.Mui-checked .MuiSvgIcon-root': {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '1.8px solid #000000',
    borderRadius: '2px',
  },
  
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const MetalFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  
  '& .MuiFormControlLabel-label': {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '14px',
    fontWeight: 'normal',
    color: '#000000',
    marginLeft: '6px',
  },
}));

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
  const formatValue = (value) => {
    const num = parseFloat(value);
    if (num >= 100) return num.toFixed(0); // No decimals for large numbers
    if (num >= 10) return num.toFixed(1);  // 1 decimal for medium numbers
    return num.toFixed(2);                 // 2 decimals for small numbers
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ 
          minWidth: '50px', 
          maxWidth: '20px', 
          textAlign: 'right',
          fontSize: '12px'
        }}>
        {properties.name}:
      </Typography>
      <MetalSlider
        aria-label={title}
        value={value}
        scale={calculateValue}
        onChange={handleChange}
        min={0}
        max={1}
        step={1 / (properties.numSteps - 1)}
        onChangeCommitted={changeCommitted}
        onMouseDown={mouseDown}
        sx={{ flexGrow: 1 }}
      />
      <MetalTypography sx={{ 
        minWidth: '20px', 
        maxWidth: '20px', 
        textAlign: 'right',
        fontSize: '12px'
      }}>
        {parseFloat(sliderState.getScaledValue()).toFixed(1)}
      </MetalTypography>
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
      [controlParameterIndexAnnotation]: checkboxState.properties.parameterIndex,
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      minHeight: '32px',
    }}
  >
    <FormGroup>
      <MetalFormControlLabel 
        control={
          <MetalCheckbox 
            checked={cb.props.checked}
            onChange={cb.props.onChange}
            // Add any other props your cb needs
          />
        } 
        label={properties.name} 
      />
    </FormGroup>
  </Box>
);
}


function App() {
  const controlParameterIndexUpdater = new Juce.ControlParameterIndexUpdater(
    controlParameterIndexAnnotation
  );

  document.addEventListener("mousemove", (event) => {
    controlParameterIndexUpdater.handleMouseMove(event);
  });

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setMessage] = useState("No message received yet");

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
        <h1 className="plugin-title">616 Digital Delay</h1>
      </div>

      <div className="controls-grid">
        {/* Loop Controls */}
        <div className="control-section loop-section" >
          <h3 className="section-title">Loop Controls</h3>
          
          <JuceSlider identifier="samplingRate" title="Coarse" />
          <JuceSlider identifier="loopLength" title="Fine"/>
          <JuceSlider identifier="feedback" title="Feedback" />
          <JuceSlider identifier="mix" title="Mix" />
        </div>

               {/* Modulation Section */}
        <div className="control-section modulation-section">
          <h3 className="section-title">Modulation</h3>
          
          <div className="mod-controls">
            <JuceSlider identifier="rate" title="Mod Rate" />
            <JuceSlider identifier="depth" title="Mod Depth" />
          </div>
        </div>
      </div>

        {/* Transport Controls */}
        <div className="control-section transport-section">
          <h3 className="section-title">Transport</h3>
          
          <div className="button-row">
            <JuceCheckbox identifier="freeze" title="Freeze" />
            <JuceCheckbox identifier="reverse" title="Reverse" />
          </div>
        </div>

      <style jsx>{`

      `}</style>
    </div>
  );
}

export default App;


