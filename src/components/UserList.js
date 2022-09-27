import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Filters from './Filters';
import User from './User';

const UserList = () => {

    const [dataUsuarios, setDatausuarios] = useState([]);

    useEffect(() => {
        axios.get('/api/user/obtainuser')
        .then(res => {
            setDatausuarios(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const usersList = dataUsuarios.map(user => {
        return (
            <div>
                <User user={user}/>
            </div>
        )
    })

    return ( 
        <>
        <div className="row d-flex justify-content-around align-items-center">
            <div className="col-8">
                <Filters/>
            </div>
            <div className="col-4">
                <button onClick={crearRegistro} className="btn rounded-0 btn-success btn-lg p-2">Nuevo registro <i className="fa-solid fa-plus"></i></button>
            </div>
        </div>

        <table class="table table-hover table-striped">
            <thead className='table-dark'>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">DNI</th>
                    <th scope="col">Email</th>
                    <th scope="col">Fecha de carga</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {usersList}
            </tbody>
        </table>
        </>
    );
}

export default UserList;