const Switch = ({ checked }) => {
  return (
    <label className="flex items-center cursor-not-allowed">
      <input
        type="checkbox"
        checked={checked} 
        readOnly 
        className="sr-only"
      />
      <div className="relative">
        <div
          className={`w-10 h-5 rounded-full shadow-inner transition-colors duration-300 ${
            checked ? "bg-[#3CAB8B]" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full border-[1px] transition-transform duration-300 transform ${
            checked ? "translate-x-5 border-[#31A9D3] shadow-md" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Switch;
