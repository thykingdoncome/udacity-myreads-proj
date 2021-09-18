import React, { Component } from "react";
import PropTypes from "prop-types";
import Book from "./Book";

export class BookShelf extends Component {
  render() {
    return (
      <div className='bookshelf'>
        <h2 className='bookshelf-title'>{this.props.bookshelfTitle}</h2>
        <div className='bookshelf-books'>
          <ol className='books-grid' style={{ position: "relative" }}>
            {this.props.shelf.length > 0 && !this.props.loadingBooks ? (
              this.props.shelf.map(book => (
                <li key={book.id}>
                  <Book
                    book={book}
                    cover={book.imageLinks && book.imageLinks["smallThumbnail"]}
                    handleChange={e => this.props.handleChange(e, book)}
                  />
                </li>
              ))
            ) : (
              <h2>{this.props.isEmptyMsg}</h2>
            )}
          </ol>
        </div>
      </div>
    );
  }
}

BookShelf.propTypes = {
  bookshelfTitle: PropTypes.string,
  shelf: PropTypes.array.isRequired,
  loadingBooks: PropTypes.bool,
};

export default BookShelf;
