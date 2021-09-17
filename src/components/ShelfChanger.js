import React from "react";

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

const ShelfChanger = props => {
  return (
    <div className='book-shelf-changer'>
      <select defaultValue={props.selectValue} onChange={props.handleChange}>
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

export default ShelfChanger;
