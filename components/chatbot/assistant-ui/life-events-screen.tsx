import React from "react";

export type LifeEventCategory =
  | "disability"
  | "financial_investment"
  | "career_income"
  | "family_marital"
  | null;

interface LifeEventsScreenProps {
  onSelectCategory: (category: LifeEventCategory) => void;
  onBack: () => void;
}

export const LifeEventsScreen: React.FC<LifeEventsScreenProps> = ({
  onSelectCategory,
  onBack,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-start px-6 py-8"
      style={{
        height: "calc(100vh - 210px)",
        minHeight: "440px",
        maxHeight: "740px",
        marginTop: 20,
      }}
    >
      {/* Back Button */}
      <div className="w-full max-w-md mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Main Menu</span>
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#9B8FE3",
            borderRadius: "50%",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(155, 143, 227, 0.3)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
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
          Update Life Changing Events
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
          Select a category to update your tax profile with life changes
        </p>
      </div>

      {/* Four Category Buttons in Grid */}
      <div className="grid grid-cols-1  gap-3 w-full max-w-md">
        {/* Disability */}
        {/* <button
          onClick={() => onSelectCategory("disability")}
          className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #69DEC6 0%, #49C2D4 100%)",
            border: "none",
          }}
        >
          <div className="bg-white/95 rounded-xl px-4 py-5 h-full transition-all duration-300 group-hover:bg-white">
            <div className="flex  items-center " style={{ padding: "8px 0px" }}>
              <div
                style={{
                  minWidth: 32,
                  background: "#ffffff",
                  borderRadius: "100%",
                  marginRight: "10px",
                }}
                className="w-8 h-8 min-w-8 bg-gradient-to-br from-[#69DEC6] to-[#49C2D4] flex items-center justify-center mb-0 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#1a202c",
                    marginBottom: "2px",
                  }}
                >
                  Disability
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: "rgb(68 69 70)",
                    fontWeight: "500",
                    lineHeight: "1.4",
                  }}
                >
                  Health & disability
                </p>
              </div>
            </div>
          </div>
        </button> */}

        {/* Financial and Investment Events */}
        <button
          onClick={() => onSelectCategory("financial_investment")}
          className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #1595EA 0%, #548CE7 100%)",
            border: "none",
          }}
        >
          <div className="bg-white/95 rounded-xl px-4 py-5 h-full transition-all duration-300 group-hover:bg-white">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="flex  items-center "
                style={{ padding: "8px 0px" }}
              >
                <div
                  style={{
                    minWidth: 32,
                    background: "#ffffff",
                    borderRadius: "100%",
                    marginRight: "10px",
                  }}
                  className="w-8 h-8 min-w-8 bg-gradient-to-br from-[#69DEC6] to-[#49C2D4] flex items-center justify-center mb-0 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "2px",
                    }}
                  >
                    Financial & Investment
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#ffffff",
                      fontWeight: "500",
                      lineHeight: "1.4",
                    }}
                  >
                    Assets & investments
                  </p>
                </div>
              </div>
              <span>
                <svg
                  stroke="currentColor"
                  fill="#ffffff"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="20px"
                  width="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"></path>
                </svg>
              </span>
            </div>
          </div>
        </button>

        {/* Career and Income Changes */}
        <button
          onClick={() => onSelectCategory("career_income")}
          className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #518DE7 0%, #7687E5 100%)",
            border: "none",
          }}
        >
          <div className="bg-white/95 rounded-xl px-4 py-5 h-full transition-all duration-300 group-hover:bg-white">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="flex  items-center "
                style={{ padding: "8px 0px" }}
              >
                <div
                  style={{
                    minWidth: 32,
                    background: "#ffffff",
                    borderRadius: "100%",
                    marginRight: "10px",
                  }}
                  className="w-8 h-8 min-w-8 bg-gradient-to-br from-[#69DEC6] to-[#49C2D4] flex items-center justify-center mb-0 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  {" "}
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "2px",
                    }}
                  >
                    Career & Income
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#ffffff",
                      fontWeight: "500",
                      lineHeight: "1.4",
                    }}
                  >
                    Job & income changes
                  </p>
                </div>
              </div>
              <span>
                <svg
                  stroke="currentColor"
                  fill="#ffffff"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="20px"
                  width="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"></path>
                </svg>
              </span>
            </div>
          </div>
        </button>

        {/* Family and Marital Status Changes */}
        <button
          onClick={() => onSelectCategory("family_marital")}
          className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #9B8FE3 0%, #C687E7 100%)",
            border: "none",
          }}
        >
          <div className="bg-white/95 rounded-xl px-4 py-5 h-full transition-all duration-300 group-hover:bg-white">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                className="flex  items-center "
                style={{ padding: "8px 0px" }}
              >
                <div
                  style={{
                    minWidth: 32,
                    background: "#ffffff",
                    borderRadius: "100%",
                    marginRight: "10px",
                  }}
                  className="w-8 h-8 min-w-8 bg-gradient-to-br from-[#69DEC6] to-[#49C2D4] flex items-center justify-center mb-0 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                  </svg>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#ffffff",
                      marginBottom: "2px",
                    }}
                  >
                    Family & Marital Status
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#ffffff",
                      fontWeight: "500",
                      lineHeight: "1.4",
                    }}
                  >
                    Family status updates
                  </p>
                </div>
              </div>
              <span>
                <svg
                  stroke="currentColor"
                  fill="#ffffff"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="20px"
                  width="30px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z"></path>
                </svg>
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Footer Text */}
      {/* <p
        style={{
          fontSize: "12px",
          color: "rgb(113 127 145)",
          textAlign: "center",
          marginTop: "24px",
          maxWidth: "400px",
        }}
      >
        Select the category that best matches your life event to update your tax
        information
      </p> */}
    </div>
  );
};
