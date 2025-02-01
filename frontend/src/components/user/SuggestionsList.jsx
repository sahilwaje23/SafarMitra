import axios from "axios";
import { useState, useEffect } from "react";
import SuggestionItem from "./Suggestion";

export default function InputWithSuggestions({
  inputId,
  placeholder,
  onSelect,
}) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(""); // New state for the debounced input
  const token = localStorage.getItem("token");

  // Debounce input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 2000); // Wait for 2 seconds after the user stops typing

    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch suggestions when debounced value changes and input length > 2
  useEffect(() => {
    if (debouncedValue.length > 2) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestion`, {
          params: {
            input: debouncedValue, // Use the debounced value
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setSuggestions(res.data);
        })
        .catch((err) => console.error("Error fetching suggestions:", err));
    } else {
      setSuggestions([]);
    }
  }, [debouncedValue]);

  return (
    <div className="w-full max-w-[342px] relative">
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
        <div className="absolute left-0 right-0 rounded shadow-lg z-10 bg-[rgb(40,40,40)] py-3 w-full outline-none max-w-[342px] h-[200px] overflow-y-scroll mt-[1px]">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="py-2 cursor-pointer hover:bg-[#333] rounded px-2"
              onClick={() => {
                setInputValue(suggestion.description);
                setShowDropdown(false);
                onSelect(suggestion);
              }}
            >
              <SuggestionItem suggestion={suggestion} onSelect={onSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
