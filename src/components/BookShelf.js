import React, { Component } from "react";

export class BookShelf extends Component {
  render() {
    return (
      <div className='bookshelf'>
        <h2 className='bookshelf-title'>{this.props.bookshelfTitle}</h2>
        <div className='bookshelf-books'>
          <ol className='books-grid' style={{ position: 'relative' }}>{this.props.children}</ol>
        </div>
      </div>
    );
  };
};

export default BookShelf;