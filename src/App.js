import React from 'react'
import UserList from './components/UserList';
import AddUser from './components/addUser';
import EditUser from './components/EditUser';
import Login from './components/Login';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar/>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>} exact> </Route>
            <Route path="/" element={<UserList/>} exact> </Route>
            <Route path="/crear" element={<AddUser/>} exact></Route>
            <Route path="/editar/:id" element={<EditUser/>} exact></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
