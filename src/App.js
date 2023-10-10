import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Edit from './Edit';
import View from './View';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <ToastContainer display="flex" position='top-center'/>
        <Routes>
          <Route exact path="/" Component={Home}/>
          <Route path='/add' Component={Edit}/>
          <Route path='/update/:id' Component={Edit}/>
          <Route path='/view/:id' Component={View}/>
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
