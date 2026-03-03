import React from "react";
import { CheckCircle } from "./icons";

interface SavedSectionProps {
  onContinue: () => void;
}

export const SavedSection: React.FC<SavedSectionProps> = ({ onContinue }) => {
  return (
    <div className="sticky bg-[#255be305] bottom-0 px-3 pt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg pb-2">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 mb-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-3xl mb-4">
            <CheckCircle className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Tax Information Saved Successfully!
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Your tax information has been saved. You can now continue to chat
            with me about your taxes.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 max-w-lg mx-auto">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>💡 Pro Tip:</strong> You can now continue to chat with me
              about your taxes, ask questions, or request updates anytime!
            </p>
          </div>

          <button
            onClick={onContinue}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-semibold hover:bg-opacity-90 transition-all duration-200"
          >
            Continue to Chat
          </button>
        </div>
      </div>
    </div>
  );
};
