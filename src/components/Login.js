import React, { useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navegar = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Todos los campos son obligatorios', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }

        try {
            const res = await axios.post('auth', { email, password });
            localStorage.setItem('token', res.data.token);
            navegar('/');
        } catch (error) {
            toast.error('Credenciales inválidas', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        }
    }

    return (
        <div className="container py-5">
            <ToastContainer />
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <h4 style={{color: '#210B65'}}>Iniciar sesión</h4>
                                <p className="text-secondary small">Ingresa tus credenciales para continuar</p>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small" style={{color: '#210B65'}}>Email</label>
                                    <div className="position-relative">
                                        <input
                                            type="email"
                                            className="form-control form-control-sm border-secondary"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                        />
                                        {email && (
                                            <button 
                                                type="button"
                                                className="btn btn-sm position-absolute end-0 top-0 h-100 text-secondary"
                                                onClick={() => setEmail('')}
                                                style={{border: 'none'}}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small" style={{color: '#210B65'}}>Contraseña</label>
                                    <div className="position-relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control form-control-sm border-secondary"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <div className="position-absolute end-0 top-0 h-100 d-flex">
                                            <button 
                                                type="button"
                                                className="btn btn-sm h-100 text-secondary"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{border: 'none'}}
                                            >
                                                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                            {password && (
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm h-100 text-secondary"
                                                    onClick={() => setPassword('')}
                                                    style={{border: 'none'}}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="btn btn-sm w-100"
                                    style={{backgroundColor: '#210B65', color: 'white'}}
                                >
                                    Ingresar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;