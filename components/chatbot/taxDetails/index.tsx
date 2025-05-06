import { useState } from "react";
import TaxBenefitDetail from "./taxBenefit";
import PaycheckSlider from "./taxSlider";

const TaxDetails = () => {
  const [fixboost, setFixBoost] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"benefit" | "profile">("benefit");
  return (
    <>
      <div className="bg-bgGradientBox rounded-2xl p-4 min-h-[650px] mb-5">
        <div className="flex items-center justify-between space-x-4 mb-10 border border-[#6A57F6] border-opacity-20 rounded-full p-2">
          <button
            onClick={() => setActiveTab("benefit")}
            className={`px-4 py-2  rounded-full text-lg font-medium flex items-center justify-center gap-2  transition-all duration-200 ${
              activeTab === "benefit"
                ? "bg-mediumBlueGradient text-white"
                : "text-textgray "
            }`}
          >
            Tax Benefits
          </button>
          <button
         //   onClick={() => setActiveTab("profile")}
            className={`px-5 py-2  rounded-full text-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-mediumBlueGradient text-white"
                : "text-textgray"
            }`}
          >
            Tax Profile
          </button>
        </div>

        <div className="block">
          {activeTab === "benefit" ? (
            <TaxBenefitDetail />
          ) : (
            <div className="block">profile</div>
          )}
        </div>
      </div>
      <PaycheckSlider
        fixboost={fixboost}
        setFixBoost={setFixBoost}
        min={0}
        max={100}
      />
    </>
  );
};
export default TaxDetails;
