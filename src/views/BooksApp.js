import React from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import Book from "../components/Book";
import BookShelf from "../components/BookShelf";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    allBooks: [],
    wantToread: [],
    currentlyReading: [],
    booksRead: [],
    loadingBooks: false,
    updateLoading: false,
    selectedShelf: "",
  };

  fetchBooks = async () => {
    this.setState({ loadingBooks: true });

    const res = await BooksAPI.getAll().catch(ex => {
      this.setState({ loadingBooks: false });
    });

    this.setState({ allBooks: res });

    this.setState({ loadingBooks: false });

    this.state.allBooks.map(book => {
      let shelfValue = "";
      if (book.shelf === "currentlyReading") {
        shelfValue = book.shelf;
        this.setState({
          currentlyReading: [...this.state.currentlyReading, book],
          selectedShelf: shelfValue,
        });
      }
      if (book.shelf === "wantToRead") {
        shelfValue = book.shelf;
        this.setState({
          wantToread: [...this.state.wantToread, book],
          selectedShelf: shelfValue,
        });
      }
      if (book.shelf === "read") {
        shelfValue = book.shelf;
        this.setState({
          booksRead: [...this.state.booksRead, book],
          selectedShelf: shelfValue,
        });
      }
    });
  };

  selectChangeHandler = (e, book) => {
    this.setState({
      selectedShelf: e.target.value,
    });
    this.updateBook(book, e.target.value);
  };

  removeItemAll = (arr, value) => {
    let i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  };

  updateBook = async (book, shelf) => {
    this.setState({ updateLoading: true });
    const oldshelf = book.shelf;

    await BooksAPI.update(book, shelf).then(() => {
      book.shelf = shelf;
      if (book.shelf === "currentlyReading") {
        this.setState({
          currentlyReading: [...this.state.currentlyReading, book],
        });
      }
      if (book.shelf === "wantToRead") {
        this.setState({
          wantToread: [...this.state.wantToread, book],
        });
      }
      if (book.shelf === "read") {
        this.setState({
          booksRead: [...this.state.booksRead, book],
        });
      }
      this.setState({ updateLoading: false });
    });

    if (oldshelf === "currentlyReading") {
      const books = this.removeItemAll(this.state.currentlyReading, book);
      this.setState({ currentlyReading: [...books] });
    }
    if (oldshelf === "wantToRead") {
      const books = this.removeItemAll(this.state.wantToread, book);
      this.setState({ wantToread: [...books] });
    }
    if (oldshelf === "read") {
      const books = this.removeItemAll(this.state.booksRead, book);
      this.setState({ booksRead: [...books] });
    }
  };

  componentDidMount() {
    this.fetchBooks();
  }

  render() {
    const { wantToread, currentlyReading, booksRead } = this.state;

    return (
      <div className='app'>
        <div className='list-books'>
          <Header title='MyReads' />
          <div className='list-books-content'>
            <div>
              {this.state.loadingBooks ? (
                <Spinner />
              ) : (
                <>
                  <BookShelf bookshelfTitle='Currently Reading'>
                    {currentlyReading.length > 0 && !this.state.loadingBooks ? (
                      currentlyReading.map(book => (
                        <li key={book.id}>
                          <Book
                            title={book.title}
                            authors={book.authors}
                            cover={
                              book.imageLinks &&
                              book.imageLinks["smallThumbnail"]
                            }
                            handleChange={e =>
                              this.selectChangeHandler(e, book)
                            }
                            selectValue={this.state.selectedShelf}
                          />
                        </li>
                      ))
                    ) : (
                      <h2>No book on this shelf</h2>
                    )}
                  </BookShelf>

                  <BookShelf bookshelfTitle='Want to Read'>
                    {wantToread.length > 0 && !this.state.loadingBooks ? (
                      wantToread.map(book => (
                        <li key={book.id}>
                          <Book
                            title={book.title}
                            authors={book.authors}
                            cover={book.imageLinks["smallThumbnail"]}
                            handleChange={e =>
                              this.selectChangeHandler(e, book)
                            }
                            selectValue={this.state.selectedShelf}
                          />
                        </li>
                      ))
                    ) : (
                      <h2>No book on this shelf</h2>
                    )}
                  </BookShelf>

                  <BookShelf bookshelfTitle='Read'>
                    {booksRead.length > 0 && !this.state.loadingBooks ? (
                      booksRead.map(book => (
                        <li key={book.id}>
                          <Book
                            title={book.title}
                            authors={book.authors}
                            cover={book.imageLinks["smallThumbnail"]}
                            selectValue={this.state.selectedShelf}
                            handleChange={e =>
                              this.selectChangeHandler(e, book)
                            }
                          />
                        </li>
                      ))
                    ) : (
                      <h2>No book on this shelf</h2>
                    )}
                  </BookShelf>
                </>
              )}
            </div>
          </div>
          <div className='open-search'>
            <Link to='/search'>Add a book</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default BooksApp;
