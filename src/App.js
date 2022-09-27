import React from 'react'
import UserList from './components/UserList';
import AddUser from './components/addUser';
import EditUser from './components/EditUser';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
    <NavBar/>
    <UserList/>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={UserList} exact></Route>
          <Route path="/crear" element={AddUser} exact></Route>
          <Route path="/editar/:id" element={EditUser} exact></Route>
        </Routes>
      </BrowserRouter> */}
    </>
  );
}

export default App;
