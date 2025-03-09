import React from "react";
/**
 * InputField Component
 *
 * A reusable input component that displays a question, an input field for user response,
 * and "Next" & "Skip" buttons for navigation.
 *
 * Props:
 * @param {string} question - The question to be displayed above the input field.
 * @param {string} value - The current value of the input field.
 * @param {function} onChange - Callback function to handle input field changes.
 * @param {function} onNext - Callback function triggered when the "Next" button is clicked.
 * @param {function} onSkip - Callback function triggered when the "Skip" button is clicked.
 */
const InputField = ({ question, value, onChange, onNext, onSkip }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Display the question above the input field */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{question}</h2>

      {/* Input box for user response */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-80 p-3 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
      />

      {/* Navigation buttons: "Next" and "Skip" */}
      <div className="mt-6 flex space-x-4">
        {/* Button to proceed to the next step */}
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition"
        >
          Next
        </button>
        {/* Button to skip the current question */}
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
