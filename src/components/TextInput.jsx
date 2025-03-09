const TextInput = ({ label, value, onChange }) => {
    return (
      <div className="mb-4">
        <label className="text-lg text-gray-800">{label}</label>
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
  