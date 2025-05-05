import React, { useState } from "react";
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
  // Calculate the percentage position of the handle
  const getLeftPosition = () => {
    return ((fixboost - min) / (max - min)) * 100;
  };

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
      <h2 className="text-[32px] font-semibold text-white">$4,000</h2>
      <div className="relative">
        <div className="flex items-center justify-between gap-5 mt-3">
          <div className="text-sm font-normal text-white">Based on so far </div>
          <div className="text-sm font-medium text-white">
            {" "}
            {fixboost}% Complete
          </div>
        </div>
        {/* <div
          className="absolute top-[-30px] w-6 h-6 rounded-full bg-transparent p-1 text-primaryColor flex items-center justify-center shadow text-[12px]"
          style={{
            left: `${getLeftPosition()}%`,
            transform: "translateX(-50%)",
            transition: "left 0.2s ease-out",
          }}
        >
          ${fixboost}
        </div> */}
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

          {/* <div className="flex justify-between text-sm mt-2">
            <span className="text-sm font-semibold text-white">${min}</span>
            <span className="text-sm font-semibold text-white">${max}</span>
          </div> */}
        </div>
      </div>
      <div className="text-base font-normal text-white mt-3">
        Filing Status: Married Filing Jointly
      </div>
    </div>
  );
};

export default PaycheckSlider;
