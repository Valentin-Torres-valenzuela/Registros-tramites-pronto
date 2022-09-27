import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const EditUser = () => {

    const params = useParams();

    const  [nombre, setNombre] = useState('');
    const  [apellido, setApellido] = useState('');
    const  [email, setEmail] = useState('');
    const  [DNI, setDNI] = useState('');

    useEffect(() => {
        axios.post('api/user/obtaindatauser', {id: params.id})
        .then(res => {
            const dataUser = res.data
            setNombre(dataUser.nombre);
            setApellido(dataUser.apellido);
            setEmail(dataUser.email);
            setDNI(dataUser.DNI);
        })
        .catch(err => {console.log(err)});
    }, [])

    return ( 
        <>
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

                        <button className="btn btn-succes" onClick={addUserF}>Guardar</button>
                        <button className="btn btn-danger"> Cancelar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditUser;