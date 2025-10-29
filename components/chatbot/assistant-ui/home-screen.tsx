import React from "react";
import Image from "next/image";

export type AgentIntent =
  | "tax_education"
  | "tax_refund_calculation"
  | "tax_paycheck_calculation"
  | "life_events_update"
  | null;

interface HomeScreenProps {
  onSelectIntent: (intent: AgentIntent) => void;
  companyLogo?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectIntent,
  companyLogo,
}) => {
  return (
    <div
      className="flex flex-col items-center  px-6 py-8"
      style={{
        height: "calc(100vh - 210px)",
        minHeight: "440px",
        maxHeight: "740px",
        overflowY: "auto",
        justifyContent: "start",
      }}
    >
      {/* Logo and Welcome Section */}
      <div className="flex flex-col items-center mb-8">
        <div
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {companyLogo ? (
            <Image
              src={companyLogo}
              width={70}
              height={70}
              alt="Company Logo"
              style={{ borderRadius: "50%" }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="41"
              viewBox="0 0 60 41"
              fill="none"
            >
              <path
                d="M12.7905 7.42385L1.20752 31.1693C-0.502414 34.6745 1.17634 38.2925 4.9571 39.2503C8.73794 40.2081 13.189 38.1427 14.899 34.6375L26.482 10.892C28.192 7.38677 26.5131 3.76859 22.7323 2.81097C18.9515 1.85316 14.5005 3.91858 12.7905 7.42385Z"
                fill="url(#paint0_linear_7768_1391)"
              />
              <path
                d="M27.7745 7.0597L34.9048 21.6752C36.5827 25.1143 34.9357 28.6641 31.2263 29.6037C27.5169 30.5435 23.1499 28.5174 21.4722 25.0783L14.3417 10.4628C12.6637 7.02373 14.3107 3.47396 18.0201 2.53433C21.7295 1.59451 26.0967 3.62062 27.7745 7.0597Z"
                fill="url(#paint1_linear_7768_1391)"
              />
              <path
                d="M30.0391 7.08014L22.9286 21.6547C21.2453 25.1051 22.8975 28.6665 26.6189 29.6095C30.3406 30.5523 34.7221 28.5195 36.4055 25.0691L43.5158 10.4946C45.1993 7.04417 43.547 3.48272 39.8253 2.53993C36.1039 1.59696 31.7224 3.62975 30.0391 7.08014Z"
                fill="url(#paint2_linear_7768_1391)"
              />
              <path
                d="M45.5962 7.19045L57.2931 31.1693C59.0031 34.6746 57.3244 38.2927 53.5436 39.2504C49.7629 40.2082 45.3116 38.1427 43.6017 34.6375L31.9048 10.6586C30.1948 7.15337 31.8737 3.53519 35.6544 2.57757C39.435 1.61976 43.8864 3.68518 45.5962 7.19045Z"
                fill="url(#paint3_linear_7768_1391)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_7768_1391"
                  x1="4.04851"
                  y1="38.9984"
                  x2="28.5694"
                  y2="6.83259"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#69DEC6" />
                  <stop offset="1" stopColor="#49C2D4" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_7768_1391"
                  x1="16.9186"
                  y1="3.08128"
                  x2="44.3829"
                  y2="35.4655"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#48C2D4" />
                  <stop offset="1" stopColor="#1595EA" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_7768_1391"
                  x1="25.1579"
                  y1="29.422"
                  x2="62.1925"
                  y2="-12.9475"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#1695EA" />
                  <stop offset="1" stopColor="#548CE7" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_7768_1391"
                  x1="36.5681"
                  y1="2.06437"
                  x2="61.2194"
                  y2="35.6826"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#518DE7" />
                  <stop offset="1" stopColor="#7687E5" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1a202c",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Welcome! How Can I Help You?
        </h2>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "400",
            color: "#718096",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          Choose one of the options below to get started with your tax
          assistance
        </p>
      </div>

      {/* Three Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Ask My Uncle Sam Button */}
        <button
          onClick={() => onSelectIntent("tax_education")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#69DEC6] via-[#49C2D4] to-[#1595EA] p-[2px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl px-4 py-4 transition-all duration-300 group-hover:bg-opacity-95 custom-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#69DEC6] to-[#1595EA] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#518de7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a202c",
                      marginBottom: "2px",
                    }}
                  >
                    Get instant answers to your tax questions
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#718096",
                      fontWeight: "400",
                    }}
                  >
                    Ask My Uncle Sam
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Refund My Paycheck Button */}
        <button
          onClick={() => onSelectIntent("tax_refund_calculation")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#518DE7] via-[#7687E5] to-[#9B8FE3] p-[2px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl px-4 py-4 transition-all duration-300 group-hover:bg-opacity-95 custom-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#518DE7] to-[#7687E5] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#518de7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a202c",
                      marginBottom: "2px",
                    }}
                  >
                    Optimize withholdings for maximum refund
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#718096",
                      fontWeight: "400",
                    }}
                  >
                    CheckBoost
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Paycheck Calculator Button */}
        <button
          onClick={() => onSelectIntent("tax_paycheck_calculation")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#48C2D4] via-[#1595EA] to-[#548CE7] p-[2px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl px-4 py-4 transition-all duration-300 group-hover:bg-opacity-95 custom-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1595EA] to-[#548CE7] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#518de7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a202c",
                      marginBottom: "2px",
                    }}
                  >
                    Calculate your take-home pay instantly
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#718096",
                      fontWeight: "400",
                    }}
                  >
                    Paycheck Calculator
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Update My Life Changing Events Button */}
        {/* <button
          onClick={() => onSelectIntent("life_events_update")}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#9B8FE3] via-[#B08BE5] to-[#C687E7] p-[2px] transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
        >
          <div className="bg-white rounded-2xl px-4 py-4 transition-all duration-300 group-hover:bg-opacity-95 custom-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9B8FE3] to-[#C687E7] flex items-center justify-center"
                  style={{ minWidth: "25px" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#518de7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1a202c",
                      marginBottom: "2px",
                    }}
                  >
                    Update My Life Changing Events
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#718096",
                      fontWeight: "400",
                    }}
                  >
                    Update your tax profile with life changes
                  </p>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#718096"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button> */}
      </div>

      {/* Footer Text */}
      {/* <p
        style={{
          fontSize: "12px",
          color: "#a0aec0",
          textAlign: "center",
          marginTop: "24px",
          maxWidth: "400px",
        }}
      >
        Need help? Our AI-powered assistant is here to guide you through every
        step
      </p> */}
    </div>
  );
};
