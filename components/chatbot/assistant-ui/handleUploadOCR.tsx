import { FC } from "react";
import { ThreadPrimitive } from "@assistant-ui/react";

interface SelcectForHowToFillDataButtonProps {
  setPayloadButton: (payload: any) => void;
}

export const SelcectForHowToFillDataButton: FC<
  SelcectForHowToFillDataButtonProps
> = ({ setPayloadButton }) => {
  const handleEnterManually = () => {
    setPayloadButton({ enterManually: true, ocr: false });
  };

  const handleUseOCR = () => {
    setPayloadButton({ enterManually: false, ocr: true });
  };

  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col px-4">
        <div className="flex w-full flex-grow flex-col items-center justify-center" style={{height:"calc(100vh - 135px)"}}>
          <div
            className="mt-4 font-medium text-sm"
            style={{
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h4
              style={{
                fontSize: "16px",
                fontWeight: 400,
                textAlign: "center",
                marginBottom: "8px",
              }}
            >
              Ready to Calculate Your Taxes?
            </h4>

            <p
              style={{
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "center",
              }}
              className="mt-2 text-center text-sm text-muted-foreground max-w-md"
            >
              Hi, I’m Uncle Sam! Your personal tax assistant.
              Need help calculating your taxes, checking your refund, or updating your info after a life change? I’ve got you covered.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              {/* --- Enter Manually Button --- */}
              <button
                onClick={handleEnterManually}
                className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all"
                style={{
                  backgroundColor: "rgb(81, 141, 231)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")
                }
              >
                Enter Manually
              </button>

              {/* --- Use OCR Button --- */}
              <button
                onClick={handleUseOCR}
                className="px-6 py-2 rounded-full font-medium text-white shadow-md transition-all"
                style={{
                  backgroundColor: "rgb(81, 141, 231)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(65, 120, 210)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(81, 141, 231)")
                }
              >
                Upload Paycheck
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};
