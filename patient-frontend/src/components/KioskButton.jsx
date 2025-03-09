/**
 * KioskButton Component
 *
 * A reusable button component for the kiosk interface.
 *
 * Props:
 * @param {string} text - The text to be displayed on the button.
 * @param {function} onClick - Callback function triggered when the button is clicked.
 * @param {string} [color="blue"] - The background color of the button (default is blue).
 */
const KioskButton = ({ text, onClick, color = "blue" }) => {
    return (
      <button
        onClick={onClick}
        className={`p-3 text-white rounded-md text-lg w-full mt-2 bg-${color}-500`}
      >
        {text}
      </button>
    );
  };
  
  export default KioskButton;
  
