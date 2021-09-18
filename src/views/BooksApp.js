import React from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
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
  };

  fetchBooks = async () => {
    this.setState({ loadingBooks: true });

    const res = await BooksAPI.getAll();

    if (res.error) {
      this.setState({ allBooks: [], loadingBooks: false });
      return;
    }

    this.setState({ allBooks: res });

    this.setState({ loadingBooks: false });

    this.state.allBooks.length > 0 &&
      this.state.allBooks.forEach(book => {
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
      });
  };

  selectChangeHandler = (e, book) => {
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
    const {
      wantToread,
      currentlyReading,
      booksRead,
      loadingBooks,
    } = this.state;

    return <div className='app'>
        <div className='list-books'>
          <Header title='MyReads' />
          <div className='list-books-content'>
            <div>
              {this.state.loadingBooks ? <Spinner /> : <>
                  <BookShelf shelf={currentlyReading} bookshelfTitle='Currently Reading' loadingBooks={loadingBooks} handleChange={this.selectChangeHandler} isEmptyMsg='No book on this shelf' />
                  <BookShelf shelf={wantToread} bookshelfTitle='Want to Read' loadingBooks={loadingBooks} handleChange={this.selectChangeHandler} isEmptyMsg='No book on this shelf' />
                  <BookShelf shelf={booksRead} bookshelfTitle='Read' loadingBooks={loadingBooks} handleChange={this.selectChangeHandler} isEmptyMsg='No book on this shelf' />
                </>}
            </div>
          </div>
          <div className='open-search'>
            <Link to='/search'>Add a book</Link>
          </div>
        </div>
      </div>;
  }
}

export default BooksApp;
