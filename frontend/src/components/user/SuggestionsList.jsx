import axios from "axios";
import { useState, useEffect } from "react";

export default function InputWithSuggestions({ inputId, placeholder, onSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (inputValue.length > 0) {
      axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/map/get-suggestion?input=${inputValue}`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.error("Error fetching suggestions:", err));
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        id={inputId}
        value={inputValue}
        className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white/50 outline-offset-0 outline-2"
        placeholder={placeholder}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 border rounded bg-white shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => {
                setInputValue(suggestion);
                setShowDropdown(false);
                onSelect(suggestion);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
