import Box from "@mui/material/Container";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { React, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import * as Juce from "juce-framework-frontend";

import "./App.css";

import { styled } from '@mui/material/styles';

const MetalSlider = styled(Slider)(({ theme }) => ({
  color: '#000000',
  height: '20px',
  padding: '0%',
  left: '6.5%',
  '& .MuiSlider-track': {
    border: 'none',
    backgroundColor: '#ffffff',
    height: '0%',
  },
  '& .MuiSlider-rail': {
    position: 'relative',
    width: '105%',
    backgroundColor: '#ffffff',
    border: '1.8px solid #000000',
    height: '100%',
    borderRadius: 0,
    opacity: 1,
    boxSizing: 'border-box',
    right: '6px',
  },
  '& .MuiSlider-thumb': {
    height: 20,
    borderRadius: 0,
    backgroundColor: '#000000',
    border: 'none',
    boxShadow: 'none',
    marginLeft: '0%',
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
  textAlign: 'left',
  marginTop: '6px',
  padding: '2px 50px',
  border: 'none',
  outline: 'none',
}));

const MetalButton = styled(Button)(({ theme }) => ({
  // Background styling matching the C++ code
  backgroundColor: '#ffffff', // white background (normal state)
  border: '1px solid #000000', // black border, 1px width
  borderRadius: 0, // rectangular shape (no rounded corners)
  
  // Font styling from getTextButtonFont
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '7px', // 60% of button height equivalent
  fontWeight: 'normal',
  color: '#000000', // black text
  textTransform: 'none', // disable MUI's default uppercase transform
  
  // Layout and positioning (matching drawButtonText indentation)
  padding: '0.3em 1.5em', // yIndent equivalent
  textAlign: 'center',
  lineHeight: 1.2,
  
  // Remove MUI's default styling
  boxShadow: 'none',
  minWidth: 'auto',
  
  '& .MuiButton-label': {
    transform: 'translateX(200px)', // adjust the -2px value as needed
  },
  // Hover state (shouldDrawButtonAsHighlighted)
  '&:hover': {
    backgroundColor: '#d3d3d3', // lightgrey
    border: '1px solid #000000',
    boxShadow: 'none',
  },
  
  // Active/pressed state (shouldDrawButtonAsDown)  
  '&:active': {
    backgroundColor: '#ffffff', // white when pressed
    border: '1px solid #000000',
    boxShadow: 'none',
  },
  
  // Focus state
  '&:focus': {
    backgroundColor: '#ffffff',
    border: '1px solid #000000',
    boxShadow: 'none',
  },
  
  // Disabled state
  '&:disabled': {
    backgroundColor: '#ffffff',
    border: '1px solid #000000',
    color: '#000000',
    opacity: 0.6,
  },
}));

const MetalCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: '4px',
  
  '& .MuiSvgIcon-root': {
    fontSize: '18px', // Much smaller than default
    color: '#000000',
  },
  
  '&:not(.Mui-checked) .MuiSvgIcon-root': {
    backgroundColor: '#ffffff',
    //border: '1.8px solid #000000',
    borderRadius: '2px',
  },
  
  '&.Mui-checked .MuiSvgIcon-root': {
    backgroundColor: '#000000',
    color: '#ffffff',
    //border: '1.8px solid #000000',
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

  // Loop Length funcs
  function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
  }

function floorToPowerOfTwo(n) {
    if (n <= 0) return 1;
    // Find the highest power of 2 that is <= n
    let power = 1;
    while (power * 2 <= n) {
        power *= 2;
    }
    return power;
  }

  function formatValue() {
    console.log(properties);
    if (properties.name=="Coarse" || properties.name=='Fine') {
      if (properties.name=="Coarse") {
        const value = parseFloat(sliderState.getScaledValue());
        const intValue = Math.floor(value);
    
        if (isPowerOfTwo(intValue)) {
            return intValue.toString();
        } else {
            return floorToPowerOfTwo(intValue).toString();
        }
      }
      return parseFloat(sliderState.getScaledValue()).toFixed(0);
    } else {
      return parseFloat(sliderState.getScaledValue()).toFixed(1);
    }
  }
  
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1, width: '110%', right: '7.2%'}}>
      <Typography variant="body2" sx={{ 
        textAlign: 'right',
        minWidth: '20%', 
        maxWidth: '20%', 
        fontSize: '12px'
      }}>
      {properties.name}
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
        textAlign: 'left',
        fontSize: '12px'
      }}>
        {formatValue()}
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

const loadPreset = Juce.getNativeFunction("loadPreset");
const savePreset = Juce.getNativeFunction("savePreset");

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
        <h1 className="plugin-title">616 DIGITAL DELAY</h1>
        <h1 className="developer-name">Cillic Audio</h1>
        <MetalButton className="preset-button"
          variant="contained"
          onClick={() => {
            savePreset();
            console.log("Save")
          }}
        >
          Save
        </MetalButton>
        <MetalButton className="preset-button"
          variant="contained"
          onClick={() => {
            loadPreset();
            console.log("Load")
          }}
        >
          Load
        </MetalButton>
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


