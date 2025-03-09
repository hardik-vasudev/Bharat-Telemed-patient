const TextInput = ({ label, value, onChange }) => {
    return (
      <div className="mb-4">
          {/* Label for the text input field */}
        <label className="text-lg text-gray-800">{label}</label>
           {/* Input field where users can enter text */}
        <input
          type="text"
          className="mt-2 p-2 border border-gray-400 rounded-md text-lg w-full"
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };
  
  export default TextInput;
  
