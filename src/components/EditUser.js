import React, { useState, useEffect } from 'react';
import axios from './axios';
import { useNavigate, useParams } from 'react-router-dom';
import { isAuth } from './Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatableSelect from 'react-select/creatable';
import { serviciosPredefinidos } from '../data/servicios';

const EditUser = () => {
    const [nombre, setNombre] = useState('');
    const [numRecibo, setNumRecibo] = useState('');
    const [servicios, setServicios] = useState([]);
    const [totalPagosEfectuar, setTotalPagosEfectuar] = useState(0);
    const [arancel, setArancel] = useState(0);
    const [total, setTotal] = useState(0);
    const [fecha, setFecha] = useState(new Date());
    const [disabled, setDisabled] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    
    const navegar = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const isInSession = async () => {
            const hasSession = await isAuth()
            if(!hasSession) {
                navegar('/login')
            }
        }
        isInSession()
    }, [navegar])

    useEffect(() => {
        const getUsuario = async () => {
            try {
                const res = await axios.get(`user/obtaindatauser/${id}`);
                const user = res.data;
                if (user) {
                    setNombre(user.nombre || '');
                    setNumRecibo(user.numRecibo || '');
                    setServicios(user.servicios || []);
                    setTotalPagosEfectuar(Number(user.totalPagosEfectuar) || 0);
                    setArancel(Number(user.arancel) || 0);
                    setTotal(Number(user.total) || 0);
                    setFecha(user.fecha ? new Date(user.fecha) : new Date());
                }
            } catch (error) {
                console.error('Error al obtener el registro:', error);
                toast.error('Error al obtener el registro', {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
                setTimeout(() => navegar('/'), 3000);
            }
        };
        if (id) {
            getUsuario();
        }
    }, [id, navegar]);

    const handleServicioChange = (index, field, value) => {
        const newServicios = [...servicios];
        newServicios[index][field] = value;
        setServicios(newServicios);
        
        const nuevoTotal = newServicios.reduce((sum, servicio) => sum + Number(servicio.importe || 0), 0);
        setTotalPagosEfectuar(nuevoTotal);
        setTotal(nuevoTotal + Number(arancel));
    };

    const handleServiceChange = (newValue, actionMeta) => {
        if (actionMeta.action === 'clear') {
            setSelectedService(null);
        } else {
            setSelectedService(newValue);
        }
    };

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

    const addServicio = (e) => {
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

        const newServicio = {
            servicio: servicioValue.toUpperCase(),
            importe: Number(importe),
            obs: obs || 'N/A',
            id: Date.now()
        };

        const nuevosServicios = [...servicios, newServicio];
        setServicios(nuevosServicios);

        const nuevoTotalPagos = nuevosServicios.reduce((sum, serv) => sum + Number(serv.importe || 0), 0);
        setTotalPagosEfectuar(nuevoTotalPagos);
        setTotal(nuevoTotalPagos + Number(arancel));

        // Reset form
        setSelectedService(null);
        e.target.reset();
    };

    const removeServicio = (index) => {
        const nuevosServicios = servicios.filter((_, i) => i !== index);
        setServicios(nuevosServicios);
        
        const nuevoTotalPagos = nuevosServicios.reduce((sum, servicio) => sum + Number(servicio.importe || 0), 0);
        setTotalPagosEfectuar(nuevoTotalPagos);
        setTotal(nuevoTotalPagos + Number(arancel));
    };

    const editUser = async (e) => {
        e.preventDefault();
        
        if (nombre.trim() === '' || numRecibo.trim() === '' || servicios.length === 0) {
            toast.error('Todos los campos son obligatorios', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }

        setDisabled(true);
        
        const updatedUser = {
            nombre: nombre.trim(),
            numRecibo: numRecibo.trim(),
            servicios: servicios.map(s => ({
                ...s,
                importe: Number(s.importe)
            })),
            totalPagosEfectuar: Number(totalPagosEfectuar),
            arancel: Number(arancel),
            total: Number(total),
            fecha: fecha.toISOString()
        };

        try {
            await axios.patch(`user/updateuser/${id}`, updatedUser);
            toast.success('Factura editada correctamente', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            setTimeout(() => {
                navegar('/');
            }, 2000);
        } catch (error) {
            console.error('Error al editar:', error);
            toast.error('Error al editar la factura', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            setDisabled(false);
        }
    };

    return (
        <div className="container py-3">
            <ToastContainer />
            <div className="row">
                <div className="col-12 col-lg-8 offset-lg-2">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-3">
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
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value.toUpperCase())} 
                                    required placeholder="Ej: CECILIA RAIOLA"/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{color: '#210B65'}} htmlFor="fecha">Fecha de carga</label>
                                <input type="date" className="form-control border-secondary" 
                                    value={fecha.toISOString().split('T')[0]}
                                    onChange={(e) => setFecha(new Date(e.target.value))} 
                                    required/>
                            </div>

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
                                                {servicios.map((servicio, index) => (
                                                    <tr key={servicio.id || index}>
                                                        <td className="px-3">{servicio.servicio}</td>
                                                        <td className="px-3">{servicio.importe}</td>
                                                        <td className="px-3">{servicio.obs}</td>
                                                        <td className="px-3">
                                                            <button className="btn btn-sm text-danger" onClick={() => removeServicio(index)}>
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <form className="card mb-3 p-3" style={{backgroundColor: '#f8f9fa'}} onSubmit={addServicio}>
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
                                            required
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
                                            name="obs" placeholder="Observación" defaultValue="N/A" required/>
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
                                        value={arancel}
                                        onChange={(e) => {
                                            setArancel(e.target.value);
                                            setTotal(totalPagosEfectuar + Number(e.target.value));
                                        }} 
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
                                <button onClick={() => navegar('/')} 
                                    className="btn btn-sm btn-outline-secondary"
                                    style={{width: '100px'}}>
                                    Cancelar
                                </button>
                                <button 
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: disabled ? '#6c757d' : '#210B65', 
                                        color: 'white',
                                        width: '100px'
                                    }} 
                                    onClick={editUser}
                                    disabled={disabled}>
                                    {disabled ? (
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Guardando...</span>
                                        </div>
                                    ) : (
                                        'Actualizar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUser; 