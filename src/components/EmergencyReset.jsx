const EmergencyReset = ({ onReset, onEmergency }) => {
    return (
      <div className="fixed bottom-4 left-4 flex space-x-4">
        <button onClick={onEmergency} className="p-3 bg-red-600 text-white rounded-md">🚨 Emergency</button>
        <button onClick={onReset} className="p-3 bg-gray-600 text-white rounded-md">🔄 Reset</button>
      </div>
    );
  };
  
  export default EmergencyReset;
  