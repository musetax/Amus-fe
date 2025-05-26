import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface PaycheckSliderProps {
  min: number;
  max: number;
  fixboost: any;
  setFixBoost: (value: number) => void;
}

const PaycheckSlider: React.FC<PaycheckSliderProps> = ({
  min,
  max,
  fixboost,
  setFixBoost,
}) => {
 

  const handleChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setFixBoost(newValue);
    }
  };

  const handleAfterChange = (newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setFixBoost(newValue);
    }
  };

  return (
    <div className="bg-mediumBlueGradient p-4 rounded-xl  ">
      <p className="text-white text-lg font-medium mb-2">
        Current Refund Estimate
      </p>
      <h2 className="text-[32px] font-semibold text-white">$2,000</h2>
      <div className="relative">
        <div className="flex items-center justify-between gap-5 mt-3">
           <div className="text-sm font-medium text-white">
            {" "}
            {fixboost}% Complete
          </div>
        </div> 
        <div className="relative customs-slider mt-1">
          <Slider
            min={min}
            max={max}
            value={fixboost}
            onChange={handleChange} // Updates UI while sliding
            onChangeComplete={handleAfterChange} // Saves state when released
            trackStyle={{ backgroundColor: "#48297C" }}
            handleStyle={{ borderColor: "#48297C" }}
          />

          
        </div>
      </div>
      <div className="text-base font-normal text-white mt-3">
        Filing Status: Single
      </div>
    </div>
  );
};

export default PaycheckSlider;
