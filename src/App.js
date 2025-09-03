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

// Usage
import expandIcon from './res/icons/expand.svg?react';
import collapseIcon from './res/icons/collapse.svg?react';
import directionIcon from './res/icons/rewind-start-fill.svg?react';
import freezeIcon from './res/icons/freeze.svg?react';
import saveIcon from './res/icons/save_preset.svg?react';
import loadIcon from './res/icons/load_preset.svg?react';
import bypassIcon from './res/icons/shut-down-line.svg?react';

// Current window size:     width: 768px;height: 515px;

const MetalSlider = styled(Slider)(({ theme }) => ({
  color: '#0B090A',
  transform: 'scaleY(.9) translateX(-50%) translateY(3%)',
  '& .MuiSlider-track': {
    height: '100%',
    backgroundColor: 'white',//'#0B090A',
    opacity: 0,
  },
  '& .MuiSlider-rail': {
    height: '100%',
    backgroundColor:'#161215ff',
    borderRadius: '20px',
    width: '6px',
    opacity: 1,
    boxSizing: 'border-box',
  },
  '& .MuiSlider-thumb': {
    height: "10.5%",
    borderRadius: '80%',
    backgroundColor: '#A83112',
    border: 'none',
    boxShadow: 'none',
    // The key: make the thumb smaller so it fits within bounds
    width: '', // Reduced from 10 to 8
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'none',
      backgroundColor: '#cd3b17ff',
      // Keep the same size on hover/focus
    },
    '&:before': {
      display: 'none',
    },
  },
}));

const MetalTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '12px',
  fontWeight: 'normal',
  color: '#000000',
  backgroundColor: '#ffffff',
  position: 'relative',
  left: 'calc(-19px*calc(--width-scale))',
  width: '100%'
}));

const MetalButton = styled(({ iconPath, children, ...props }) => {
  let iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', filter: 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)'}} />;
  return (
    <Button {...props}> 
      {iconElement}
    </Button>
  );
})(({ theme }) => ({

  borderRadius: 0,
  minWidth: '0',
  padding: '10%',
  width: '100%',
  height: '100%',
  display: 'block',
  color: '#000000',
  boxShadow: 'none',

  '& .MuiButton-label': {
    transform: 'translateX(26.04%)',
  },
  '&:hover': {
    boxShadow: 'none',
    filter: 'opacity(0.4)',
  },
  '&:active': {
    boxShadow: 'none',
  },
  '&:focus': {
    boxShadow: 'none',
  },
  '&:disabled': {
    color: '#000000',
    opacity: 0.6,
  },
}));

const MetalCheckbox = styled(({ uncheckedIconPath, checkedIconPath, iconPath, iconType, ...props }) => {
  let iconElement = null;
  let checkedIconElement = null;
  
  if (uncheckedIconPath && checkedIconPath) {
    // Dual icons
    iconElement = <img src={uncheckedIconPath} alt="" style={{ width: '100%', height: '100%' }} />;
    checkedIconElement = <img src={checkedIconPath} alt="" style={{ width: '100%', height: '100%' }} />;
  } else if (iconPath && iconType === 'flipped') {
    // Flipped icon
    iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%' }} />;
    checkedIconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />;
  } else if (iconPath && iconType === 'grayed') {
    // Grayed icon
    iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', filter: 'grayscale(100%) opacity(0.2) brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} />;
    checkedIconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', filter: 'grayscale(0%) opacity(1) brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)' }} />;
  } else if (iconPath) {
    // Single icon (no transformation)
    iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%' }} />;
    checkedIconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%' }} />;
  }
  
  return (
    <Checkbox
      icon={iconElement}
      checkedIcon={checkedIconElement}
      {...props}
    />
  );
})(({ theme }) => ({
  padding: '10%', // Converted from 4px (4/768 * 100 = 0.52%)
  width: '100%',
  height: '100%',
  display: 'block',
  '& .MuiSvgIcon-root': {
    fontSize: '2.34%', // Converted from 18px (18/768 * 100 = 2.34%)
    color: '#000000',
  },
  '&:not(.Mui-checked) .MuiSvgIcon-root': {
    backgroundColor: '#ffffff',
    borderRadius: '0.26%', // Converted from 2px (2/768 * 100 = 0.26%)
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: '#ffffff',
    borderRadius: '0.26%', // Converted from 2px (2/768 * 100 = 0.26%)
  },
  '&:hover': {
    backgroundColor: '#2a2226ff', // lightgrey
    borderRadius: '0%', // Converted from 0px (already 0, but made explicit)
  },
}));

const MetalFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  '& .MuiFormControlLabel-label': {
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '1.82%', // Converted from 14px (14/768 * 100 = 1.82%)
    fontWeight: 'normal',
    color: '#000000',
    marginLeft: '0.375em', // Converted from 6px to em (6/16 = 0.375em, assuming 16px base font size)
  },
}));

const controlParameterIndexAnnotation = "controlparameterindex";

function JuceSlider({ identifier, title }) {
  JuceSlider.propTypes = {
    identifier: PropTypes.string,
    title: PropTypes.string,
  };
  const widthScale = getComputedStyle(document.documentElement)
    .getPropertyValue('--width-scale');
  const heightScale = getComputedStyle(document.documentElement)
    .getPropertyValue('--height-scale');

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
  const scaledHeight = `${204 * parseFloat(heightScale)}px`;
  return (
    <Box sx={{}}>
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
        orientation="vertical" // Add this line
        sx={{ 
          flexGrow: 1,
          height: scaledHeight, // You'll need to specify a height for vertical sliders
        }}
      />
      

  </Box>
);
}

function JuceCheckbox({ identifier, uncheckedIconPath, checkedIconPath, iconPath, iconType }) {
  
  JuceCheckbox.propTypes = {
    identifier: PropTypes.string,
    uncheckedIconPath: PropTypes.string,
    checkedIconPath: PropTypes.string,
    iconPath: PropTypes.string,
    iconType: PropTypes.string,
  };

  const checkboxState = Juce.getToggleState(identifier);

  const [value, setValue] = useState(checkboxState.getValue());
  const [properties, setProperties] = useState(checkboxState.properties);

  const handleChange = (event) => {
    console.log(properties.name + " was toggled");
    if (properties.name=="Freeze") {
      const reverseState = Juce.getToggleState("reverse")
      console.log(reverseState);
      if (reverseState.getValue) {
         reverseState.setValue(false);
      }
    }
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
      all: 'unset',
      display: 'contents', // Makes Box invisible to layout
    }}
  >
    <MetalFormControlLabel
      sx={{
        margin: 0,
        padding: 0,
        display: 'inline-flex', // Override any flex styling
        all: 'unset',
        display: 'contents',
      }}
      control={
        <MetalCheckbox
          checked={cb.props.checked}
          onChange={cb.props.onChange}
          uncheckedIconPath={uncheckedIconPath}
          checkedIconPath={checkedIconPath}
          iconPath={iconPath}
          iconType={iconType}
        />
      }
      
    />
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
    <div className="plugin-window">
      <div className="plugin-header">
        <h1 className="plugin-title">MIMETIME</h1>
        <div className="preset-buttons">
          <div className="p-button">
            <div className="button button1">
            <MetalButton 
              iconPath={saveIcon}
              onClick={() => {
                savePreset();
                console.log("Save")
              }}
            />
          </div>
          </div>
          <div className="p-button">
            <div className="button button2">
            <MetalButton 
              iconPath={loadIcon}
              onClick={() => {
                loadPreset();
                console.log("Save")
              }}
            />
          </div>
          </div>
          <div className="p-button">
            <div className="button button2">
              <JuceCheckbox
                iconType="grayed"
                iconPath={bypassIcon}
                identifier="bypass" title="Bypass"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="plugin-body">
        <div className="transport-section">
          <div className="transport-buttons">
            <h2 className="section-header">PLAY</h2>
              <div className="t-button">
                <div className="button">
              <JuceCheckbox
                iconType="grayed"
                iconPath={freezeIcon}
                identifier="freeze" title="Freeze"
              />
            </div>
            </div>
            <div className="t-button">
              <div className="button">
                <JuceCheckbox
                  iconType="grayed"
                  iconPath={expandIcon}
                  identifier="halfSpeed" title="X2"
                  // ... any other checkbox props
                />
              </div>
            </div>
            <div className="t-button">
              <div className="button">
              <JuceCheckbox
                iconType="grayed"
                iconPath={directionIcon}
                identifier="reverse" title="Reverse"
              />
            </div>
            </div>
          </div>
          <div className="icon-container">
          <div className="plugin-icon">
            
          </div>
          </div>
          
        </div>

        <div className="slider-section">
          <div className="slider-container">
            <h2 className="section-header">DLY</h2>
            <div className="slider-block">
              <div className="slider"><JuceSlider identifier="samplingRate" title="Coarse" /></div>
              <div className="slider"><JuceSlider identifier="loopLength" title="Fine"/></div>
            </div>
            <div className="param-names">
              <h3 className="param-name">speed</h3>
              <h3 className="param-name">length</h3>
            </div>
          </div>
          <div className="slider-container">
            <h2 className="section-header">MOD</h2>
            <div className="slider-block">
              <div className="slider"><JuceSlider identifier="rate" title="Mod Rate" /></div>
              <div className="slider"><JuceSlider identifier="depth" title="Mod Depth" /></div>
            </div>
            <div className="param-names">
              <h3 className="param-name">rate</h3>
              <h3 className="param-name">depth</h3>
            </div>
          </div>
          <div className="slider-container">
            <h2 className="section-header">MIX</h2>
            <div className="slider-block">
              <div className="slider"><JuceSlider identifier="feedback" title="Feedback" /></div>
              <div className="slider"><JuceSlider identifier="mix" title="Mix" /></div>
            </div>
            <div className="param-names">
              <h3 className="param-name">regen</h3>
              <h3 className="param-name">blend</h3>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
}

export default App;


