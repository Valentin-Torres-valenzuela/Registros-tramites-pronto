import React from 'react';
import {Link} from 'react-router-dom';

const User = ({user}) => {
    return ( 
        <>
        <tr>
            <th scope="row">{user.uniquid}</th>
            <td>{user.nombre}</td>
            <td>{user.apellido}</td>
            <td>{user.email}</td>
            <td>{user.DNI}</td>
            <td>{user.DNI}</td>
            <td>
                <Link to={`/editar/${user.uniquid}`} className="btn mx-2 btn-warning"><i className="fa-solid fa-pen-to-square"></i></Link>
            </td>
        </tr>
        </>
    );
}

export default User;