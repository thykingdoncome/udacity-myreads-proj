import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
// import * as BooksAPI from './BooksAPI'
import "./App.css"
import BooksApp from "./views/BooksApp"
import SearchBooks from "./components/SearchBooks"

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path='/' component={BooksApp} />
          <Route exact path='/search' component={SearchBooks} />
        </Switch>
      </Router>
    </>
  )
}

export default App
