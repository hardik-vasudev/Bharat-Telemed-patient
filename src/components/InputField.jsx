import React from "react";

const InputField = ({ question, value, onChange, onNext, onSkip }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Question */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{question}</h2>

      {/* Input Box */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-80 p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition"
        >
          Next
        </button>
        <button
          onClick={onSkip}
          className="bg-gray-400 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-500 transition"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default InputField;
