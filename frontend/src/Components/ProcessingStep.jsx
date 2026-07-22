import React from "react";

const STEP_EXPLANATIONS = {
  "Cleaned Quote":
    "Strips non-linguistic noise from the raw input (punctuation, digits, extra whitespace..) leaving only the Arabic letters.",
  "Without Stopwords":
    "Removes very common function words (e.g. من, في, على, و) that carry little classification signal, so the model can focus on content-bearing words.",
  "Normalized":
    "Collapses different spellings of the same letter into one canonical form, so the same word isn't treated as several different tokens.",
};

function ProcessingStep({ steps }) {
  return (
    <div className="bg-white border border-gray-200 shadow-md p-8 space-y-6">
      <h2 className="text-xl font-semibold">Preprocessing Steps</h2>
      {steps.map((step, index) => (
        <div
          key={index}
          className="p-4 border-t border-gray-100 first:border-t-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-gray-500">{step.label}</h3>
            <div className="relative group">
              <span className="inline-flex items-center justify-center w-4 h-4 text-[11px] font-bold text-gray-400 border border-gray-300 cursor-help select-none" tabIndex={0}>
                i
              </span>
              <div className="absolute left-0 bottom-full mb-2 w-72 p-3 bg-gray-900 text-white text-xs leading-relaxed shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-visible:opacity-100 group-focus-visible:visible transition-opacity duration-150 z-10 pointer-events-none">
                {STEP_EXPLANATIONS[step.label]}
              </div>
            </div>
          </div>
          <p className="text-lg break-words" dir="rtl">
            {step.text || "Waiting for input..."}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProcessingStep;
