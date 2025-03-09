const StepInput = ({ label, value, onChange, onNext }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          {/* Display the label/question for the input field */}
        <h2 className="text-2xl font-semibold">{label}</h2>
          {/* Input field where users can type their response */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-400 p-2 mt-4 w-full text-lg"
        />
          {/* Button to proceed to the next step */}
        <button onClick={onNext} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
          Next
        </button>
      </div>
    );
  };
  
  export default StepInput;
  
