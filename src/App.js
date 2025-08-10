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
import directionIcon from './res/icons/direction.svg?react';
import freezeIcon from './res/icons/freeze.svg?react';
import saveIcon from './res/icons/save_preset.svg?react';
import loadIcon from './res/icons/load_preset.svg?react';

// Current window size:     width: 768px;height: 515px;

const MetalSlider = styled(Slider)(({ theme }) => ({
  color: '#000000',
  transform: 'scaleY(0.9) translateX(-64.5%)',
  transformOrigin: 'center',
  '& .MuiSlider-track': {
    borderRadius: 0,
    border: 'none',
    backgroundColor: '#A83112',
  },
  '& .MuiSlider-rail': {
    transform: 'scaleY(1.1) translateX(-50%)',
    width: '100%',
    backgroundColor: '#A83112',
    borderRadius: 0,
    opacity: 1,
    boxSizing: 'border-box',
  },
  '& .MuiSlider-thumb': {
    height: "10%",
    borderRadius: 0,
    backgroundColor: '#cd3b17ff',
    border: 'none',
    boxShadow: 'none',
    // The key: make the thumb smaller so it fits within bounds
    width: '100%', // Reduced from 10 to 8
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
  left: '-19px',
  width: '100%'
}));

const MetalButton = styled(({ iconPath, children, ...props }) => {
  let iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%' }} />;
  return (
    <Button {...props}> 
      {iconElement}
    </Button>
  );
})(({ theme }) => ({
  backgroundColor: '#ffffff',
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
    backgroundColor: '#d3d3d3',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },
  '&:focus': {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: '#ffffff',
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
    iconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', filter: 'grayscale(100%) opacity(0.4)' }} />;
    checkedIconElement = <img src={iconPath} alt="" style={{ width: '100%', height: '100%', filter: 'grayscale(0%) opacity(1)' }} />;
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
    backgroundColor: '#000000',
    color: '#ffffff',
    borderRadius: '0.26%', // Converted from 2px (2/768 * 100 = 0.26%)
  },
  '&:hover': {
    backgroundColor: '#d3d3d3', // lightgrey
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
      label={properties.name}
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
        <h1 className="plugin-title">212 Digital Delay</h1>
        <div className="plugin-icon"></div>
      </div>
      <div className="plugin-sliders">
        <div className="slider-container" >
          <p className="slider-label">ECHO</p>
          <div className="slider-block">
            <div className="slider"><JuceSlider identifier="samplingRate" title="Coarse" /></div>
            <div className="slider"><JuceSlider identifier="feedback" title="Feedback" /></div>
          </div>
          <div className="label-block">
            <div className="param-label">
              <svg width="calc(16px*var(--width-scale))" height="calc(67px*var(--height-scale))" viewBox="0 0 16 67" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.24 64.2565V60.7805C14.24 60.5458 14.2253 60.2525 14.196 59.9005C14.152 59.5485 14.064 59.1745 13.932 58.7785C13.7853 58.3825 13.58 57.9938 13.316 57.6125C13.052 57.2165 12.6927 56.8645 12.238 56.5565C11.7833 56.2485 11.2187 55.9992 10.544 55.8085C9.85467 55.6032 9.026 55.5005 8.058 55.5005C7.11933 55.5005 6.28333 55.5958 5.55 55.7865C4.802 55.9625 4.17133 56.2632 3.658 56.6885C3.13 57.0992 2.734 57.6345 2.47 58.2945C2.19133 58.9545 2.052 59.7685 2.052 60.7365V64.2565H14.24ZM0.291999 66.3465V60.9565C0.291999 58.5365 0.907999 56.6738 2.14 55.3685C3.372 54.0632 5.24933 53.4105 7.772 53.4105C9.092 53.4105 10.2653 53.5572 11.292 53.8505C12.304 54.1438 13.162 54.5985 13.866 55.2145C14.5553 55.8305 15.0833 56.6152 15.45 57.5685C15.8167 58.5218 16 59.6512 16 60.9565L16 66.3465H0.291999ZM0.291999 50.8563L0.291999 40.0103H2.052V48.7663H7.046V40.6043H8.806V48.7663H14.24V39.9443H16V50.8563H0.291999ZM0.291999 37.407V35.317H14.24V27.001H16V37.407H0.291999ZM9.51 22.4764V17.1524L2.184 19.7704V19.8144L9.51 22.4764ZM0.291999 20.9144V18.6044L16 12.4664V14.7764L11.27 16.4924V23.1364L16 24.8964V27.0304L0.291999 20.9144ZM9.576 6.05962H16L16 8.14962H9.576L0.291999 14.2216V11.7356L7.772 7.02762L0.291999 2.42962V0.0536244L9.576 6.05962Z" fill="#F2F3ED"/>
              </svg>
            </div>

            <div className="param-label">
              <svg width={`calc(18px * var(--width-scale))`} height={`calc(72px * var(--height-scale))`} viewBox="0 0 18 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.292 71.8133V64.4213C1.292 62.9253 1.65867 61.7593 2.392 60.9233C3.12533 60.0726 4.13 59.6473 5.406 59.6473C6.35933 59.6473 7.19533 59.8673 7.914 60.3073C8.63267 60.7326 9.124 61.422 9.388 62.3753H9.432C9.52 61.9206 9.66667 61.554 9.872 61.2753C10.0773 60.982 10.3267 60.7546 10.62 60.5933C10.8987 60.4173 11.214 60.2926 11.566 60.2193C11.918 60.1313 12.2847 60.0653 12.666 60.0213C13.0473 59.992 13.436 59.97 13.832 59.9553C14.228 59.9406 14.6167 59.904 14.998 59.8453C15.3793 59.7866 15.746 59.706 16.098 59.6033C16.4353 59.486 16.736 59.3173 17 59.0973V61.4293C16.8387 61.576 16.6187 61.6786 16.34 61.7373C16.0613 61.7813 15.7533 61.8106 15.416 61.8253C15.064 61.84 14.69 61.8546 14.294 61.8693C13.898 61.884 13.5093 61.928 13.128 62.0013C12.7467 62.06 12.3873 62.1333 12.05 62.2213C11.698 62.3093 11.3973 62.4486 11.148 62.6393C10.884 62.83 10.6787 63.0793 10.532 63.3873C10.3707 63.6953 10.29 64.106 10.29 64.6193V69.7233H17V71.8133H1.292ZM8.53 65.3673C8.53 64.8833 8.49333 64.4213 8.42 63.9813C8.34667 63.5413 8.20733 63.16 8.002 62.8373C7.782 62.5 7.496 62.236 7.144 62.0453C6.77733 61.84 6.308 61.7373 5.736 61.7373C4.944 61.7373 4.29867 61.9573 3.8 62.3973C3.30133 62.8373 3.052 63.5486 3.052 64.5313V69.7233H8.53V65.3673ZM1.292 56.7527L1.292 45.9067H3.052L3.052 54.6627H8.046V46.5007H9.806V54.6627H15.24V45.8407H17V56.7527H1.292ZM15.042 31.5555C15.8633 32.1715 16.4573 32.9342 16.824 33.8435C17.176 34.7529 17.352 35.6695 17.352 36.5935C17.352 37.7669 17.1393 38.8155 16.714 39.7395C16.274 40.6635 15.6873 41.4482 14.954 42.0935C14.2207 42.7389 13.3773 43.2302 12.424 43.5675C11.4707 43.9049 10.4807 44.0735 9.454 44.0735C8.31 44.0735 7.22467 43.9195 6.198 43.6115C5.15667 43.2889 4.24733 42.8195 3.47 42.2035C2.69267 41.5729 2.07667 40.7955 1.622 39.8715C1.15267 38.9329 0.918 37.8402 0.918 36.5935C0.918 35.7429 1.02067 34.9435 1.226 34.1955C1.41667 33.4329 1.72467 32.7582 2.15 32.1715C2.57533 31.5702 3.118 31.0715 3.778 30.6755C4.42333 30.2649 5.208 29.9862 6.132 29.8395V31.9295C5.53067 32.0322 5.01733 32.2229 4.592 32.5015C4.152 32.7802 3.79267 33.1249 3.514 33.5355C3.23533 33.9462 3.03 34.4155 2.898 34.9435C2.75133 35.4569 2.678 36.0069 2.678 36.5935C2.678 37.5469 2.86867 38.3682 3.25 39.0575C3.63133 39.7322 4.13733 40.2895 4.768 40.7295C5.384 41.1549 6.09533 41.4702 6.902 41.6755C7.694 41.8809 8.508 41.9835 9.344 41.9835C10.1653 41.9835 10.9573 41.8662 11.72 41.6315C12.468 41.3969 13.1353 41.0522 13.722 40.5975C14.294 40.1429 14.756 39.5855 15.108 38.9255C15.4453 38.2509 15.614 37.4735 15.614 36.5935C15.614 35.7722 15.482 35.0462 15.218 34.4155C14.954 33.7849 14.5947 33.2569 14.14 32.8315C13.6707 32.3915 13.128 32.0615 12.512 31.8415C11.8813 31.6215 11.2067 31.5262 10.488 31.5555V36.5715H8.728V29.6855H17V31.0055L15.042 31.5555ZM1.292 26.6102L1.292 15.7642H3.052L3.052 24.5202H8.046V16.3582H9.806V24.5202H15.24V15.6982H17V26.6102H1.292ZM1.292 13.183V10.961L14.03 2.68895V2.64495H1.292V0.664953H17V2.95295L4.394 11.159V11.203H17V13.183H1.292Z" fill="#F2F3ED"/>
              </svg>
            </div>
          </div>
          
        </div>
        <div className="slider-container">
          <p className="slider-label">MOD</p>
          <div className="slider-block">
            <div className="slider"><JuceSlider identifier="rate" title="Mod Rate" /></div>
            <div className="slider"><JuceSlider identifier="depth" title="Mod Depth" /></div>
          </div>
          <div className="label-block">
            <div className="param-label">
              <svg width={`calc(16px * var(--width-scale))`} height={`calc(52px * var(--height-scale))`} viewBox="0 0 16 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.291999 51.6727L0.291999 44.2807C0.291999 42.7847 0.658666 41.6187 1.392 40.7827C2.12533 39.932 3.13 39.5067 4.406 39.5067C5.35933 39.5067 6.19533 39.7267 6.914 40.1667C7.63267 40.592 8.124 41.2813 8.388 42.2347H8.432C8.52 41.78 8.66667 41.4133 8.872 41.1347C9.07733 40.8413 9.32667 40.614 9.62 40.4527C9.89867 40.2767 10.214 40.152 10.566 40.0787C10.918 39.9907 11.2847 39.9247 11.666 39.8807C12.0473 39.8513 12.436 39.8293 12.832 39.8147C13.228 39.8 13.6167 39.7633 13.998 39.7047C14.3793 39.646 14.746 39.5653 15.098 39.4627C15.4353 39.3453 15.736 39.1767 16 38.9567V41.2887C15.8387 41.4353 15.6187 41.538 15.34 41.5967C15.0613 41.6407 14.7533 41.67 14.416 41.6847C14.064 41.6993 13.69 41.714 13.294 41.7287C12.898 41.7433 12.5093 41.7873 12.128 41.8607C11.7467 41.9193 11.3873 41.9927 11.05 42.0807C10.698 42.1687 10.3973 42.308 10.148 42.4987C9.884 42.6893 9.67867 42.9387 9.532 43.2467C9.37067 43.5547 9.29 43.9653 9.29 44.4787V49.5827H16V51.6727H0.291999ZM7.53 45.2267C7.53 44.7427 7.49333 44.2807 7.42 43.8407C7.34667 43.4007 7.20733 43.0193 7.002 42.6967C6.782 42.3593 6.496 42.0953 6.144 41.9047C5.77733 41.6993 5.308 41.5967 4.736 41.5967C3.944 41.5967 3.29867 41.8167 2.8 42.2567C2.30133 42.6967 2.052 43.408 2.052 44.3907V49.5827H7.53V45.2267ZM9.51 33.9061V28.5821L2.184 31.2001V31.2441L9.51 33.9061ZM0.291999 32.3441V30.0341L16 23.8961V26.2061L11.27 27.9221V34.5661L16 36.3261V38.4601L0.291999 32.3441ZM2.052 20.802L2.052 26.038H0.291999L0.291999 13.476H2.052V18.712H16V20.802H2.052ZM0.291999 11.7332V0.887218H2.052V9.64322H7.046L7.046 1.48122H8.806L8.806 9.64322H14.24L14.24 0.821219H16L16 11.7332H0.291999Z" fill="#F2F3ED"/>
              </svg>
            </div>
            <div className="param-label">
              <svg width={`calc(17px * var(--width-scale))`} height={`calc(73px * var(--height-scale))`} viewBox="0 0 17 73" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.16 69.9956V66.3616C15.16 66.1163 15.1447 65.8096 15.114 65.4416C15.068 65.0736 14.976 64.6826 14.838 64.2686C14.6847 63.8546 14.47 63.4483 14.194 63.0496C13.918 62.6356 13.5423 62.2676 13.067 61.9456C12.5917 61.6236 12.0013 61.3629 11.296 61.1636C10.5753 60.9489 9.709 60.8416 8.697 60.8416C7.71567 60.8416 6.84167 60.9413 6.075 61.1406C5.293 61.3246 4.63367 61.6389 4.097 62.0836C3.545 62.5129 3.131 63.0726 2.855 63.7626C2.56367 64.4526 2.418 65.3036 2.418 66.3156V69.9956H15.16ZM0.577999 72.1806V66.5456C0.577999 64.0156 1.222 62.0683 2.51 60.7036C3.798 59.3389 5.76067 58.6566 8.398 58.6566C9.778 58.6566 11.0047 58.8099 12.078 59.1166C13.136 59.4233 14.033 59.8986 14.769 60.5426C15.4897 61.1866 16.0417 62.0069 16.425 63.0036C16.8083 64.0003 17 65.1809 17 66.5456V72.1806H0.577999ZM0.577999 55.9863L0.577999 44.6473H2.418L2.418 53.8013H7.639V45.2683H9.479V53.8013H15.16V44.5783H17V55.9863H0.577999ZM8.444 39.7407V35.4627C8.45933 34.2207 8.20633 33.3161 7.685 32.7487C7.16367 32.1661 6.41233 31.8747 5.431 31.8747C4.44967 31.8747 3.706 32.1661 3.2 32.7487C2.67867 33.3161 2.418 34.2207 2.418 35.4627V39.7407H8.444ZM0.577999 41.9257V34.7267C0.577999 33.0707 1.00733 31.8211 1.866 30.9777C2.70933 30.1191 3.89767 29.6897 5.431 29.6897C6.96433 29.6897 8.16033 30.1191 9.019 30.9777C9.87767 31.8211 10.2993 33.0707 10.284 34.7267V39.7407H17V41.9257H0.577999ZM2.418 23.2857V28.7597H0.577999L0.577999 15.6267H2.418L2.418 21.1007H17V23.2857H2.418ZM0.577999 13.8046V11.6196H7.639L7.639 2.97163H0.577999V0.786632H17V2.97163H9.479L9.479 11.6196H17V13.8046H0.577999Z" fill="#F2F3ED"/>
              </svg>

            </div>
          </div>
        </div>
        <div className="slider-container-solo">
          <p className="slider-label-center">OUT</p>
          <div className="slider-block">
            <div className="slider"><JuceSlider identifier="mix" title="Mix" /></div>
          </div>
          <div className="label-block-solo">
            <div className="param-label">
              <svg width={`calc(16px * var(--width-scale))`} height={`calc(71px * var(--height-scale))`} viewBox="0 0 16 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.046 68.2956V64.1156C7.046 62.9276 6.84067 62.0769 6.43 61.5636C6.00467 61.0356 5.374 60.7716 4.538 60.7716C3.98067 60.7716 3.54067 60.8596 3.218 61.0356C2.89533 61.2116 2.646 61.4536 2.47 61.7616C2.294 62.0696 2.184 62.4289 2.14 62.8396C2.08133 63.2356 2.052 63.6609 2.052 64.1156V68.2956H7.046ZM0.291999 70.3856V64.6876C0.291999 64.3502 0.299332 63.9909 0.313999 63.6096C0.313999 63.2136 0.335999 62.8249 0.379999 62.4436C0.409333 62.0622 0.460667 61.7102 0.534 61.3876C0.607333 61.0502 0.717333 60.7642 0.863999 60.5296C1.172 60.0162 1.59733 59.5836 2.14 59.2316C2.68267 58.8649 3.35 58.6816 4.142 58.6816C4.978 58.6816 5.704 58.8869 6.32 59.2976C6.92133 59.6936 7.36867 60.2656 7.662 61.0136H7.706C7.91133 60.0456 8.35133 59.3049 9.026 58.7916C9.70067 58.2782 10.522 58.0216 11.49 58.0216C12.062 58.0216 12.6193 58.1242 13.162 58.3296C13.7047 58.5349 14.1887 58.8429 14.614 59.2536C15.0247 59.6496 15.362 60.1482 15.626 60.7496C15.8753 61.3362 16 62.0182 16 62.7956V70.3856H0.291999ZM14.24 68.2956V63.0596C14.24 62.1356 13.9907 61.4169 13.492 60.9036C12.9933 60.3756 12.304 60.1116 11.424 60.1116C10.9107 60.1116 10.4853 60.2069 10.148 60.3976C9.81067 60.5882 9.54667 60.8449 9.356 61.1676C9.15067 61.4756 9.01133 61.8349 8.938 62.2456C8.85 62.6562 8.806 63.0816 8.806 63.5216V68.2956H14.24ZM0.291999 55.325V53.235H14.24V44.919H16V55.325H0.291999ZM0.291999 43.1004L0.291999 32.2544H2.052L2.052 41.0104H7.046V32.8484H8.806V41.0104H14.24V32.1884H16V43.1004H0.291999ZM0.291999 29.6732V27.4512L13.03 19.1792V19.1352H0.291999V17.1552H16L16 19.4432L3.394 27.6492V27.6932H16V29.6732H0.291999ZM14.24 11.6842V8.20823C14.24 7.97357 14.2253 7.68023 14.196 7.32823C14.152 6.97623 14.064 6.60223 13.932 6.20623C13.7853 5.81023 13.58 5.42157 13.316 5.04023C13.052 4.64423 12.6927 4.29223 12.238 3.98423C11.7833 3.67623 11.2187 3.4269 10.544 3.23623C9.85467 3.0309 9.026 2.92823 8.058 2.92823C7.11933 2.92823 6.28333 3.02357 5.55 3.21423C4.802 3.39023 4.17133 3.6909 3.658 4.11623C3.13 4.5269 2.734 5.06223 2.47 5.72223C2.19133 6.38223 2.052 7.19623 2.052 8.16423V11.6842H14.24ZM0.291999 13.7742V8.38423C0.291999 5.96423 0.907999 4.10157 2.14 2.79623C3.372 1.4909 5.24933 0.838234 7.772 0.838234C9.092 0.838234 10.2653 0.984901 11.292 1.27823C12.304 1.57157 13.162 2.02623 13.866 2.64223C14.5553 3.25823 15.0833 4.0429 15.45 4.99623C15.8167 5.94957 16 7.0789 16 8.38423V13.7742H0.291999Z" fill="#F2F3ED"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="plugin-buttons">

        <div className="button-container1">
          <div className='button-label-svg'>
          <svg width={`calc(18px * var(--width-scale))`} height={`calc(131px * var(--height-scale))`} viewBox="0 0 18 131" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.052 125.109V130.345H1.292V117.783H3.052V123.019H17V125.109H3.052ZM1.292 116.04V108.648C1.292 107.152 1.65867 105.986 2.392 105.15C3.12533 104.299 4.13 103.874 5.406 103.874C6.35933 103.874 7.19533 104.094 7.914 104.534C8.63267 104.959 9.124 105.649 9.388 106.602H9.432C9.52 106.147 9.66667 105.781 9.872 105.502C10.0773 105.209 10.3267 104.981 10.62 104.82C10.8987 104.644 11.214 104.519 11.566 104.446C11.918 104.358 12.2847 104.292 12.666 104.248C13.0473 104.219 13.436 104.197 13.832 104.182C14.228 104.167 14.6167 104.131 14.998 104.072C15.3793 104.013 15.746 103.933 16.098 103.83C16.4353 103.713 16.736 103.544 17 103.324V105.656C16.8387 105.803 16.6187 105.905 16.34 105.964C16.0613 106.008 15.7533 106.037 15.416 106.052C15.064 106.067 14.69 106.081 14.294 106.096C13.898 106.111 13.5093 106.155 13.128 106.228C12.7467 106.287 12.3873 106.36 12.05 106.448C11.698 106.536 11.3973 106.675 11.148 106.866C10.884 107.057 10.6787 107.306 10.532 107.614C10.3707 107.922 10.29 108.333 10.29 108.846V113.95H17V116.04H1.292ZM8.53 109.594C8.53 109.11 8.49333 108.648 8.42 108.208C8.34667 107.768 8.20733 107.387 8.002 107.064C7.782 106.727 7.496 106.463 7.144 106.272C6.77733 106.067 6.308 105.964 5.736 105.964C4.944 105.964 4.29867 106.184 3.8 106.624C3.30133 107.064 3.052 107.775 3.052 108.758V113.95H8.53V109.594ZM10.51 98.2733V92.9493L3.184 95.5673V95.6113L10.51 98.2733ZM1.292 96.7113V94.4013L17 88.2633V90.5733L12.27 92.2893V98.9333L17 100.693V102.827L1.292 96.7113ZM1.292 86.7357V84.5137L14.03 76.2417V76.1977H1.292V74.2177H17V76.5057L4.394 84.7117V84.7557H17V86.7357H1.292ZM5.89 61.7507C4.76067 61.8681 3.94667 62.2787 3.448 62.9827C2.93467 63.6721 2.678 64.5594 2.678 65.6447C2.678 66.0847 2.722 66.5174 2.81 66.9427C2.898 67.3681 3.04467 67.7494 3.25 68.0867C3.45533 68.4094 3.734 68.6734 4.086 68.8787C4.42333 69.0694 4.84867 69.1647 5.362 69.1647C5.846 69.1647 6.242 69.0254 6.55 68.7467C6.84333 68.4534 7.08533 68.0721 7.276 67.6027C7.46667 67.1187 7.628 66.5761 7.76 65.9747C7.87733 65.3734 8.00933 64.7647 8.156 64.1487C8.30267 63.5181 8.47867 62.9021 8.684 62.3007C8.87467 61.6994 9.13867 61.1641 9.476 60.6947C9.81333 60.2107 10.2387 59.8294 10.752 59.5507C11.2653 59.2574 11.9107 59.1107 12.688 59.1107C13.524 59.1107 14.2427 59.3014 14.844 59.6827C15.4307 60.0494 15.9147 60.5261 16.296 61.1127C16.6627 61.6994 16.9267 62.3594 17.088 63.0927C17.264 63.8114 17.352 64.5301 17.352 65.2487C17.352 66.1287 17.242 66.9647 17.022 67.7567C16.802 68.5341 16.472 69.2234 16.032 69.8247C15.5773 70.4114 15.0053 70.8807 14.316 71.2327C13.612 71.5701 12.7833 71.7387 11.83 71.7387V69.7587C12.49 69.7587 13.062 69.6341 13.546 69.3847C14.0153 69.1207 14.404 68.7834 14.712 68.3727C15.02 67.9474 15.2473 67.4561 15.394 66.8987C15.5407 66.3414 15.614 65.7694 15.614 65.1827C15.614 64.7134 15.57 64.2441 15.482 63.7747C15.394 63.2907 15.2473 62.8581 15.042 62.4767C14.822 62.0954 14.5287 61.7874 14.162 61.5527C13.7953 61.3181 13.326 61.2007 12.754 61.2007C12.2113 61.2007 11.7713 61.3474 11.434 61.6407C11.0967 61.9194 10.8253 62.3007 10.62 62.7847C10.4 63.2541 10.224 63.7894 10.092 64.3907C9.96 64.9921 9.828 65.6081 9.696 66.2387C9.54933 66.8547 9.388 67.4634 9.212 68.0647C9.02133 68.6661 8.77933 69.2087 8.486 69.6927C8.178 70.1621 7.78933 70.5434 7.32 70.8367C6.836 71.1154 6.23467 71.2547 5.516 71.2547C4.724 71.2547 4.042 71.0934 3.47 70.7707C2.88333 70.4481 2.40667 70.0227 2.04 69.4947C1.65867 68.9521 1.38 68.3434 1.204 67.6687C1.01333 66.9794 0.918 66.2754 0.918 65.5567C0.918 64.7501 1.01333 64.0021 1.204 63.3127C1.39467 62.6234 1.69533 62.0221 2.106 61.5087C2.51667 60.9807 3.03733 60.5701 3.668 60.2767C4.284 59.9687 5.02467 59.8001 5.89 59.7707V61.7507ZM8.816 54.4811V50.3891C8.83067 49.2011 8.58867 48.3358 8.09 47.7931C7.59133 47.2358 6.87267 46.9571 5.934 46.9571C4.99533 46.9571 4.284 47.2358 3.8 47.7931C3.30133 48.3358 3.052 49.2011 3.052 50.3891V54.4811H8.816ZM1.292 56.5711V49.6851C1.292 48.1011 1.70267 46.9058 2.524 46.0991C3.33067 45.2778 4.46733 44.8671 5.934 44.8671C7.40067 44.8671 8.54467 45.2778 9.366 46.0991C10.1873 46.9058 10.5907 48.1011 10.576 49.6851V54.4811H17V56.5711H1.292ZM9.146 41.0955C9.938 41.0955 10.7227 40.9928 11.5 40.7875C12.2627 40.5822 12.952 40.2595 13.568 39.8195C14.184 39.3795 14.6827 38.8148 15.064 38.1255C15.4307 37.4362 15.614 36.6148 15.614 35.6615C15.614 34.7082 15.4307 33.8868 15.064 33.1975C14.6827 32.5082 14.184 31.9435 13.568 31.5035C12.952 31.0635 12.2627 30.7408 11.5 30.5355C10.7227 30.3302 9.938 30.2275 9.146 30.2275C8.354 30.2275 7.57667 30.3302 6.814 30.5355C6.03667 30.7408 5.34 31.0635 4.724 31.5035C4.108 31.9435 3.61667 32.5082 3.25 33.1975C2.86867 33.8868 2.678 34.7082 2.678 35.6615C2.678 36.6148 2.86867 37.4362 3.25 38.1255C3.61667 38.8148 4.108 39.3795 4.724 39.8195C5.34 40.2595 6.03667 40.5822 6.814 40.7875C7.57667 40.9928 8.354 41.0955 9.146 41.0955ZM9.146 43.1855C8.07533 43.1855 7.04867 43.0315 6.066 42.7235C5.06867 42.4008 4.18867 41.9242 3.426 41.2935C2.66333 40.6628 2.05467 39.8782 1.6 38.9395C1.14533 38.0008 0.918 36.9082 0.918 35.6615C0.918 34.4148 1.14533 33.3222 1.6 32.3835C2.05467 31.4448 2.66333 30.6601 3.426 30.0295C4.18867 29.3988 5.06867 28.9295 6.066 28.6215C7.04867 28.2988 8.07533 28.1375 9.146 28.1375C10.2167 28.1375 11.2507 28.2988 12.248 28.6215C13.2307 28.9295 14.1033 29.3988 14.866 30.0295C15.6287 30.6601 16.2373 31.4448 16.692 32.3835C17.132 33.3222 17.352 34.4148 17.352 35.6615C17.352 36.9082 17.132 38.0008 16.692 38.9395C16.2373 39.8782 15.6287 40.6628 14.866 41.2935C14.1033 41.9242 13.2307 42.4008 12.248 42.7235C11.2507 43.0315 10.2167 43.1855 9.146 43.1855ZM1.292 25.5906V18.1986C1.292 16.7026 1.65867 15.5366 2.392 14.7006C3.12533 13.85 4.13 13.4246 5.406 13.4246C6.35933 13.4246 7.19533 13.6446 7.914 14.0846C8.63267 14.51 9.124 15.1993 9.388 16.1526H9.432C9.52 15.698 9.66667 15.3313 9.872 15.0526C10.0773 14.7593 10.3267 14.532 10.62 14.3706C10.8987 14.1946 11.214 14.07 11.566 13.9966C11.918 13.9086 12.2847 13.8426 12.666 13.7986C13.0473 13.7693 13.436 13.7473 13.832 13.7326C14.228 13.718 14.6167 13.6813 14.998 13.6226C15.3793 13.564 15.746 13.4833 16.098 13.3806C16.4353 13.2633 16.736 13.0946 17 12.8746V15.2066C16.8387 15.3533 16.6187 15.456 16.34 15.5146C16.0613 15.5586 15.7533 15.588 15.416 15.6026C15.064 15.6173 14.69 15.632 14.294 15.6466C13.898 15.6613 13.5093 15.7053 13.128 15.7786C12.7467 15.8373 12.3873 15.9106 12.05 15.9986C11.698 16.0866 11.3973 16.226 11.148 16.4166C10.884 16.6073 10.6787 16.8566 10.532 17.1646C10.3707 17.4726 10.29 17.8833 10.29 18.3966V23.5006H17V25.5906H1.292ZM8.53 19.1446C8.53 18.6606 8.49333 18.1986 8.42 17.7586C8.34667 17.3186 8.20733 16.9373 8.002 16.6146C7.782 16.2773 7.496 16.0133 7.144 15.8226C6.77733 15.6173 6.308 15.5146 5.736 15.5146C4.944 15.5146 4.29867 15.7346 3.8 16.1746C3.30133 16.6146 3.052 17.326 3.052 18.3086V23.5006H8.53V19.1446ZM3.052 7.35281V12.5888H1.292V0.0268122H3.052V5.26281H17V7.35281H3.052Z" fill="#F2F3ED"/>
          </svg>
          </div>

          <div className="button button1">
            <JuceCheckbox
              uncheckedIconPath={expandIcon}
              checkedIconPath={collapseIcon}
              identifier="halfSpeed" title="X2"
              // ... any other checkbox props
            />
          </div>
          <div className="button button2">
            <JuceCheckbox
              iconType="grayed"
              iconPath={freezeIcon}
              identifier="freeze" title="Freeze"
            />
          </div>
        </div>

        <div className="button-container2">
          <div className='button-label-svg'>
          <svg width={`calc(18px * var(--width-scale))`} height={`calc(82px * var(--height-scale))`} viewBox="0 0 18 82" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.816 79.317V75.225C8.83067 74.037 8.58867 73.1717 8.09 72.629C7.59133 72.0717 6.87267 71.793 5.934 71.793C4.99533 71.793 4.284 72.0717 3.8 72.629C3.30133 73.1717 3.052 74.037 3.052 75.225V79.317H8.816ZM1.292 81.407V74.521C1.292 72.937 1.70267 71.7417 2.524 70.935C3.33067 70.1137 4.46733 69.703 5.934 69.703C7.40067 69.703 8.54467 70.1137 9.366 70.935C10.1873 71.7417 10.5907 72.937 10.576 74.521V79.317H17V81.407H1.292ZM1.292 67.1414V59.7494C1.292 58.2534 1.65867 57.0874 2.392 56.2514C3.12533 55.4008 4.13 54.9754 5.406 54.9754C6.35933 54.9754 7.19533 55.1954 7.914 55.6354C8.63267 56.0608 9.124 56.7501 9.388 57.7034H9.432C9.52 57.2488 9.66667 56.8821 9.872 56.6034C10.0773 56.3101 10.3267 56.0828 10.62 55.9214C10.8987 55.7454 11.214 55.6208 11.566 55.5474C11.918 55.4594 12.2847 55.3934 12.666 55.3494C13.0473 55.3201 13.436 55.2981 13.832 55.2834C14.228 55.2688 14.6167 55.2321 14.998 55.1734C15.3793 55.1148 15.746 55.0341 16.098 54.9314C16.4353 54.8141 16.736 54.6454 17 54.4254V56.7574C16.8387 56.9041 16.6187 57.0068 16.34 57.0654C16.0613 57.1094 15.7533 57.1388 15.416 57.1534C15.064 57.1681 14.69 57.1828 14.294 57.1974C13.898 57.2121 13.5093 57.2561 13.128 57.3294C12.7467 57.3881 12.3873 57.4614 12.05 57.5494C11.698 57.6374 11.3973 57.7768 11.148 57.9674C10.884 58.1581 10.6787 58.4074 10.532 58.7154C10.3707 59.0234 10.29 59.4341 10.29 59.9474V65.0514H17V67.1414H1.292ZM8.53 60.6954C8.53 60.2114 8.49333 59.7494 8.42 59.3094C8.34667 58.8694 8.20733 58.4881 8.002 58.1654C7.782 57.8281 7.496 57.5641 7.144 57.3734C6.77733 57.1681 6.308 57.0654 5.736 57.0654C4.944 57.0654 4.29867 57.2854 3.8 57.7254C3.30133 58.1654 3.052 58.8768 3.052 59.8594V65.0514H8.53V60.6954ZM1.292 52.0809L1.292 41.2349H3.052L3.052 49.9909H8.046L8.046 41.8289H9.806L9.806 49.9909H15.24L15.24 41.1689H17V52.0809H1.292ZM5.89 29.5457C4.76067 29.663 3.94667 30.0737 3.448 30.7777C2.93467 31.467 2.678 32.3543 2.678 33.4397C2.678 33.8797 2.722 34.3123 2.81 34.7377C2.898 35.163 3.04467 35.5443 3.25 35.8817C3.45533 36.2043 3.734 36.4683 4.086 36.6737C4.42333 36.8643 4.84867 36.9597 5.362 36.9597C5.846 36.9597 6.242 36.8203 6.55 36.5417C6.84333 36.2483 7.08533 35.867 7.276 35.3977C7.46667 34.9137 7.628 34.371 7.76 33.7697C7.87733 33.1683 8.00933 32.5597 8.156 31.9437C8.30267 31.313 8.47867 30.697 8.684 30.0957C8.87467 29.4943 9.13867 28.959 9.476 28.4897C9.81333 28.0057 10.2387 27.6243 10.752 27.3457C11.2653 27.0523 11.9107 26.9057 12.688 26.9057C13.524 26.9057 14.2427 27.0963 14.844 27.4777C15.4307 27.8443 15.9147 28.321 16.296 28.9077C16.6627 29.4943 16.9267 30.1543 17.088 30.8877C17.264 31.6063 17.352 32.325 17.352 33.0437C17.352 33.9237 17.242 34.7597 17.022 35.5517C16.802 36.329 16.472 37.0183 16.032 37.6197C15.5773 38.2063 15.0053 38.6757 14.316 39.0277C13.612 39.365 12.7833 39.5337 11.83 39.5337V37.5537C12.49 37.5537 13.062 37.429 13.546 37.1797C14.0153 36.9157 14.404 36.5783 14.712 36.1677C15.02 35.7423 15.2473 35.251 15.394 34.6937C15.5407 34.1363 15.614 33.5643 15.614 32.9777C15.614 32.5083 15.57 32.039 15.482 31.5697C15.394 31.0857 15.2473 30.653 15.042 30.2717C14.822 29.8903 14.5287 29.5823 14.162 29.3477C13.7953 29.113 13.326 28.9957 12.754 28.9957C12.2113 28.9957 11.7713 29.1423 11.434 29.4357C11.0967 29.7143 10.8253 30.0957 10.62 30.5797C10.4 31.049 10.224 31.5843 10.092 32.1857C9.96 32.787 9.828 33.403 9.696 34.0337C9.54933 34.6497 9.388 35.2583 9.212 35.8597C9.02133 36.461 8.77933 37.0037 8.486 37.4877C8.178 37.957 7.78933 38.3383 7.32 38.6317C6.836 38.9103 6.23467 39.0497 5.516 39.0497C4.724 39.0497 4.042 38.8883 3.47 38.5657C2.88333 38.243 2.40667 37.8177 2.04 37.2897C1.65867 36.747 1.38 36.1383 1.204 35.4637C1.01333 34.7743 0.918 34.0703 0.918 33.3517C0.918 32.545 1.01333 31.797 1.204 31.1077C1.39467 30.4183 1.69533 29.817 2.106 29.3037C2.51667 28.7757 3.03733 28.365 3.668 28.0717C4.284 27.7637 5.02467 27.595 5.89 27.5657V29.5457ZM1.292 24.366V13.52H3.052V22.276H8.046V14.114H9.806V22.276H15.24V13.454H17V24.366H1.292ZM3.052 7.35281V12.5888H1.292V0.0268122H3.052V5.26281H17V7.35281H3.052Z" fill="#F2F3ED"/>
          </svg>
          </div>
          <div className="button button1">
            <MetalButton 
              iconPath={saveIcon}
              onClick={() => {
                savePreset();
                console.log("Save")
              }}
            />
          </div>
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
      </div>

      <div class="copyright-section">
        <svg width={`calc(92px * var(--width-scale))`} height={`calc(33px * var(--height-scale))`} viewBox="0 0 92 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40.5169 8H39.6069L37.6869 2.83H38.6369L40.0869 7.14H40.1069L41.5169 2.83H42.4069L40.5169 8ZM46.7769 4.92C46.7635 4.72 46.7169 4.53 46.6369 4.35C46.5635 4.17 46.4602 4.01667 46.3269 3.89C46.2002 3.75667 46.0469 3.65333 45.8669 3.58C45.6935 3.5 45.5002 3.46 45.2869 3.46C45.0669 3.46 44.8669 3.5 44.6869 3.58C44.5135 3.65333 44.3635 3.75667 44.2369 3.89C44.1102 4.02333 44.0102 4.18 43.9369 4.36C43.8635 4.53333 43.8202 4.72 43.8069 4.92H46.7769ZM47.5969 6.36C47.4835 6.94 47.2335 7.37667 46.8469 7.67C46.4602 7.96333 45.9735 8.11 45.3869 8.11C44.9735 8.11 44.6135 8.04333 44.3069 7.91C44.0069 7.77667 43.7535 7.59 43.5469 7.35C43.3402 7.11 43.1835 6.82333 43.0769 6.49C42.9769 6.15667 42.9202 5.79333 42.9069 5.4C42.9069 5.00667 42.9669 4.64667 43.0869 4.32C43.2069 3.99333 43.3735 3.71 43.5869 3.47C43.8069 3.23 44.0635 3.04333 44.3569 2.91C44.6569 2.77667 44.9835 2.71 45.3369 2.71C45.7969 2.71 46.1769 2.80667 46.4769 3C46.7835 3.18667 47.0269 3.42667 47.2069 3.72C47.3935 4.01333 47.5202 4.33333 47.5869 4.68C47.6602 5.02667 47.6902 5.35667 47.6769 5.67H43.8069C43.8002 5.89667 43.8269 6.11333 43.8869 6.32C43.9469 6.52 44.0435 6.7 44.1769 6.86C44.3102 7.01333 44.4802 7.13667 44.6869 7.23C44.8935 7.32333 45.1369 7.37 45.4169 7.37C45.7769 7.37 46.0702 7.28667 46.2969 7.12C46.5302 6.95333 46.6835 6.7 46.7569 6.36H47.5969ZM48.528 2.83H49.328V3.92H49.348C49.5546 3.5 49.808 3.19 50.108 2.99C50.408 2.79 50.788 2.69667 51.248 2.71V3.61C50.908 3.61 50.618 3.65667 50.378 3.75C50.138 3.84333 49.9446 3.98 49.798 4.16C49.6513 4.34 49.5446 4.56 49.478 4.82C49.4113 5.07333 49.378 5.36667 49.378 5.7V8H48.528V2.83ZM52.408 6.37C52.4147 6.55667 52.458 6.71667 52.538 6.85C52.618 6.97667 52.7214 7.08 52.848 7.16C52.9814 7.23333 53.128 7.28667 53.288 7.32C53.4547 7.35333 53.6247 7.37 53.798 7.37C53.9314 7.37 54.0714 7.36 54.218 7.34C54.3647 7.32 54.498 7.28333 54.618 7.23C54.7447 7.17667 54.848 7.1 54.928 7C55.008 6.89333 55.048 6.76 55.048 6.6C55.048 6.38 54.9647 6.21333 54.798 6.1C54.6314 5.98667 54.4214 5.89667 54.168 5.83C53.9214 5.75667 53.6514 5.69333 53.358 5.64C53.0647 5.58 52.7914 5.5 52.538 5.4C52.2914 5.29333 52.0847 5.14667 51.918 4.96C51.7514 4.77333 51.668 4.51333 51.668 4.18C51.668 3.92 51.7247 3.69667 51.838 3.51C51.958 3.32333 52.108 3.17333 52.288 3.06C52.4747 2.94 52.6814 2.85333 52.908 2.8C53.1414 2.74 53.3714 2.71 53.598 2.71C53.8914 2.71 54.1614 2.73667 54.408 2.79C54.6547 2.83667 54.8714 2.92333 55.058 3.05C55.2514 3.17 55.4047 3.33667 55.518 3.55C55.6314 3.75667 55.698 4.01667 55.718 4.33H54.868C54.8547 4.16333 54.8114 4.02667 54.738 3.92C54.6647 3.80667 54.5714 3.71667 54.458 3.65C54.3447 3.58333 54.218 3.53667 54.078 3.51C53.9447 3.47667 53.808 3.46 53.668 3.46C53.5414 3.46 53.4114 3.47 53.278 3.49C53.1514 3.51 53.0347 3.54667 52.928 3.6C52.8214 3.64667 52.7347 3.71333 52.668 3.8C52.6014 3.88 52.568 3.98667 52.568 4.12C52.568 4.26667 52.618 4.39 52.718 4.49C52.8247 4.58333 52.958 4.66333 53.118 4.73C53.278 4.79 53.458 4.84333 53.658 4.89C53.858 4.93 54.058 4.97333 54.258 5.02C54.4714 5.06667 54.678 5.12333 54.878 5.19C55.0847 5.25667 55.2647 5.34667 55.418 5.46C55.578 5.56667 55.7047 5.70333 55.798 5.87C55.898 6.03667 55.948 6.24333 55.948 6.49C55.948 6.80333 55.8814 7.06333 55.748 7.27C55.6214 7.47667 55.4514 7.64333 55.238 7.77C55.0314 7.89667 54.7947 7.98333 54.528 8.03C54.268 8.08333 54.008 8.11 53.748 8.11C53.4614 8.11 53.188 8.08 52.928 8.02C52.668 7.96 52.438 7.86333 52.238 7.73C52.038 7.59 51.878 7.41 51.758 7.19C51.638 6.96333 51.5714 6.69 51.558 6.37H52.408ZM57.788 1.9H56.938V0.86H57.788V1.9ZM56.938 2.83H57.788V8H56.938V2.83ZM59.7248 5.42C59.7248 5.73333 59.7648 6.01333 59.8448 6.26C59.9315 6.5 60.0482 6.70333 60.1948 6.87C60.3415 7.03 60.5115 7.15333 60.7048 7.24C60.9048 7.32667 61.1148 7.37 61.3348 7.37C61.5548 7.37 61.7615 7.32667 61.9548 7.24C62.1548 7.15333 62.3282 7.03 62.4748 6.87C62.6215 6.70333 62.7348 6.5 62.8148 6.26C62.9015 6.01333 62.9448 5.73333 62.9448 5.42C62.9448 5.10667 62.9015 4.83 62.8148 4.59C62.7348 4.34333 62.6215 4.13667 62.4748 3.97C62.3282 3.80333 62.1548 3.67667 61.9548 3.59C61.7615 3.50333 61.5548 3.46 61.3348 3.46C61.1148 3.46 60.9048 3.50333 60.7048 3.59C60.5115 3.67667 60.3415 3.80333 60.1948 3.97C60.0482 4.13667 59.9315 4.34333 59.8448 4.59C59.7648 4.83 59.7248 5.10667 59.7248 5.42ZM58.8248 5.42C58.8248 5.04 58.8782 4.68667 58.9848 4.36C59.0915 4.02667 59.2515 3.74 59.4648 3.5C59.6782 3.25333 59.9415 3.06 60.2548 2.92C60.5682 2.78 60.9282 2.71 61.3348 2.71C61.7482 2.71 62.1082 2.78 62.4148 2.92C62.7282 3.06 62.9915 3.25333 63.2048 3.5C63.4182 3.74 63.5782 4.02667 63.6848 4.36C63.7915 4.68667 63.8448 5.04 63.8448 5.42C63.8448 5.8 63.7915 6.15333 63.6848 6.48C63.5782 6.80667 63.4182 7.09333 63.2048 7.34C62.9915 7.58 62.7282 7.77 62.4148 7.91C62.1082 8.04333 61.7482 8.11 61.3348 8.11C60.9282 8.11 60.5682 8.04333 60.2548 7.91C59.9415 7.77 59.6782 7.58 59.4648 7.34C59.2515 7.09333 59.0915 6.80667 58.9848 6.48C58.8782 6.15333 58.8248 5.8 58.8248 5.42ZM64.847 2.83H65.647V3.65H65.667C66.0204 3.02333 66.5804 2.71 67.347 2.71C67.687 2.71 67.9704 2.75667 68.197 2.85C68.4237 2.94333 68.607 3.07333 68.747 3.24C68.887 3.40667 68.9837 3.60667 69.037 3.84C69.097 4.06667 69.127 4.32 69.127 4.6V8H68.277V4.5C68.277 4.18 68.1837 3.92667 67.997 3.74C67.8104 3.55333 67.5537 3.46 67.227 3.46C66.967 3.46 66.7404 3.5 66.547 3.58C66.3604 3.66 66.2037 3.77333 66.077 3.92C65.9504 4.06667 65.8537 4.24 65.787 4.44C65.727 4.63333 65.697 4.84667 65.697 5.08V8H64.847V2.83ZM73.8669 4.51C73.8669 4.77667 73.8735 5.07667 73.8869 5.41C73.9069 5.73667 73.9602 6.04667 74.0469 6.34C74.1402 6.62667 74.2869 6.87 74.4869 7.07C74.6869 7.27 74.9669 7.37 75.3269 7.37C75.6869 7.37 75.9669 7.27 76.1669 7.07C76.3669 6.87 76.5102 6.62667 76.5969 6.34C76.6902 6.04667 76.7435 5.73667 76.7569 5.41C76.7769 5.07667 76.7869 4.77667 76.7869 4.51C76.7869 4.33667 76.7835 4.14667 76.7769 3.94C76.7769 3.72667 76.7602 3.51667 76.7269 3.31C76.7002 3.09667 76.6569 2.89 76.5969 2.69C76.5435 2.49 76.4602 2.31667 76.3469 2.17C76.2402 2.01667 76.1035 1.89333 75.9369 1.8C75.7702 1.70667 75.5669 1.66 75.3269 1.66C75.0869 1.66 74.8835 1.70667 74.7169 1.8C74.5502 1.89333 74.4102 2.01667 74.2969 2.17C74.1902 2.31667 74.1069 2.49 74.0469 2.69C73.9935 2.89 73.9502 3.09667 73.9169 3.31C73.8902 3.51667 73.8735 3.72667 73.8669 3.94C73.8669 4.14667 73.8669 4.33667 73.8669 4.51ZM72.9669 4.52C72.9669 4.26 72.9735 3.99 72.9869 3.71C73.0002 3.43 73.0335 3.15667 73.0869 2.89C73.1402 2.62333 73.2169 2.37 73.3169 2.13C73.4169 1.89 73.5535 1.68 73.7269 1.5C73.9002 1.32 74.1169 1.17667 74.3769 1.07C74.6435 0.963333 74.9602 0.909999 75.3269 0.909999C75.6935 0.909999 76.0069 0.963333 76.2669 1.07C76.5335 1.17667 76.7535 1.32 76.9269 1.5C77.1002 1.68 77.2369 1.89 77.3369 2.13C77.4369 2.37 77.5135 2.62333 77.5669 2.89C77.6202 3.15667 77.6535 3.43 77.6669 3.71C77.6802 3.99 77.6869 4.26 77.6869 4.52C77.6869 4.78 77.6802 5.05 77.6669 5.33C77.6535 5.61 77.6202 5.88333 77.5669 6.15C77.5135 6.41667 77.4369 6.67 77.3369 6.91C77.2369 7.14333 77.1002 7.35 76.9269 7.53C76.7535 7.71 76.5369 7.85333 76.2769 7.96C76.0169 8.06 75.7002 8.11 75.3269 8.11C74.9602 8.11 74.6435 8.06 74.3769 7.96C74.1169 7.85333 73.9002 7.71 73.7269 7.53C73.5535 7.35 73.4169 7.14333 73.3169 6.91C73.2169 6.67 73.1402 6.41667 73.0869 6.15C73.0335 5.88333 73.0002 5.61 72.9869 5.33C72.9735 5.05 72.9669 4.78 72.9669 4.52ZM78.9335 6.89H80.0435V8H78.9335V6.89ZM82.2067 4.51C82.2067 4.77667 82.2134 5.07667 82.2267 5.41C82.2467 5.73667 82.3001 6.04667 82.3867 6.34C82.4801 6.62667 82.6267 6.87 82.8267 7.07C83.0267 7.27 83.3067 7.37 83.6667 7.37C84.0267 7.37 84.3067 7.27 84.5067 7.07C84.7067 6.87 84.8501 6.62667 84.9367 6.34C85.0301 6.04667 85.0834 5.73667 85.0967 5.41C85.1167 5.07667 85.1267 4.77667 85.1267 4.51C85.1267 4.33667 85.1234 4.14667 85.1167 3.94C85.1167 3.72667 85.1001 3.51667 85.0667 3.31C85.0401 3.09667 84.9967 2.89 84.9367 2.69C84.8834 2.49 84.8001 2.31667 84.6867 2.17C84.5801 2.01667 84.4434 1.89333 84.2767 1.8C84.1101 1.70667 83.9067 1.66 83.6667 1.66C83.4267 1.66 83.2234 1.70667 83.0567 1.8C82.8901 1.89333 82.7501 2.01667 82.6367 2.17C82.5301 2.31667 82.4467 2.49 82.3867 2.69C82.3334 2.89 82.2901 3.09667 82.2567 3.31C82.2301 3.51667 82.2134 3.72667 82.2067 3.94C82.2067 4.14667 82.2067 4.33667 82.2067 4.51ZM81.3067 4.52C81.3067 4.26 81.3134 3.99 81.3267 3.71C81.3401 3.43 81.3734 3.15667 81.4267 2.89C81.4801 2.62333 81.5567 2.37 81.6567 2.13C81.7567 1.89 81.8934 1.68 82.0667 1.5C82.2401 1.32 82.4567 1.17667 82.7167 1.07C82.9834 0.963333 83.3001 0.909999 83.6667 0.909999C84.0334 0.909999 84.3467 0.963333 84.6067 1.07C84.8734 1.17667 85.0934 1.32 85.2667 1.5C85.4401 1.68 85.5767 1.89 85.6767 2.13C85.7767 2.37 85.8534 2.62333 85.9067 2.89C85.9601 3.15667 85.9934 3.43 86.0067 3.71C86.0201 3.99 86.0267 4.26 86.0267 4.52C86.0267 4.78 86.0201 5.05 86.0067 5.33C85.9934 5.61 85.9601 5.88333 85.9067 6.15C85.8534 6.41667 85.7767 6.67 85.6767 6.91C85.5767 7.14333 85.4401 7.35 85.2667 7.53C85.0934 7.71 84.8767 7.85333 84.6167 7.96C84.3567 8.06 84.0401 8.11 83.6667 8.11C83.3001 8.11 82.9834 8.06 82.7167 7.96C82.4567 7.85333 82.2401 7.71 82.0667 7.53C81.8934 7.35 81.7567 7.14333 81.6567 6.91C81.5567 6.67 81.4801 6.41667 81.4267 6.15C81.3734 5.88333 81.3401 5.61 81.3267 5.33C81.3134 5.05 81.3067 4.78 81.3067 4.52ZM90.0034 8H89.1534V2.92H87.3134V2.24C87.5534 2.24 87.7867 2.22333 88.0134 2.19C88.24 2.15 88.4434 2.08 88.6234 1.98C88.81 1.88 88.9667 1.74333 89.0934 1.57C89.22 1.39667 89.3067 1.17667 89.3534 0.909999H90.0034V8ZM27.4289 15.01C27.3222 14.5033 27.0856 14.1233 26.7189 13.87C26.3589 13.6167 25.9289 13.49 25.4289 13.49C25.0022 13.49 24.6356 13.57 24.3289 13.73C24.0289 13.89 23.7789 14.1067 23.5789 14.38C23.3856 14.6467 23.2422 14.9533 23.1489 15.3C23.0556 15.6467 23.0089 16.0067 23.0089 16.38C23.0089 16.7867 23.0556 17.1733 23.1489 17.54C23.2422 17.9 23.3856 18.2167 23.5789 18.49C23.7789 18.7567 24.0322 18.97 24.3389 19.13C24.6456 19.29 25.0122 19.37 25.4389 19.37C25.7522 19.37 26.0289 19.32 26.2689 19.22C26.5156 19.1133 26.7256 18.97 26.8989 18.79C27.0789 18.6033 27.2189 18.3833 27.3189 18.13C27.4189 17.8767 27.4789 17.6033 27.4989 17.31H28.4489C28.3556 18.21 28.0456 18.91 27.5189 19.41C26.9922 19.91 26.2722 20.16 25.3589 20.16C24.8056 20.16 24.3222 20.0667 23.9089 19.88C23.4956 19.6867 23.1522 19.4233 22.8789 19.09C22.6056 18.7567 22.3989 18.3633 22.2589 17.91C22.1256 17.4567 22.0589 16.97 22.0589 16.45C22.0589 15.93 22.1322 15.4433 22.2789 14.99C22.4256 14.53 22.6389 14.13 22.9189 13.79C23.2056 13.45 23.5589 13.1833 23.9789 12.99C24.4056 12.79 24.8922 12.69 25.4389 12.69C25.8122 12.69 26.1656 12.74 26.4989 12.84C26.8322 12.94 27.1289 13.0867 27.3889 13.28C27.6489 13.4733 27.8656 13.7167 28.0389 14.01C28.2122 14.2967 28.3256 14.63 28.3789 15.01H27.4289ZM30.3857 13.9H29.5357V12.86H30.3857V13.9ZM29.5357 14.83H30.3857V20H29.5357V14.83ZM31.7525 12.86H32.6025V20H31.7525V12.86ZM33.9693 12.86H34.8193V20H33.9693V12.86ZM37.0361 13.9H36.1861V12.86H37.0361V13.9ZM36.1861 14.83H37.0361V20H36.1861V14.83ZM41.8629 16.49C41.7962 16.1633 41.6562 15.91 41.4429 15.73C41.2296 15.55 40.9429 15.46 40.5829 15.46C40.2762 15.46 40.0196 15.5167 39.8129 15.63C39.6062 15.7433 39.4396 15.8933 39.3129 16.08C39.1929 16.2667 39.1062 16.4833 39.0529 16.73C38.9996 16.97 38.9729 17.22 38.9729 17.48C38.9729 17.72 38.9996 17.9533 39.0529 18.18C39.1129 18.4067 39.2029 18.61 39.3229 18.79C39.4429 18.9633 39.5996 19.1033 39.7929 19.21C39.9862 19.3167 40.2162 19.37 40.4829 19.37C40.9029 19.37 41.2296 19.26 41.4629 19.04C41.7029 18.82 41.8496 18.51 41.9029 18.11H42.7729C42.6796 18.75 42.4396 19.2433 42.0529 19.59C41.6729 19.9367 41.1529 20.11 40.4929 20.11C40.0996 20.11 39.7496 20.0467 39.4429 19.92C39.1429 19.7933 38.8896 19.6133 38.6829 19.38C38.4829 19.1467 38.3296 18.87 38.2229 18.55C38.1229 18.2233 38.0729 17.8667 38.0729 17.48C38.0729 17.0933 38.1229 16.7333 38.2229 16.4C38.3229 16.06 38.4729 15.7667 38.6729 15.52C38.8796 15.2667 39.1362 15.07 39.4429 14.93C39.7496 14.7833 40.1062 14.71 40.5129 14.71C40.8062 14.71 41.0796 14.7467 41.3329 14.82C41.5929 14.8867 41.8196 14.9933 42.0129 15.14C42.2129 15.2867 42.3762 15.4733 42.5029 15.7C42.6296 15.92 42.7096 16.1833 42.7429 16.49H41.8629ZM47.8772 17.05H50.2972L49.1072 13.72H49.0872L47.8772 17.05ZM48.5872 12.86H49.6372L52.4272 20H51.3772L50.5972 17.85H47.5772L46.7772 20H45.8072L48.5872 12.86ZM57.2716 20H56.4716V19.18H56.4516C56.2716 19.5 56.0416 19.7367 55.7616 19.89C55.4816 20.0367 55.1516 20.11 54.7716 20.11C54.4316 20.11 54.1482 20.0667 53.9216 19.98C53.6949 19.8867 53.5116 19.7567 53.3716 19.59C53.2316 19.4233 53.1316 19.2267 53.0716 19C53.0182 18.7667 52.9916 18.51 52.9916 18.23V14.83H53.8416V18.33C53.8416 18.65 53.9349 18.9033 54.1216 19.09C54.3082 19.2767 54.5649 19.37 54.8916 19.37C55.1516 19.37 55.3749 19.33 55.5616 19.25C55.7549 19.17 55.9149 19.0567 56.0416 18.91C56.1682 18.7633 56.2616 18.5933 56.3216 18.4C56.3882 18.2 56.4216 17.9833 56.4216 17.75V14.83H57.2716V20ZM59.1682 17.46C59.1682 17.7 59.1982 17.9367 59.2582 18.17C59.3249 18.3967 59.4215 18.6 59.5482 18.78C59.6815 18.96 59.8482 19.1033 60.0482 19.21C60.2549 19.3167 60.4949 19.37 60.7682 19.37C61.0549 19.37 61.2982 19.3133 61.4982 19.2C61.6982 19.0867 61.8615 18.94 61.9882 18.76C62.1149 18.5733 62.2049 18.3633 62.2582 18.13C62.3182 17.8967 62.3482 17.66 62.3482 17.42C62.3482 17.1667 62.3182 16.9233 62.2582 16.69C62.1982 16.45 62.1015 16.24 61.9682 16.06C61.8415 15.88 61.6749 15.7367 61.4682 15.63C61.2615 15.5167 61.0115 15.46 60.7182 15.46C60.4315 15.46 60.1882 15.5167 59.9882 15.63C59.7882 15.7433 59.6282 15.8933 59.5082 16.08C59.3882 16.2667 59.3015 16.48 59.2482 16.72C59.1949 16.96 59.1682 17.2067 59.1682 17.46ZM63.1682 20H62.3182V19.3H62.2982C62.1582 19.5867 61.9382 19.7933 61.6382 19.92C61.3382 20.0467 61.0082 20.11 60.6482 20.11C60.2482 20.11 59.8982 20.0367 59.5982 19.89C59.3049 19.7433 59.0582 19.5467 58.8582 19.3C58.6649 19.0533 58.5182 18.7667 58.4182 18.44C58.3182 18.1133 58.2682 17.7667 58.2682 17.4C58.2682 17.0333 58.3149 16.6867 58.4082 16.36C58.5082 16.0333 58.6549 15.75 58.8482 15.51C59.0482 15.2633 59.2949 15.07 59.5882 14.93C59.8882 14.7833 60.2349 14.71 60.6282 14.71C60.7615 14.71 60.9049 14.7233 61.0582 14.75C61.2115 14.7767 61.3649 14.8233 61.5182 14.89C61.6715 14.95 61.8149 15.0333 61.9482 15.14C62.0882 15.24 62.2049 15.3667 62.2982 15.52H62.3182V12.86H63.1682V20ZM65.3759 13.9H64.5259V12.86H65.3759V13.9ZM64.5259 14.83H65.3759V20H64.5259V14.83ZM67.3127 17.42C67.3127 17.7333 67.3527 18.0133 67.4327 18.26C67.5194 18.5 67.6361 18.7033 67.7827 18.87C67.9294 19.03 68.0994 19.1533 68.2927 19.24C68.4927 19.3267 68.7027 19.37 68.9227 19.37C69.1427 19.37 69.3494 19.3267 69.5427 19.24C69.7427 19.1533 69.9161 19.03 70.0627 18.87C70.2094 18.7033 70.3227 18.5 70.4027 18.26C70.4894 18.0133 70.5327 17.7333 70.5327 17.42C70.5327 17.1067 70.4894 16.83 70.4027 16.59C70.3227 16.3433 70.2094 16.1367 70.0627 15.97C69.9161 15.8033 69.7427 15.6767 69.5427 15.59C69.3494 15.5033 69.1427 15.46 68.9227 15.46C68.7027 15.46 68.4927 15.5033 68.2927 15.59C68.0994 15.6767 67.9294 15.8033 67.7827 15.97C67.6361 16.1367 67.5194 16.3433 67.4327 16.59C67.3527 16.83 67.3127 17.1067 67.3127 17.42ZM66.4127 17.42C66.4127 17.04 66.4661 16.6867 66.5727 16.36C66.6794 16.0267 66.8394 15.74 67.0527 15.5C67.2661 15.2533 67.5294 15.06 67.8427 14.92C68.1561 14.78 68.5161 14.71 68.9227 14.71C69.3361 14.71 69.6961 14.78 70.0027 14.92C70.3161 15.06 70.5794 15.2533 70.7927 15.5C71.0061 15.74 71.1661 16.0267 71.2727 16.36C71.3794 16.6867 71.4327 17.04 71.4327 17.42C71.4327 17.8 71.3794 18.1533 71.2727 18.48C71.1661 18.8067 71.0061 19.0933 70.7927 19.34C70.5794 19.58 70.3161 19.77 70.0027 19.91C69.6961 20.0433 69.3361 20.11 68.9227 20.11C68.5161 20.11 68.1561 20.0433 67.8427 19.91C67.5294 19.77 67.2661 19.58 67.0527 19.34C66.8394 19.0933 66.6794 18.8067 66.5727 18.48C66.4661 18.1533 66.4127 17.8 66.4127 17.42ZM75.3581 12.86H76.3081V19.2H80.0881V20H75.3581V12.86ZM81.9548 14.83H82.9848V15.58H81.9548V18.79C81.9548 18.89 81.9614 18.97 81.9748 19.03C81.9948 19.09 82.0281 19.1367 82.0748 19.17C82.1214 19.2033 82.1848 19.2267 82.2648 19.24C82.3514 19.2467 82.4614 19.25 82.5948 19.25H82.9848V20H82.3348C82.1148 20 81.9248 19.9867 81.7648 19.96C81.6114 19.9267 81.4848 19.87 81.3848 19.79C81.2914 19.71 81.2214 19.5967 81.1748 19.45C81.1281 19.3033 81.1048 19.11 81.1048 18.87V15.58H80.2248V14.83H81.1048V13.28H81.9548V14.83ZM84.5491 17.46C84.5491 17.7 84.5791 17.9367 84.6391 18.17C84.7057 18.3967 84.8024 18.6 84.9291 18.78C85.0624 18.96 85.2291 19.1033 85.4291 19.21C85.6357 19.3167 85.8757 19.37 86.1491 19.37C86.4357 19.37 86.6791 19.3133 86.8791 19.2C87.0791 19.0867 87.2424 18.94 87.3691 18.76C87.4957 18.5733 87.5857 18.3633 87.6391 18.13C87.6991 17.8967 87.7291 17.66 87.7291 17.42C87.7291 17.1667 87.6991 16.9233 87.6391 16.69C87.5791 16.45 87.4824 16.24 87.3491 16.06C87.2224 15.88 87.0557 15.7367 86.8491 15.63C86.6424 15.5167 86.3924 15.46 86.0991 15.46C85.8124 15.46 85.5691 15.5167 85.3691 15.63C85.1691 15.7433 85.0091 15.8933 84.8891 16.08C84.7691 16.2667 84.6824 16.48 84.6291 16.72C84.5757 16.96 84.5491 17.2067 84.5491 17.46ZM88.5491 20H87.6991V19.3H87.6791C87.5391 19.5867 87.3191 19.7933 87.0191 19.92C86.7191 20.0467 86.3891 20.11 86.0291 20.11C85.6291 20.11 85.2791 20.0367 84.9791 19.89C84.6857 19.7433 84.4391 19.5467 84.2391 19.3C84.0457 19.0533 83.8991 18.7667 83.7991 18.44C83.6991 18.1133 83.6491 17.7667 83.6491 17.4C83.6491 17.0333 83.6957 16.6867 83.7891 16.36C83.8891 16.0333 84.0357 15.75 84.2291 15.51C84.4291 15.2633 84.6757 15.07 84.9691 14.93C85.2691 14.7833 85.6157 14.71 86.0091 14.71C86.1424 14.71 86.2857 14.7233 86.4391 14.75C86.5924 14.7767 86.7457 14.8233 86.8991 14.89C87.0524 14.95 87.1957 15.0333 87.3291 15.14C87.4691 15.24 87.5857 15.3667 87.6791 15.52H87.6991V12.86H88.5491V20ZM90.0468 18.89H91.1568V20H90.0468V18.89ZM5.94359 32H5.04359L3.99359 27.89H3.97359L2.93359 32H2.01359L0.353594 26.83H1.29359L2.46359 31.06H2.48359L3.52359 26.83H4.45359L5.53359 31.06H5.55359L6.71359 26.83H7.59359L5.94359 32ZM13.5217 32H12.6217L11.5717 27.89H11.5517L10.5117 32H9.59172L7.93172 26.83H8.87172L10.0417 31.06H10.0617L11.1017 26.83H12.0317L13.1117 31.06H13.1317L14.2917 26.83H15.1717L13.5217 32ZM21.0998 32H20.1998L19.1498 27.89H19.1298L18.0898 32H17.1698L15.5098 26.83H16.4498L17.6198 31.06H17.6398L18.6798 26.83H19.6098L20.6898 31.06H20.7098L21.8698 26.83H22.7498L21.0998 32ZM23.2011 30.89H24.3111V32H23.2011V30.89ZM29.3043 28.49C29.2376 28.1633 29.0976 27.91 28.8843 27.73C28.671 27.55 28.3843 27.46 28.0243 27.46C27.7176 27.46 27.461 27.5167 27.2543 27.63C27.0476 27.7433 26.881 27.8933 26.7543 28.08C26.6343 28.2667 26.5476 28.4833 26.4943 28.73C26.441 28.97 26.4143 29.22 26.4143 29.48C26.4143 29.72 26.441 29.9533 26.4943 30.18C26.5543 30.4067 26.6443 30.61 26.7643 30.79C26.8843 30.9633 27.041 31.1033 27.2343 31.21C27.4276 31.3167 27.6576 31.37 27.9243 31.37C28.3443 31.37 28.671 31.26 28.9043 31.04C29.1443 30.82 29.291 30.51 29.3443 30.11H30.2143C30.121 30.75 29.881 31.2433 29.4943 31.59C29.1143 31.9367 28.5943 32.11 27.9343 32.11C27.541 32.11 27.191 32.0467 26.8843 31.92C26.5843 31.7933 26.331 31.6133 26.1243 31.38C25.9243 31.1467 25.771 30.87 25.6643 30.55C25.5643 30.2233 25.5143 29.8667 25.5143 29.48C25.5143 29.0933 25.5643 28.7333 25.6643 28.4C25.7643 28.06 25.9143 27.7667 26.1143 27.52C26.321 27.2667 26.5776 27.07 26.8843 26.93C27.191 26.7833 27.5476 26.71 27.9543 26.71C28.2476 26.71 28.521 26.7467 28.7743 26.82C29.0343 26.8867 29.261 26.9933 29.4543 27.14C29.6543 27.2867 29.8176 27.4733 29.9443 27.7C30.071 27.92 30.151 28.1833 30.1843 28.49H29.3043ZM32.0654 25.9H31.2154V24.86H32.0654V25.9ZM31.2154 26.83H32.0654V32H31.2154V26.83ZM33.4322 24.86H34.2822V32H33.4322V24.86ZM35.649 24.86H36.499V32H35.649V24.86ZM38.7158 25.9H37.8658V24.86H38.7158V25.9ZM37.8658 26.83H38.7158V32H37.8658V26.83ZM43.5426 28.49C43.4759 28.1633 43.3359 27.91 43.1226 27.73C42.9092 27.55 42.6226 27.46 42.2626 27.46C41.9559 27.46 41.6992 27.5167 41.4926 27.63C41.2859 27.7433 41.1192 27.8933 40.9926 28.08C40.8726 28.2667 40.7859 28.4833 40.7326 28.73C40.6792 28.97 40.6526 29.22 40.6526 29.48C40.6526 29.72 40.6792 29.9533 40.7326 30.18C40.7926 30.4067 40.8826 30.61 41.0026 30.79C41.1226 30.9633 41.2792 31.1033 41.4726 31.21C41.6659 31.3167 41.8959 31.37 42.1626 31.37C42.5826 31.37 42.9092 31.26 43.1426 31.04C43.3826 30.82 43.5292 30.51 43.5826 30.11H44.4526C44.3592 30.75 44.1192 31.2433 43.7326 31.59C43.3526 31.9367 42.8326 32.11 42.1726 32.11C41.7792 32.11 41.4292 32.0467 41.1226 31.92C40.8226 31.7933 40.5692 31.6133 40.3626 31.38C40.1626 31.1467 40.0092 30.87 39.9026 30.55C39.8026 30.2233 39.7526 29.8667 39.7526 29.48C39.7526 29.0933 39.8026 28.7333 39.9026 28.4C40.0026 28.06 40.1526 27.7667 40.3526 27.52C40.5592 27.2667 40.8159 27.07 41.1226 26.93C41.4292 26.7833 41.7859 26.71 42.1926 26.71C42.4859 26.71 42.7592 26.7467 43.0126 26.82C43.2726 26.8867 43.4992 26.9933 43.6926 27.14C43.8926 27.2867 44.0559 27.4733 44.1826 27.7C44.3092 27.92 44.3892 28.1833 44.4226 28.49H43.5426ZM49.9837 31.98C49.837 32.0667 49.6337 32.11 49.3737 32.11C49.1537 32.11 48.977 32.05 48.8437 31.93C48.717 31.8033 48.6537 31.6 48.6537 31.32C48.4203 31.6 48.147 31.8033 47.8337 31.93C47.527 32.05 47.1937 32.11 46.8337 32.11C46.6003 32.11 46.377 32.0833 46.1637 32.03C45.957 31.9767 45.777 31.8933 45.6237 31.78C45.4703 31.6667 45.347 31.52 45.2537 31.34C45.167 31.1533 45.1237 30.93 45.1237 30.67C45.1237 30.3767 45.1737 30.1367 45.2737 29.95C45.3737 29.7633 45.5037 29.6133 45.6637 29.5C45.8303 29.38 46.017 29.29 46.2237 29.23C46.437 29.17 46.6537 29.12 46.8737 29.08C47.107 29.0333 47.327 29 47.5337 28.98C47.747 28.9533 47.9337 28.92 48.0937 28.88C48.2537 28.8333 48.3803 28.77 48.4737 28.69C48.567 28.6033 48.6137 28.48 48.6137 28.32C48.6137 28.1333 48.577 27.9833 48.5037 27.87C48.437 27.7567 48.347 27.67 48.2337 27.61C48.127 27.55 48.0037 27.51 47.8637 27.49C47.7303 27.47 47.597 27.46 47.4637 27.46C47.1037 27.46 46.8037 27.53 46.5637 27.67C46.3237 27.8033 46.1937 28.06 46.1737 28.44H45.3237C45.337 28.12 45.4037 27.85 45.5237 27.63C45.6437 27.41 45.8037 27.2333 46.0037 27.1C46.2037 26.96 46.4303 26.86 46.6837 26.8C46.9437 26.74 47.2203 26.71 47.5137 26.71C47.747 26.71 47.977 26.7267 48.2037 26.76C48.437 26.7933 48.647 26.8633 48.8337 26.97C49.0203 27.07 49.1703 27.2133 49.2837 27.4C49.397 27.5867 49.4537 27.83 49.4537 28.13V30.79C49.4537 30.99 49.4637 31.1367 49.4837 31.23C49.5103 31.3233 49.5903 31.37 49.7237 31.37C49.797 31.37 49.8837 31.3533 49.9837 31.32V31.98ZM48.6037 29.33C48.497 29.41 48.357 29.47 48.1837 29.51C48.0103 29.5433 47.827 29.5733 47.6337 29.6C47.447 29.62 47.257 29.6467 47.0637 29.68C46.8703 29.7067 46.697 29.7533 46.5437 29.82C46.3903 29.8867 46.2637 29.9833 46.1637 30.11C46.0703 30.23 46.0237 30.3967 46.0237 30.61C46.0237 30.75 46.0503 30.87 46.1037 30.97C46.1637 31.0633 46.237 31.14 46.3237 31.2C46.417 31.26 46.5237 31.3033 46.6437 31.33C46.7637 31.3567 46.8903 31.37 47.0237 31.37C47.3037 31.37 47.5437 31.3333 47.7437 31.26C47.9437 31.18 48.107 31.0833 48.2337 30.97C48.3603 30.85 48.4537 30.7233 48.5137 30.59C48.5737 30.45 48.6037 30.32 48.6037 30.2V29.33ZM55.0548 32H54.2548V31.18H54.2348C54.0548 31.5 53.8248 31.7367 53.5448 31.89C53.2648 32.0367 52.9348 32.11 52.5548 32.11C52.2148 32.11 51.9314 32.0667 51.7048 31.98C51.4781 31.8867 51.2948 31.7567 51.1548 31.59C51.0148 31.4233 50.9148 31.2267 50.8548 31C50.8014 30.7667 50.7748 30.51 50.7748 30.23V26.83H51.6248V30.33C51.6248 30.65 51.7181 30.9033 51.9048 31.09C52.0914 31.2767 52.3481 31.37 52.6748 31.37C52.9348 31.37 53.1581 31.33 53.3448 31.25C53.5381 31.17 53.6981 31.0567 53.8248 30.91C53.9514 30.7633 54.0448 30.5933 54.1048 30.4C54.1714 30.2 54.2048 29.9833 54.2048 29.75V26.83H55.0548V32ZM56.9514 29.46C56.9514 29.7 56.9814 29.9367 57.0414 30.17C57.1081 30.3967 57.2047 30.6 57.3314 30.78C57.4647 30.96 57.6314 31.1033 57.8314 31.21C58.0381 31.3167 58.2781 31.37 58.5514 31.37C58.8381 31.37 59.0814 31.3133 59.2814 31.2C59.4814 31.0867 59.6447 30.94 59.7714 30.76C59.8981 30.5733 59.9881 30.3633 60.0414 30.13C60.1014 29.8967 60.1314 29.66 60.1314 29.42C60.1314 29.1667 60.1014 28.9233 60.0414 28.69C59.9814 28.45 59.8847 28.24 59.7514 28.06C59.6247 27.88 59.4581 27.7367 59.2514 27.63C59.0447 27.5167 58.7947 27.46 58.5014 27.46C58.2147 27.46 57.9714 27.5167 57.7714 27.63C57.5714 27.7433 57.4114 27.8933 57.2914 28.08C57.1714 28.2667 57.0847 28.48 57.0314 28.72C56.9781 28.96 56.9514 29.2067 56.9514 29.46ZM60.9514 32H60.1014V31.3H60.0814C59.9414 31.5867 59.7214 31.7933 59.4214 31.92C59.1214 32.0467 58.7914 32.11 58.4314 32.11C58.0314 32.11 57.6814 32.0367 57.3814 31.89C57.0881 31.7433 56.8414 31.5467 56.6414 31.3C56.4481 31.0533 56.3014 30.7667 56.2014 30.44C56.1014 30.1133 56.0514 29.7667 56.0514 29.4C56.0514 29.0333 56.0981 28.6867 56.1914 28.36C56.2914 28.0333 56.4381 27.75 56.6314 27.51C56.8314 27.2633 57.0781 27.07 57.3714 26.93C57.6714 26.7833 58.0181 26.71 58.4114 26.71C58.5447 26.71 58.6881 26.7233 58.8414 26.75C58.9947 26.7767 59.1481 26.8233 59.3014 26.89C59.4547 26.95 59.5981 27.0333 59.7314 27.14C59.8714 27.24 59.9881 27.3667 60.0814 27.52H60.1014V24.86H60.9514V32ZM63.1591 25.9H62.3091V24.86H63.1591V25.9ZM62.3091 26.83H63.1591V32H62.3091V26.83ZM65.0959 29.42C65.0959 29.7333 65.1359 30.0133 65.2159 30.26C65.3026 30.5 65.4193 30.7033 65.5659 30.87C65.7126 31.03 65.8826 31.1533 66.0759 31.24C66.2759 31.3267 66.4859 31.37 66.7059 31.37C66.9259 31.37 67.1326 31.3267 67.3259 31.24C67.5259 31.1533 67.6993 31.03 67.8459 30.87C67.9926 30.7033 68.1059 30.5 68.1859 30.26C68.2726 30.0133 68.3159 29.7333 68.3159 29.42C68.3159 29.1067 68.2726 28.83 68.1859 28.59C68.1059 28.3433 67.9926 28.1367 67.8459 27.97C67.6993 27.8033 67.5259 27.6767 67.3259 27.59C67.1326 27.5033 66.9259 27.46 66.7059 27.46C66.4859 27.46 66.2759 27.5033 66.0759 27.59C65.8826 27.6767 65.7126 27.8033 65.5659 27.97C65.4193 28.1367 65.3026 28.3433 65.2159 28.59C65.1359 28.83 65.0959 29.1067 65.0959 29.42ZM64.1959 29.42C64.1959 29.04 64.2493 28.6867 64.3559 28.36C64.4626 28.0267 64.6226 27.74 64.8359 27.5C65.0493 27.2533 65.3126 27.06 65.6259 26.92C65.9393 26.78 66.2993 26.71 66.7059 26.71C67.1193 26.71 67.4793 26.78 67.7859 26.92C68.0993 27.06 68.3626 27.2533 68.5759 27.5C68.7893 27.74 68.9493 28.0267 69.0559 28.36C69.1626 28.6867 69.2159 29.04 69.2159 29.42C69.2159 29.8 69.1626 30.1533 69.0559 30.48C68.9493 30.8067 68.7893 31.0933 68.5759 31.34C68.3626 31.58 68.0993 31.77 67.7859 31.91C67.4793 32.0433 67.1193 32.11 66.7059 32.11C66.2993 32.11 65.9393 32.0433 65.6259 31.91C65.3126 31.77 65.0493 31.58 64.8359 31.34C64.6226 31.0933 64.4626 30.8067 64.3559 30.48C64.2493 30.1533 64.1959 29.8 64.1959 29.42ZM70.4081 30.89H71.5181V32H70.4081V30.89ZM76.5113 28.49C76.4447 28.1633 76.3047 27.91 76.0913 27.73C75.878 27.55 75.5913 27.46 75.2313 27.46C74.9247 27.46 74.668 27.5167 74.4613 27.63C74.2547 27.7433 74.088 27.8933 73.9613 28.08C73.8413 28.2667 73.7547 28.4833 73.7013 28.73C73.648 28.97 73.6213 29.22 73.6213 29.48C73.6213 29.72 73.648 29.9533 73.7013 30.18C73.7613 30.4067 73.8513 30.61 73.9713 30.79C74.0913 30.9633 74.248 31.1033 74.4413 31.21C74.6347 31.3167 74.8647 31.37 75.1313 31.37C75.5513 31.37 75.878 31.26 76.1113 31.04C76.3513 30.82 76.498 30.51 76.5513 30.11H77.4213C77.328 30.75 77.088 31.2433 76.7013 31.59C76.3213 31.9367 75.8013 32.11 75.1413 32.11C74.748 32.11 74.398 32.0467 74.0913 31.92C73.7913 31.7933 73.538 31.6133 73.3313 31.38C73.1313 31.1467 72.978 30.87 72.8713 30.55C72.7713 30.2233 72.7213 29.8667 72.7213 29.48C72.7213 29.0933 72.7713 28.7333 72.8713 28.4C72.9713 28.06 73.1213 27.7667 73.3213 27.52C73.528 27.2667 73.7847 27.07 74.0913 26.93C74.398 26.7833 74.7547 26.71 75.1613 26.71C75.4547 26.71 75.728 26.7467 75.9813 26.82C76.2413 26.8867 76.468 26.9933 76.6613 27.14C76.8613 27.2867 77.0247 27.4733 77.1513 27.7C77.278 27.92 77.358 28.1833 77.3913 28.49H76.5113ZM78.9924 29.42C78.9924 29.7333 79.0324 30.0133 79.1124 30.26C79.1991 30.5 79.3158 30.7033 79.4624 30.87C79.6091 31.03 79.7791 31.1533 79.9724 31.24C80.1724 31.3267 80.3824 31.37 80.6024 31.37C80.8224 31.37 81.0291 31.3267 81.2224 31.24C81.4224 31.1533 81.5958 31.03 81.7424 30.87C81.8891 30.7033 82.0024 30.5 82.0824 30.26C82.1691 30.0133 82.2124 29.7333 82.2124 29.42C82.2124 29.1067 82.1691 28.83 82.0824 28.59C82.0024 28.3433 81.8891 28.1367 81.7424 27.97C81.5958 27.8033 81.4224 27.6767 81.2224 27.59C81.0291 27.5033 80.8224 27.46 80.6024 27.46C80.3824 27.46 80.1724 27.5033 79.9724 27.59C79.7791 27.6767 79.6091 27.8033 79.4624 27.97C79.3158 28.1367 79.1991 28.3433 79.1124 28.59C79.0324 28.83 78.9924 29.1067 78.9924 29.42ZM78.0924 29.42C78.0924 29.04 78.1458 28.6867 78.2524 28.36C78.3591 28.0267 78.5191 27.74 78.7324 27.5C78.9458 27.2533 79.2091 27.06 79.5224 26.92C79.8358 26.78 80.1958 26.71 80.6024 26.71C81.0158 26.71 81.3758 26.78 81.6824 26.92C81.9958 27.06 82.2591 27.2533 82.4724 27.5C82.6858 27.74 82.8458 28.0267 82.9524 28.36C83.0591 28.6867 83.1124 29.04 83.1124 29.42C83.1124 29.8 83.0591 30.1533 82.9524 30.48C82.8458 30.8067 82.6858 31.0933 82.4724 31.34C82.2591 31.58 81.9958 31.77 81.6824 31.91C81.3758 32.0433 81.0158 32.11 80.6024 32.11C80.1958 32.11 79.8358 32.0433 79.5224 31.91C79.2091 31.77 78.9458 31.58 78.7324 31.34C78.5191 31.0933 78.3591 30.8067 78.2524 30.48C78.1458 30.1533 78.0924 29.8 78.0924 29.42ZM84.1146 26.83H84.9146V27.59H84.9346C85.3213 27.0033 85.8779 26.71 86.6046 26.71C86.9246 26.71 87.2146 26.7767 87.4746 26.91C87.7346 27.0433 87.9179 27.27 88.0246 27.59C88.1979 27.31 88.4246 27.0933 88.7046 26.94C88.9913 26.7867 89.3046 26.71 89.6446 26.71C89.9046 26.71 90.1379 26.74 90.3446 26.8C90.5579 26.8533 90.7379 26.94 90.8846 27.06C91.0379 27.18 91.1546 27.3367 91.2346 27.53C91.3213 27.7167 91.3646 27.9433 91.3646 28.21V32H90.5146V28.61C90.5146 28.45 90.5013 28.3 90.4746 28.16C90.4479 28.02 90.3979 27.9 90.3246 27.8C90.2513 27.6933 90.1479 27.61 90.0146 27.55C89.8879 27.49 89.7213 27.46 89.5146 27.46C89.0946 27.46 88.7646 27.58 88.5246 27.82C88.2846 28.06 88.1646 28.38 88.1646 28.78V32H87.3146V28.61C87.3146 28.4433 87.2979 28.29 87.2646 28.15C87.2379 28.01 87.1879 27.89 87.1146 27.79C87.0413 27.6833 86.9413 27.6033 86.8146 27.55C86.6946 27.49 86.5379 27.46 86.3446 27.46C86.0979 27.46 85.8846 27.51 85.7046 27.61C85.5313 27.71 85.3879 27.83 85.2746 27.97C85.1679 28.11 85.0879 28.2567 85.0346 28.41C84.9879 28.5567 84.9646 28.68 84.9646 28.78V32H84.1146V26.83Z" fill="white"/>
          </svg>

      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
}

export default App;


