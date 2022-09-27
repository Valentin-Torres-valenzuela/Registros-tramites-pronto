import React, {useState} from 'react';
import uniquid from 'uniquid'
import axios from 'axios';

const AddUser = () => {

    const  [nombre, setNombre] = useState('');
    const  [apellido, setApellido] = useState('');
    const  [email, setEmail] = useState('');
    const  [DNI, setDNI] = useState('');
    
    function addUserF () {
        let user = {
            nombre,
            apellido,
            email,
            DNI,
            id: uniquid()
        }

        axios.post('api/user/adduser', user)
        .then (response => {
            alert(res.data)
        })
        .catch(error => {console.log(error)})
    }

    return (
    <div className="container">
        <div className="row">
            <h2 className="mt-3">Agregar un nuevo usuario</h2>
            <div className="col-sm-6 offset-3">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={nombre} onChange={(e) => {setNombre(e.target.value)}} required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input type="text" className="form-control" value={apellido} onChange={(e) => {setApellido(e.target.value)}} required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">DNI</label>
                    <input type="number" className="form-control" value={DNI} onChange={(e) => {setDNI(e.target.value)}}/>
                </div>

                <button className="btn btn-succes" onClick={addUserF}> Guardar</button>
                <button className="btn btn-danger"> Cancelar</button>
            </div>
        </div>
    </div>
    );
}

export default AddUser;