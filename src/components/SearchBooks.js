import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import BookShelf from "./BookShelf";
import Book from "./Book";
import Spinner from "./Spinner";

export class SearchBooks extends Component {
  state = {
    query: "",
    searchedBooks: [],
    loadingBooks: false,
    selectedShelf: "",
    allBooks: [],
  };

  onchangeHandler = e => {
    this.setState({ query: e.target.value });
  };

  selectChangeHandler = (e, book) => {
    this.setState({ selectedShelf: e.target.value });
    this.updateBook(book, e.target.value);
  };

  onSubmit = async () => {
    if (this.state.query === "") {
      this.setState({ searchedBooks: [] });
      return;
    }

    this.setState({ loadingBooks: true });

    const res = await BooksAPI.search(this.state.query);

    if (res.error) {
      this.setState({ loadingBooks: false });
      return;
    } else {
      res.map(book =>
        this.state.allBooks
          .filter(bk => bk.id === book.id)
          .map(bk => (book.shelf = bk.shelf))
      );

      this.setState({
        searchedBooks: res,
      });

      this.state.searchedBooks.map(book => {
        let shelfValue = "";
        if (book.shelf === "currentlyReading") {
          shelfValue = book.shelf;
          this.setState({ selectedShelf: shelfValue });
        }
        if (book.shelf === "wantToRead") {
          shelfValue = book.shelf;
          this.setState({ selectedShelf: shelfValue });
        }
        if (book.shelf === "read") {
          shelfValue = book.shelf;
          this.setState({ selectedShelf: shelfValue });
        }
        if (book.shelf === "none") {
          shelfValue = book.shelf;
          this.setState({ selectedShelf: shelfValue });
        }
      });
    }

    this.setState({ loadingBooks: false });
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
    const { searchedBooks } = this.state;

    return (
      <div className='App'>
        <div className='search-books'>
          <div className='search-books-bar'>
            <Link to='/' className='close-search'>
              {/* Close */}
            </Link>
            <div className='search-books-input-wrapper'>
              {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
              <input
                type='text'
                placeholder='Search by title or author'
                onChange={e => this.onchangeHandler(e)}
                onKeyUp={this.onSubmit}
              />
            </div>
          </div>
          {this.state.loadingBooks && <Spinner />}
          <div className='search-books-results'>
            <BookShelf>
              {searchedBooks.length > 0 && !this.state.loadingBooks
                ? searchedBooks.map(book => (
                    <li key={book.id}>
                      <Book
                        title={book.title}
                        authors={book.authors}
                        cover={
                          book.imageLinks && book.imageLinks["smallThumbnail"]
                        }
                        handleChange={e => this.selectChangeHandler(e, book)}
                        selectValue={this.state.selectedShelf}
                      />
                    </li>
                  ))
                : !this.state.loadingBooks && <h2>Nothing to display</h2>}
            </BookShelf>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBooks;
