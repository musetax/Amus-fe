import { AlertTriangle } from "lucide-react";
import React, { useEffect } from "react";
const addBounceKeyframes = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `;
  document.head.appendChild(style);
};
export const ErrorBanner = ({ message }: { message: string }) => {
     useEffect(() => {
    addBounceKeyframes(); // inject keyframes when component mounts
  }, []);
  return (
    <div className="w-full flex justify-center items-center py-4 animate-fadeIn" style={{height:"calc(100vh - 140px)"}}>
     <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          backgroundColor: "#FEE2E2", // red-100
          border: "1px solid #FEE2E2", // red-600
          borderRadius: "6px",
          padding: "16px",
          maxWidth: "600px",
          width: "100%",
          margin: "0 16px",
        }}
      >
        <div style={{ display: "flex",flexDirection:"column", alignItems: "center",justifyContent:"center", gap: "12px" }}>
          <AlertTriangle
            style={{
              width: "40px",
              height: "40px",
              color: "#DC2626", // red-600
              animation: "bounce 1s infinite",
              flexShrink: 0,
              marginTop: "2px",
            }}
          />
          <div>
            <p
              style={{
                color: "#991B1B", // red-800
                fontWeight: 600,
                fontSize: "18px",
                marginBottom: "4px",
                textAlign:"center"
              }}
            >
              Warning
            </p>
            <p style={{ color: "#B91C1C", fontSize: "14px" }}>{message}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};
