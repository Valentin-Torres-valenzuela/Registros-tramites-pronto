import React, {useState, useEffect} from 'react';
import uniquid from 'uniquid';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isAuth } from './Auth';

const AddUser = () => {

    const  [nombre, setNombre] = useState('');
    const  [numRecibo, setNumRecibo] = useState('');
    const  [fecha, setFecha] = useState('');
    const  [totalPagosEfectuar, setTotalPagosEfectuar] = useState(0);
    const  [arancel, setArancel] = useState();
    const  total = parseFloat(totalPagosEfectuar) + parseFloat(arancel);
    const  [error, actualizarError] = useState(false);
    const  [disabled, actualizarDisabled] = useState(false);
    const  [servicios, setServicios] = useState([]);
    
    const navegar = useNavigate();

    useEffect(() => {
        const isInSession = async () => {
            const hasSession = await isAuth()
            console.log(hasSession);
            if(!hasSession) {
                navegar('/login')
            }
        }
        isInSession()
    }, [navegar])
    
    const crearServicio = servicio => {

        setServicios([
            ...servicios, 
            servicio
        ]);

        setTotalPagosEfectuar(totalPagosEfectuar + Number(servicio.importe));
    }
    
    const submitServicio = (e) => {
        e.preventDefault();
        
        const {servicio, importe, obs} = e.target;
        
        const _servicio = {
            servicio:servicio.value,
            importe: importe.value,
            obs: obs.value, 
            id: Date.now(),
        }
        
        crearServicio(_servicio);
        
        servicio.value = ''
        importe.value = null
        obs.value = ''
    }
    
    
    const serviceList = () => {
        
        return (
            <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Servicio</th>
                        <th scope="col">Importe</th>
                        <th scope="col">Observacion</th>
                        </tr>
                    </thead>
                    <tbody>
                    {servicios.map(service => 
                        <tr key={service.id}>
                            <td>{service.servicio}</td>
                            <td>{service.importe}</td>
                            <td>{service.obs}</td>
                            <td><button className="btn btn-sm btn-danger h-50"><i className="fa-solid fa-trash" onClick={() => deleteService(service)}></i></button></td>
                        </tr>)
                        }
                    </tbody>
            </table>
            )
        }
        
    const deleteService = (_service) => {
        const newServices = servicios.filter(servicio => servicio.id !== _service.id)
        setServicios(newServices);
        setTotalPagosEfectuar(totalPagosEfectuar - Number(_service.importe));
    }

    async function addUserF () {
        let user = {
            nombre,
            numRecibo,
            fecha,
            servicios,
            totalPagosEfectuar,
            arancel,
            total,
            id: uniquid()
        }

        console.log(user);

        try {
            await axios.post('user/adduser', user)
            Swal.fire('Correcto','Registro credo correctamente')
            navegar('/')
        } catch (error) {
            console.log(error)
        }
    }

    const submitRegistro = (e) => {
        e.preventDefault();
        
        if (nombre.trim() === '' || numRecibo.trim() === '' || fecha.trim() === '' || servicios.length === 0 || totalPagosEfectuar <= 0 || arancel === undefined) {
            actualizarError(true);
            return;
        }
        
        actualizarError(false);
        
        actualizarDisabled(true);
        
        addUserF();
        
        actualizarDisabled(false);
    }


    return (
    <div className="container">
        <div className="row">
            <h4 className="mt-3">Agregar un nuevo usuario</h4>
            {error ? <p className = "alert alert-danger my-4">Todos los campos son obligatorios</p> : null}
            <div className="col-sm-6 offset-3">
                <div className="mb-3">
                    <label className="form-label" htmlFor="numRecibo">Número de recibo</label>
                <div className="d-flex ">
                    <input disabled type="text" className="w-25 form-control rounded-0" value="Nº 0001 - 00"/>
                    <input type="number" className="form-control w-75 rounded-0" onChange={(e) => {setNumRecibo(e.target.value)}} required placeholder="XXXX"/>
                </div>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="nombre">Nombre y apellido</label>
                    <input type="text" className="form-control" style={{textTransform: 'uppercase'}} onChange={(e) => {setNombre(e.target.value.toUpperCase())}} required placeholder="Ej: Cecilia Raiola"/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="fecha">Fecha de carga</label>
                    <input type="date" className="form-control" onChange={(e) => {setFecha(e.target.value)}}  required/>
                </div>
                {serviceList()}
                <form className="d-flex justify-content-around align-items-end" onSubmit={e => submitServicio(e)}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="servicios">Servicio</label>
                        <input type="text" className="form-control" name="servicio" placeholder="Servicio" required/>
                    </div>
                    <div className="mb-3 mx-2">
                        <label className="form-label" htmlFor="servicios">Importe</label>
                        <input type="number" className="form-control" name="importe" placeholder="importe" required/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="servicios">Observacion</label>
                        <input type="text" className="form-control" name="obs" placeholder="Observacion" required/>
                    </div>
                    <div className="mb-3 mx-2">
                        <button className="btn btn-info h-50"><i className="fa-solid fa-plus"></i></button>
                    </div>
                </form>
                <div className="mb-3">
                    <label className="form-label" htmlFor="totalPagosEfectuar">Total pagos a efectuar</label>
                    <input type="number" className="form-control" disabled required placeholder="Monto total pagos a efectuar"/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="arancel">Arancel</label>
                    <input type="number" className="form-control" onChange={(e) => {setArancel(e.target.value)}} required placeholder="Monto arancel"/>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="total">Total</label>
                    <input type="number" className="form-control" value={total} disabled />
                </div>
                {disabled ? <button className="btn btn-success disabled m-3" onClick={submitRegistro}>Guardar</button> : <button className="m-3 btn btn-success" onClick={submitRegistro}>Guardar</button>}
                <button onClick={e => window.history.back()} className="btn btn-danger m-3">Cancelar</button>
            </div>
        </div>
    </div>
    );
}

export default AddUser;