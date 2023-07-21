import React, { useState } from "react";

const AddressInput = ({ value, onChange, autocompleteResults, onAutocompleteSelect }) => {
  const [focusIndex, setFocusIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const newIndex = autocompleteResults.length > 0 ? (focusIndex + 1) % autocompleteResults.length : -1;
      setFocusIndex(newIndex);
    } else if ((e.key === 'Enter' || e.key === ' ') && focusIndex >= 0 && focusIndex < autocompleteResults.length) {
      e.preventDefault();
      onAutocompleteSelect(autocompleteResults[focusIndex]);
    }
  };

  const handleBlur = () => {
    setFocusIndex(-1);
  };

  return (
    <div className="form-floating mb-3 position-relative">
      <input
        type="text"
        className="form-control"
        id="formAddress1"
        placeholder="Enter address 1"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoComplete="address-line1"
        required
      />
      <label htmlFor="formAddress1">Address 1</label>

      <div className={`dropdown-menu w-auto ${autocompleteResults.length > 0 ? 'show' : ''}`} style={{ maxWidth: '90vw' }}>
        {autocompleteResults.map((result, index) => (
          <div
            key={index}
            tabIndex="0"
            className={`dropdown-item text-wrap w-100 ${index === focusIndex ? 'active' : ''}`}
            onMouseDown={() => onAutocompleteSelect(result)}
          >
            {result.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressInput;
