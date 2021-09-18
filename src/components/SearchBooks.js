import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import BookShelf from "./BookShelf";
import Book from "./Book";
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
                 booksIncluded = book.title.includes(queryValue) || (book.hasOwnProperty("authors") && book.authors.map(
                       author => author.includes(queryValue)
                     ));
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
           const { searchedBooks } = this.state;

           return <div className='App'>
               <div className='search-books'>
                 <div className='search-books-bar'>
                   <Link to='/' className='close-search' />
                   <div className='search-books-input-wrapper'>
                     <input type='text' placeholder='Search by title or author' onChange={e => this.onchangeHandler(e)} />
                   </div>
                 </div>
                 {this.state.loadingBooks && <Spinner />}
                 <div className='search-books-results'>
                   <BookShelf>
                     {this.state.query.length > 0 && searchedBooks.length > 0 && !this.state.loadingBooks ? searchedBooks.map(
                           book => (
                             <li key={book.id}>
                               <Book
                                 book={book}
                                 cover={
                                   book.imageLinks &&
                                   book.imageLinks["smallThumbnail"]
                                 }
                                 handleChange={e =>
                                   this.selectChangeHandler(e, book)
                                 }
                               />
                             </li>
                           )
                         ) : !this.state.loadingBooks && <h2>
                             Nothing to display
                           </h2>}
                   </BookShelf>
                 </div>
               </div>
             </div>;
         }
       }

export default SearchBooks;
