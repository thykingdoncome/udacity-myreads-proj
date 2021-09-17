import React from "react";
import PropTypes from "prop-types";
import ShelfChanger from "./ShelfChanger";

const Book = props => {
  return (
    <div className='book'>
      <div className='book-top'>
        <div
          className='book-cover'
          style={{
            width: 200,
            height: 200,
            background: `url("${props.cover}")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <ShelfChanger
          selectValue={props.selectValue}
          handleChange={props.handleChange}
        />
      </div>
      <div className='book-title'>{props.title}</div>
      {props.authors && (
        <div className='book-authors'>
          {props.authors.length > 1 ? (
            props.authors.map((author, idx) => (
              <span key={idx}>{`${idx + 1}.  ${author}`}. </span>
            ))
          ) : (
            <span>{props.authors[0]} </span>
          )}
        </div>
      )}
    </div>
  );
};

Book.defaultProps = {
  cover: "https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg",
};

Book.propTypes = {
  cover: PropTypes.string,
};

export default Book;
