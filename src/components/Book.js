import React from "react";
import PropTypes from "prop-types";
import ShelfChanger from "./ShelfChanger";

const Book = ({ book, cover, handleChange }) => {
  return (
    <div className='book'>
      <div className='book-top'>
        <div
          className='book-cover'
          style={{
            width: 200,
            height: 200,
            background: `url("${cover}")`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <ShelfChanger
          selectValue={book.shelf ? book.shelf : "none"}
          handleChange={handleChange}
        />
      </div>
      <div className='book-title'>{book.title}</div>
      {book.authors && (
        <div className='book-authors'>
          {book.authors.length > 1 ? (
            book.authors.map((author, idx) => (
              <p style={{ margin: "0", padding: "0" }} key={idx}>
                {`${author}`}.{" "}
              </p>
            ))
          ) : (
            <span>{book.authors[0]} </span>
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
  book: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Book;
