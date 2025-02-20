import React, {useState, useEffect} from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import User from './User';
import { isAuth } from './Auth';
import Swal from 'sweetalert2';

const UserList = () => {
    
    const [filterUser, setFilterUser] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [nombre, setNombre] = useState('');
    const [fechaD, setFechaD] = useState('');
    const [fechaH, setFechaH] = useState('');
    const navegar = useNavigate();
    const [numberOfPages, setNumberOfPages] = useState(0);
    let [arancelTotal, setArancelTotal] = useState(0);
    
    // Función para generar el rango de páginas a mostrar
    const getPageRange = () => {
        const range = [];
        const maxPagesToShow = 9; // Aumentamos a 9 para mostrar más números
        
        if (numberOfPages <= maxPagesToShow) {
            // Si hay menos páginas que el máximo a mostrar, mostrar todas
            for (let i = 0; i < numberOfPages; i++) {
                range.push(i);
            }
        } else {
            // Calcular el rango de páginas a mostrar
            let start = Math.max(0, pageNumber - Math.floor(maxPagesToShow / 2));
            let end = Math.min(numberOfPages - 1, start + maxPagesToShow - 1);
            
            // Ajustar el inicio si estamos cerca del final
            if (end === numberOfPages - 1) {
                start = Math.max(0, end - maxPagesToShow + 1);
            }
            
            // Ajustar el final si estamos cerca del inicio
            if (start === 0) {
                end = Math.min(numberOfPages - 1, maxPagesToShow - 1);
            }
            
            // Si estamos en las primeras 8 páginas, mostrar desde el inicio
            if (pageNumber < 8) {
                start = 0;
                end = 8;
            }
            
            // Si estamos en las últimas 8 páginas, mostrar hasta el final
            if (pageNumber >= numberOfPages - 8) {
                start = numberOfPages - 9;
                end = numberOfPages - 1;
            }
            
            for (let i = start; i <= end; i++) {
                range.push(i);
            }
        }
        
        return range;
    };

    const getData = (page=``) => {
        axios.get(`user/obtainuser?page=${page}&nombre=${nombre}&fechaD=${fechaD}&fechaH=${fechaH}`)
        .then(res => {
            let total = 0;
            res.data.users.forEach(user => {
                total += user.arancel
            });
            setArancelTotal(total);
            setFilterUser(res.data.users);
            setNumberOfPages(res.data.totalPages);
        })
        .catch(err => {
            console.log(err);
        })
    }

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
        getData();
    }, [nombre, fechaD, fechaH])

    const prevPage = () => {
        const newPage = Math.max(0, pageNumber - 1);
        setPageNumber(newPage);
        getData(newPage);
    }
    
    const nextPage = () => { 
        const newPage = Math.min(numberOfPages - 1, pageNumber + 1);
        setPageNumber(newPage);
        getData(newPage);
    }

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`user/deleteuser/${userId}`);
            Swal.fire({
                title: '¡Eliminado!',
                text: 'El registro ha sido eliminado.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            getData(); // Actualizar la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el registro.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const Pagination = () => (
        <div className="d-flex justify-content-center align-items-center py-3 px-3" style={{backgroundColor: '#f8f9fa'}}>
            <button 
                onClick={prevPage} 
                className="btn btn-sm d-flex align-items-center justify-content-center mx-1"
                style={{
                    color: pageNumber === 0 ? '#6c757d' : '#210B65',
                    border: '1px solid',
                    borderColor: pageNumber === 0 ? '#6c757d' : '#210B65',
                    backgroundColor: 'white',
                    width: '40px',
                    height: '40px',
                    padding: 0
                }}
                disabled={pageNumber === 0}
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            {pageNumber >= 8 && (
                <button 
                    onClick={() => {setPageNumber(0); getData(0)}} 
                    className="btn btn-sm d-flex align-items-center justify-content-center mx-1"
                    style={{
                        color: '#210B65',
                        border: '1px solid #210B65',
                        backgroundColor: 'white',
                        width: '40px',
                        height: '40px',
                        padding: 0
                    }}
                >
                    1
                </button>
            )}

            {getPageRange().map((pageIndex) => (
                <button 
                    key={pageIndex}
                    onClick={() => {setPageNumber(pageIndex); getData(pageIndex)}} 
                    className="btn btn-sm d-flex align-items-center justify-content-center mx-1"
                    style={{
                        backgroundColor: pageIndex === pageNumber ? '#210B65' : 'white',
                        color: pageIndex === pageNumber ? 'white' : '#210B65',
                        border: '1px solid #210B65',
                        width: '40px',
                        height: '40px',
                        padding: 0
                    }}
                >
                    {pageIndex + 1}
                </button>
            ))}

            {pageNumber < numberOfPages - 8 && (
                <button 
                    onClick={() => {setPageNumber(numberOfPages - 1); getData(numberOfPages - 1)}} 
                    className="btn btn-sm d-flex align-items-center justify-content-center mx-1"
                    style={{
                        color: '#210B65',
                        border: '1px solid #210B65',
                        backgroundColor: 'white',
                        width: '40px',
                        height: '40px',
                        padding: 0
                    }}
                >
                    {numberOfPages}
                </button>
            )}

            <button 
                onClick={nextPage} 
                className="btn btn-sm d-flex align-items-center justify-content-center mx-1"
                style={{
                    color: pageNumber === numberOfPages - 1 ? '#6c757d' : '#210B65',
                    border: '1px solid',
                    borderColor: pageNumber === numberOfPages - 1 ? '#6c757d' : '#210B65',
                    backgroundColor: 'white',
                    width: '40px',
                    height: '40px',
                    padding: 0
                }}
                disabled={pageNumber === numberOfPages - 1}
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );

    return ( 
        <>
            <div className="container py-3 px-2 px-sm-3">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-2 p-sm-3">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h5 className="mb-3" style={{color: '#210B65'}}>Filtros de búsqueda</h5>
                                <div className="row g-3">
                                    <div className="col-12 col-md-4">
                                        <label className="form-label small" style={{color: '#210B65'}}>Nombre / Apellido</label>
                                        <div className="position-relative">
                                            <input 
                                                value={nombre}
                                                onChange={e => {
                                                    setNombre(e.target.value.toUpperCase());
                                                    if(e.target.value === '') {
                                                        getData();
                                                    }
                                                }} 
                                                type="text" 
                                                className="form-control form-control-sm border-secondary text-uppercase" 
                                                placeholder="Buscar por nombre..."/>
                                            {nombre && (
                                                <button 
                                                    className="btn btn-sm position-absolute end-0 top-0 h-100 text-secondary"
                                                    onClick={() => {
                                                        setNombre('');
                                                        getData();
                                                    }}
                                                    style={{border: 'none'}}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <label className="form-label small" style={{color: '#210B65'}}>Fecha desde</label>
                                        <div className="position-relative">
                                            <input 
                                                value={fechaD}
                                                type="date" 
                                                onChange={e => {
                                                    setFechaD(e.target.value);
                                                    if(e.target.value === '') {
                                                        getData();
                                                    }
                                                }} 
                                                className="form-control form-control-sm border-secondary"/>
                                            {fechaD && (
                                                <button 
                                                    className="btn btn-sm position-absolute end-0 top-0 h-100 text-secondary"
                                                    onClick={() => {
                                                        setFechaD('');
                                                        getData();
                                                    }}
                                                    style={{border: 'none'}}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <label className="form-label small" style={{color: '#210B65'}}>Fecha hasta</label>
                                        <div className="position-relative">
                                            <input 
                                                value={fechaH}
                                                type="date" 
                                                onChange={e => {
                                                    setFechaH(e.target.value);
                                                    if(e.target.value === '') {
                                                        getData();
                                                    }
                                                }} 
                                                className="form-control form-control-sm border-secondary"/>
                                            {fechaH && (
                                                <button 
                                                    className="btn btn-sm position-absolute end-0 top-0 h-100 text-secondary"
                                                    onClick={() => {
                                                        setFechaH('');
                                                        getData();
                                                    }}
                                                    style={{border: 'none'}}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-2 d-flex align-items-end">
                                        <a 
                                            href='/crear' 
                                            className="btn btn-sm w-100" 
                                            style={{backgroundColor: '#210B65', color: 'white'}}>
                                            <i className="fa-solid fa-plus me-2"></i>
                                            Nuevo registro
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="d-flex align-items-center flex-wrap gap-2">
                                    <h6 className="mb-0" style={{color: '#210B65'}}>Arancel total</h6>
                                    <div className="px-4 py-2 rounded" style={{backgroundColor: '#210B65', color: 'white'}}>
                                        $ {arancelTotal}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Pagination />

                        <div className="row px-0 px-sm-4 py-4" style={{backgroundColor: '#F8F9FA'}}>
                            {filterUser?.length > 0 ? (
                                filterUser.map(user => (
                                    <div key={user.id} className="col-12 col-xl-6 px-0 px-sm-2 mb-4 mb-xl-5">
                                        <User user={user} onDelete={handleDelete}/>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-4">
                                    <div className="alert mb-0 py-3" style={{backgroundColor: '#f8f9fa', border: '1px dashed #210B65'}}>
                                        <i className="fa-solid fa-search me-2" style={{color: '#210B65'}}></i>
                                        <span style={{color: '#210B65'}}>No se encontraron registros con los criterios de búsqueda especificados</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {filterUser?.length > 0 && <Pagination />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserList;