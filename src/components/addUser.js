import React, {useState, useEffect} from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isAuth } from './Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatableSelect from 'react-select/creatable';
import { serviciosPredefinidos } from '../data/servicios';

const AddUser = () => {

    const  [nombre, setNombre] = useState('');
    const  [numRecibo, setNumRecibo] = useState('3738');
    const  [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const  [totalPagosEfectuar, setTotalPagosEfectuar] = useState(0);
    const  [arancel, setArancel] = useState(0);
    const  total = parseFloat(totalPagosEfectuar) + parseFloat(arancel);
    const  [disabled, actualizarDisabled] = useState(false);
    const  [servicios, setServicios] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    
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

    useEffect(() => {
        const getLastReceipt = async () => {
            try {
                const res = await axios.get('user/obtainuser?page=0&nombre=&fechaD=&fechaH=');
                if (res.data.users && res.data.users.length > 0) {
                    const lastReceipt = Math.max(...res.data.users.map(user => parseInt(user.numRecibo)));
                    if (!isNaN(lastReceipt)) {
                        setNumRecibo((lastReceipt + 1).toString());
                    }
                }
            } catch (error) {
                console.error('Error al obtener el último número de recibo:', error);
            }
        };
        getLastReceipt();
    }, []);
    
    const crearServicio = servicio => {
        setServicios([
            ...servicios, 
            servicio
        ]);

        setTotalPagosEfectuar(totalPagosEfectuar + Number(servicio.importe));
    }
    
    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '31px',
            height: '31px',
            borderColor: '#dee2e6'
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '31px',
            padding: '0 6px'
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px'
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: '31px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '0.875rem',
            color: state.isSelected ? 'white' : '#210B65',
            backgroundColor: state.isSelected ? '#210B65' : state.isFocused ? '#f8f9fa' : 'white'
        })
    };

    const handleServiceChange = (newValue, actionMeta) => {
        if (actionMeta.action === 'clear') {
            setSelectedService(null);
        } else {
            setSelectedService(newValue);
        }
    };

    const submitServicio = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const importe = formData.get('importe');
        const obs = formData.get('obs');
        
        let servicioValue = '';
        if (selectedService) {
            servicioValue = selectedService.value || selectedService.inputValue;
        }
        
        if (!servicioValue) {
            toast.error('Debe seleccionar o escribir un servicio', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }
        
        const _servicio = {
            servicio: servicioValue.toUpperCase(),
            importe: importe,
            obs: obs, 
            id: Date.now(),
        }
        
        crearServicio(_servicio);
        
        // Reset form
        setSelectedService(null);
        e.target.reset();
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

    const submitRegistro = async (e) => {
        e.preventDefault();
        
        if (nombre.trim() === '' || numRecibo.trim() === '' || fecha.trim() === '' || servicios.length === 0 || totalPagosEfectuar <= 0 || arancel === undefined) {
            toast.error('Todos los campos son obligatorios', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        
        actualizarDisabled(true);
        
        try {
            let user = {
                nombre,
                numRecibo,
                fecha,
                servicios,
                totalPagosEfectuar,
                arancel,
                total,
                id: Date.now().toString()
            }
            
            await axios.post('user/adduser', user);
            toast.success('Factura creada con éxito', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                navegar('/');
            }, 2000);
        } catch (error) {
            toast.error('Error al crear la factura', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.log(error);
            actualizarDisabled(false);
        }
    }


    return (
        <div className="container py-3">
            <ToastContainer />
            <div className="row">
                <div className="col-12">
                    {/* No se muestra el estado de error */}
                </div>
                <div className="col-12 col-lg-8 offset-lg-2">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-3">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="mb-3">
                                    <label className="form-label" style={{color: '#210B65'}} htmlFor="numRecibo">Número de recibo</label>
                                    <div className="d-flex">
                                        <input disabled type="text" 
                                            className="form-control rounded-0" 
                                            style={{
                                                backgroundColor: '#e9ecef',
                                                width: '130px'
                                            }}
                                            value="Nº 0001 - 00"/>
                                        <input type="number" className="form-control rounded-0 border-secondary" 
                                            value={numRecibo}
                                            onChange={(e) => {setNumRecibo(e.target.value)}} 
                                            maxLength="5"
                                            onInput={(e) => {
                                                if (e.target.value.length > 5)
                                                    e.target.value = e.target.value.slice(0,5);
                                            }}
                                            disabled
                                            required placeholder="XXXXX"/>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{color: '#210B65'}} htmlFor="nombre">Nombre y apellido</label>
                                    <input type="text" className="form-control border-secondary text-uppercase" 
                                        onChange={(e) => {setNombre(e.target.value.toUpperCase())}} 
                                        required placeholder="Ej: CECILIA RAIOLA"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{color: '#210B65'}} htmlFor="fecha">Fecha de carga</label>
                                    <input type="date" className="form-control border-secondary" 
                                        value={fecha}
                                        onChange={(e) => {setFecha(e.target.value)}} 
                                        required/>
                                </div>
                            </form>

                            <div className="card mb-3">
                                <div className="card-header py-2" style={{backgroundColor: '#210B65'}}>
                                    <h6 className="mb-0 text-white">Lista de Servicios</h6>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive" style={{height: '250px'}}>
                                        <table className="table table-hover mb-0">
                                            <thead style={{backgroundColor: '#f8f9fa'}}>
                                                <tr>
                                                    <th scope="col" className="px-3">Servicio</th>
                                                    <th scope="col" className="px-3">Importe</th>
                                                    <th scope="col" className="px-3">Observación</th>
                                                    <th scope="col" className="px-3">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {servicios.map(service => 
                                                    <tr key={service.id}>
                                                        <td className="px-3">{service.servicio}</td>
                                                        <td className="px-3">{service.importe}</td>
                                                        <td className="px-3">{service.obs}</td>
                                                        <td className="px-3">
                                                            <button className="btn btn-sm text-danger" onClick={() => deleteService(service)}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <form className="card mb-3 p-3" style={{backgroundColor: '#f8f9fa'}} onSubmit={e => submitServicio(e)}>
                                <div className="row g-2">
                                    <div className="col-12 col-sm-4">
                                        <label className="form-label small" style={{color: '#210B65'}} htmlFor="servicios">Servicio</label>
                                        <CreatableSelect
                                            name="servicio"
                                            options={serviciosPredefinidos}
                                            styles={customStyles}
                                            placeholder="Seleccione o escriba..."
                                            noOptionsMessage={() => "No se encontraron servicios"}
                                            isClearable
                                            isSearchable
                                            formatCreateLabel={(inputValue) => `Crear "${inputValue.toUpperCase()}"`}
                                            onInputChange={(inputValue) => inputValue.toUpperCase()}
                                            onChange={handleServiceChange}
                                            value={selectedService}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                    <div className="col-12 col-sm-3">
                                        <label className="form-label small" style={{color: '#210B65'}} htmlFor="servicios">Importe</label>
                                        <input type="number" className="form-control form-control-sm border-secondary" 
                                            name="importe" placeholder="Importe" required/>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <label className="form-label small" style={{color: '#210B65'}} htmlFor="servicios">Observación</label>
                                        <input type="text" className="form-control form-control-sm border-secondary" 
                                            name="obs" placeholder="Observación" defaultValue="" />
                                    </div>
                                    <div className="col-12 col-sm-1 d-flex align-items-end">
                                        <button className="btn btn-sm w-100" style={{backgroundColor: '#210B65', color: 'white'}}>
                                            <i className="fa-solid fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="row g-2 mb-3">
                                <div className="col-12 col-sm-4">
                                    <label className="form-label small" style={{color: '#210B65'}} htmlFor="totalPagosEfectuar">Total pagos a efectuar</label>
                                    <input type="number" value={totalPagosEfectuar} 
                                        className="form-control form-control-sm" 
                                        style={{backgroundColor: '#e9ecef'}}
                                        disabled required 
                                        placeholder="Monto total pagos a efectuar"/>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <label className="form-label small" style={{color: '#210B65'}} htmlFor="arancel">Arancel</label>
                                    <input type="number" className="form-control form-control-sm border-secondary" 
                                        onChange={(e) => {setArancel(e.target.value)}} 
                                        required placeholder="Monto arancel"/>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <label className="form-label small" style={{color: '#210B65'}} htmlFor="total">Total</label>
                                    <input type="number" 
                                        className="form-control form-control-sm text-white" 
                                        style={{
                                            backgroundColor: '#210B65',
                                            color: 'white !important',
                                            caretColor: 'white'
                                        }}
                                        value={total} 
                                        disabled />
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-end">
                                <button onClick={e => window.history.back()} 
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{width: '100px'}}>
                                    Cancelar
                                </button>
                                <button type="button"
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: disabled ? '#6c757d' : '#210B65', 
                                        color: 'white',
                                        width: '100px'
                                    }} 
                                    onClick={submitRegistro}
                                    disabled={disabled}>
                                    {disabled ? (
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Guardando...</span>
                                        </div>
                                    ) : (
                                        'Guardar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUser;