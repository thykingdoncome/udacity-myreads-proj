import React from "react";
import PropTypes from "prop-types";

const options = [
  {
    label: "Currently Reading",
    value: "currentlyReading",
  },
  {
    label: "Want to Read",
    value: "wantToRead",
  },
  {
    label: "Read",
    value: "read",
  },
  {
    label: "None",
    value: "none",
  },
];

const ShelfChanger = ({ selectValue, handleChange }) => {
  return (
    <div className='book-shelf-changer'>
      <select defaultValue={selectValue} onChange={handleChange}>
        <option value='move' disabled>
          Move to...
        </option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

ShelfChanger.propTypes = {
  selectValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default ShelfChanger;
