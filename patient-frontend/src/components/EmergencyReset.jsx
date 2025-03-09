/**
 * EmergencyReset Component
 *
 * This component provides two buttons for emergency and reset actions.
 * - The "🚨 Emergency" button triggers the `onEmergency` function when clicked.
 * - The "🔄 Reset" button triggers the `onReset` function when clicked.
 * 
 * Props:
 * @param {function} onReset - Function to handle the reset action.
 * @param {function} onEmergency - Function to handle the emergency action.
 */
const EmergencyReset = ({ onReset, onEmergency }) => {
    return (
      <div className="fixed bottom-4 left-4 flex space-x-4">
        <button onClick={onEmergency} className="p-3 bg-red-600 text-white rounded-md">🚨 Emergency</button>
        <button onClick={onReset} className="p-3 bg-gray-600 text-white rounded-md">🔄 Reset</button>
      </div>
    );
  };
  
  export default EmergencyReset;
