import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from './axios';

const Login = () => {

    const [error, actualizarError] = useState(false);
    const navegar = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitSession = async (e) => {
        
        e.preventDefault();

        const user = {
            email,
            password
        }

        try {
            const res = await axios.post("auth", user)
            localStorage.setItem('token', res.data.token)
            navegar('/')
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <div className="container">
            {error ? <p className = "alert alert-danger my-4">Ese usuario no es el usuario maestro</p> : null}
            <div className="my-4">
                <label className="form-label" htmlFor="nombre">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => {setEmail(e.target.value)}} required placeholder="Ingrese su email"/>
            </div>
            <div className="my-4">
                <label className="form-label" htmlFor="nombre">Contraseña</label>
                <input type="password" className="form-control" value={password} onChange={(e) => {setPassword(e.target.value)}} required placeholder="Ingrese su contraseña"/>
            </div>
            <button className="my-2 btn btn-info w-100 text-center" onClick={submitSession}>Ingresar</button>
        </div>
    );
}

export default Login;