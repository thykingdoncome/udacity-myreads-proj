import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import BookShelf from "./BookShelf";
import Spinner from "./Spinner";

export class SearchBooks extends Component {
  state = { query: "", searchedBooks: [], loadingBooks: false, allBooks: [] };

  onchangeHandler = async e => {
    let { value } = e.target;
    this.setState({ query: value });
    this.onSubmit(value);
  };

  selectChangeHandler = (e, book) => {
    this.updateBook(book, e.target.value);
  };

  emptyBooks = () => this.setState({ searchedBooks: [] });

  onSubmit = async value => {
    if (value.trim().length < 1) {
      this.emptyBooks();
      return;
    }

    if (value.trim().length > 0) {
      this.setState({ loadingBooks: true });

      const res = await BooksAPI.search(value).catch(ex =>
        this.setState({
          searchedBooks: [],
          loadingBooks: false,
        })
      );

      if (res.error) {
        this.setState({ searchedBooks: [], loadingBooks: false });
        return;
      }

      let queryValue = value.toLowerCase();

      res.map(book =>
        this.state.allBooks
          .filter(bk => bk.id === book.id)
          .map(bk => (book.shelf = bk.shelf))
      );

      let holdArr = [...res];
      holdArr.filter(book => {
        let booksIncluded = !queryValue;
        if (value) {
          booksIncluded =
            book.title.includes(queryValue) ||
            (book.hasOwnProperty("authors") &&
              book.authors.map(author => author.includes(queryValue)));
        }
        return booksIncluded;
      });
      this.setState({
        searchedBooks: holdArr,
        loadingBooks: false,
      });
    } else {
      this.setState({ searchedBooks: [] });
    }
  };

  updateBook = async (book, shelf) => {
    this.setState({ updateLoading: true });
    await BooksAPI.update(book, shelf);
    this.setState({ updateLoading: false });
  };

  componentDidMount() {
    const books = JSON.parse(localStorage.getItem("allBooks"));
    this.setState({ allBooks: [...books] });
  }

  render() {
    const { searchedBooks, loadingBooks } = this.state;

    return (
      <div className='App'>
        <div className='search-books'>
          <div className='search-books-bar'>
            <Link to='/' className='close-search' />
            <div className='search-books-input-wrapper'>
              <input
                type='text'
                placeholder='Search by title or author'
                autoFocus
                onChange={e => this.onchangeHandler(e)}
              />
            </div>
          </div>
          {this.state.loadingBooks && <Spinner />}
          <div className='search-books-results'>
            {this.state.query.length > 0 ? (
              <BookShelf
                shelf={searchedBooks}
                loadingBooks={loadingBooks}
                handleChange={this.selectChangeHandler}
                isEmptyMsg={
                  searchedBooks.length < 1 ? "Nothing to display" : ""
                }
              />
            ) : (
              <h2 style={{ textAlign: "center" }}>Nothing to display</h2>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBooks;