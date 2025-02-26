import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/tramites.png';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import axios from './axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import printJS from 'print-js';

const User = ({user, onDelete, onSelect, isSelected, selectedCount}) => {
    const componentRef = useRef(null);
    let extraida = user.fecha.substring(0, 10)
    
    // Función para imprimir usando print-js
    const handlePrint = () => {
        printJS({
            printable: componentRef.current,
            type: 'html',
            targetStyles: ['*'],
            documentTitle: `factura-${user.nombre}`
        });
    };

    // Función para descargar PDF
    const handleDownloadPDF = async () => {
        const { value: email } = await Swal.fire({
            title: '¿A qué correo desea enviar la factura?',
            input: 'email',
            inputLabel: 'Correo electrónico',
            inputPlaceholder: 'Ingrese el correo electrónico',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            validationMessage: 'El correo electrónico no es válido'
        });

        if (!email) return;

        const content = componentRef.current;
        const buttons = content.querySelector('.no-print');
        if (buttons) buttons.style.display = 'none';

        try {
            Swal.fire({
                title: 'Enviando...',
                text: 'Por favor espere mientras se envía el correo',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const canvas = await html2canvas(content, {
                scale: 0.8,
                useCORS: true,
                logging: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.5);
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2;

            pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            
            const pdfBase64 = pdf.output('datauristring');

            const response = await axios.post('/user/send-pdf', {
                pdfBase64,
                email,
                userName: user.nombre
            }, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 60000,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Enviado!',
                    text: 'El PDF ha sido enviado correctamente al correo especificado',
                    timer: 3000
                });
            }

        } catch (error) {
            console.error('Error completo:', error.response || error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un error al enviar el PDF por correo'
            });
        } finally {
            if (buttons) buttons.style.display = 'flex';
        }
    };

    // Función para eliminar
    const handleDelete = () => {
        const userId = user._id || user.id;
        
        if (!userId) {
            console.error('ID no encontrado:', user);
            toast.error('Error: No se puede eliminar este registro', {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`user/deleteuser/${userId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    console.log('Respuesta del servidor:', response.data);
                    
                    // Si llegamos aquí, la eliminación fue exitosa
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El registro ha sido eliminado.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    if (onDelete) {
                        onDelete(userId);
                    }
                } catch (error) {
                    console.error('Error detallado al eliminar:', error.response || error);
                    
                    // Si el error es 404, significa que ya fue eliminado
                    if (error.response?.status === 404) {
                        Swal.fire({
                            title: '¡Eliminado!',
                            text: 'El registro ya ha sido eliminado.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        if (onDelete) {
                            onDelete(userId);
                        }
                        return;
                    }
                    
                    // Para otros errores
                    const errorMessage = error.response?.data?.error || 
                                      error.response?.data?.message || 
                                      error.message || 
                                      'Error al eliminar el registro';
                    
                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: true
                    });
                }
            }
        });
    };

    // Función para manejar el cambio en el checkbox
    const handleCheckboxChange = (e) => {
        onSelect(user._id || user.id, e.target.checked);
    };

    return ( 
        <>
            <ToastContainer />
            <div className="position-relative">
                {/* Checkbox para selección */}
                {/*
                <div className="position-absolute print-hide" style={{
                    top: '10px',
                    left: '10px',
                    zIndex: '1000'
                }}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        style={{
                            cursor: 'pointer',
                            width: '20px',
                            height: '20px',
                            border: '2px solid #210B65'
                        }}
                    />
                </div>
                */}

                <div className={`card border-0 shadow-sm h-100 ${isSelected ? 'selected' : ''}`}>
                    <div ref={componentRef} id={`invoice-${user._id || user.id}`} style={{
                        width: '100%',
                        backgroundColor: 'white',
                        position: 'relative'
                    }}>
                        <div className='row g-0'>
                            {/* Columna del logo e información de la empresa */}
                            <div className='col-12 col-lg-5 p-2 text-center border-bottom border-lg-end border-lg-bottom-0 bg-white'>
                                <img src={logo} className="img-fluid mb-2" style={{maxWidth: "170px"}} alt="logo" />
                                <p className="text-small mb-1">Tramitespronto02@gmail.com</p>
                                <p className="text-small mb-1">Moine 1499 (1661) - Bella vista</p>
                                <p className="text-small mb-1">Pcia. de Bs. As</p>
                                <p className="text-small mb-0">RESPONSABLE MONOTRIBUTO</p>
                            </div>

                            {/* Columna del tipo de documento */}
                            <div className="col-12 col-lg-2 d-flex flex-column text-center justify-content-center border-bottom border-lg-end border-lg-bottom-0 py-3 py-lg-0" style={{backgroundColor: '#f8f9fa'}}>
                                <h3 className="mb-2" style={{color: '#000'}}>X</h3>
                                <p className="text-small text-secondary mb-0">Documento no válido como factura</p>
                            </div>

                            {/* Columna de información del comprobante */}
                            <div className="col-12 col-lg-5 p-1 bg-white">
                                <p className="text-center mb-0" style={{color: '#000'}}>Comprobante de pago por Cuenta y Orden de terceros</p>
                                <div className="bg-light p-1 mb-1">
                                    <p className="text-small mb-0">
                                        <strong>Numero de recibo:</strong>
                                        <br />
                                        <span className="num_recibo">Nº 0001 - 00{user.numRecibo}</span>
                                    </p>
                                    <p className="text-small mb-0">Fecha de carga {extraida}</p>
                                </div>
                                <div className="text-small">
                                    <p className="mb-0">C.U.I.T: 27-22014816-0</p>
                                    <p className="mb-0">Ing. Brutos: 27-22014816-0</p>
                                </div>
                            </div>
                        </div>

                        {/* Información del cliente y servicios */}
                        <div className="border-top p-3 bg-white" style={{flex: '1 0 auto'}}>
                            <div className="mb-3">
                                <p className="small mb-2"><strong>Nombre y apellido:</strong> {user.nombre}</p>
                                <div className="row g-2">
                                    <div className="col-12 col-sm-6">
                                        <p className="small mb-0"><strong>C.U.I.T:</strong></p>
                                    </div>
                                    <div className="col-12 col-sm-6">
                                        <p className="small mb-0"><strong>I.V.A:</strong></p>
                                    </div>
                                </div>
                            </div>

                            <p className="small mb-2"><strong>Recibimos la suma de $:</strong></p>
                            
                            <div>
                                <p className="small mb-2">En concepto de pago de los siguientes servicios, impuestos, contribuciones, etc:</p>
                                <div className="table-responsive">
                                    <table className="table table-sm table-bordered m-0">
                                        <thead style={{backgroundColor: '#f8f9fa'}}>
                                            <tr>
                                                <th className="px-2 py-1" scope="col">Servicio</th>
                                                <th className="px-2 py-1" scope="col">Nom. Titular</th>
                                                <th className="px-2 py-1" scope="col">Importe</th>
                                                <th className="px-2 py-1" scope="col">Observacion</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.servicios.map((service, index) => 
                                                <tr key={index}>
                                                    <td className="px-2 py-1">{service.servicio}</td>
                                                    <td className="px-2 py-1"></td>
                                                    <td className="px-2 py-1">${service.importe}</td>
                                                    <td className="px-2 py-1">{service.obs}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Módulo de totales */}
                        <div className="bg-white" style={{marginTop: 'auto'}}>
                            <div className="mx-3 mb-3" style={{backgroundColor: '#F8F9FA', padding: '0.5rem'}}>
                                <div className="row g-2">
                                    <div className="col-12 col-sm-4">
                                        <p className="small mb-1"><strong>Total pagos a efectuar:</strong></p>
                                        <p className="h6 mb-2 mb-sm-0"><strong>$ {user.totalPagosEfectuar}</strong></p>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <p className="small mb-1"><strong>Arancel:</strong></p>
                                        <p className="h6 mb-2 mb-sm-0"><strong>$ {user.arancel}</strong></p>
                                    </div>
                                    <div className="col-12 col-sm-4">
                                        <p className="small mb-1"><strong>Total:</strong></p>
                                        <p className="h6 mb-0"><strong>$ {user.total}</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap no-print">
                        {/*
                        <button 
                            onClick={() => handlePrint()}
                            className="btn btn-sm flex-grow-1 text-white" 
                            style={{
                                backgroundColor: '#210B65',
                                borderRadius: '0'
                            }}
                        >
                            <i className="fa-solid fa-print me-2"></i>
                            Imprimir
                        </button>
                        */}
                        <button 
                            onClick={handleDownloadPDF}
                            className="btn btn-sm flex-grow-1 text-white" 
                            style={{
                                backgroundColor: '#fd7e14',
                                borderRadius: '0'
                            }}
                        >
                            <i className="fa-solid fa-file-pdf me-2"></i>
                            Descargar PDF
                        </button>
                        <Link 
                            to={`/editar/${user._id}`} 
                            className="btn btn-sm flex-grow-1 text-white" 
                            style={{
                                backgroundColor: '#210B65',
                                borderRadius: '0'
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square me-2"></i>
                            Editar
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="btn btn-sm flex-grow-1 text-white" 
                            style={{
                                backgroundColor: '#dc3545',
                                borderRadius: '0 0 4px 0'
                            }}
                        >
                            <i className="fa-solid fa-trash me-2"></i>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default User;