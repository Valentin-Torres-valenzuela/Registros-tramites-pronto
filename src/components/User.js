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

const User = ({user, onDelete}) => {
    const componentRef = useRef(null);
    let extraida = user.fecha.substring(0, 10)
    
    // Función para imprimir
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `factura-${user.nombre}`,
        onBeforePrint: () => {
            const buttons = componentRef.current.querySelector('.no-print');
            if (buttons) buttons.style.display = 'none';
        },
        onAfterPrint: () => {
            const buttons = componentRef.current.querySelector('.no-print');
            if (buttons) buttons.style.display = 'flex';
        },
        pageStyle: `
            @page {
                size: landscape;
                margin: 20mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .no-print {
                    display: none !important;
                }
                .bg-white {
                    background-color: white !important;
                }
                .text-white {
                    color: white !important;
                }
            }
        `,
        copyStyles: true
    });

    // Función para descargar PDF
    const handleDownloadPDF = async () => {
        const content = componentRef.current;
        const buttons = content.querySelector('.no-print');
        if (buttons) buttons.style.display = 'none';

        try {
            const canvas = await html2canvas(content, {
                scale: 2, // Mejor calidad
                useCORS: true, // Para manejar imágenes externas
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calcular las dimensiones para ajustar el contenido a una sola página
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = (pdfHeight - imgHeight * ratio) / 2;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`factura-${user.nombre}.pdf`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
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
                    const response = await axios.delete(`user/deleteuser/${userId}`);
                    console.log('Respuesta del servidor:', response.data);
                    
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
                    console.error('Error al eliminar:', error.response || error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar el registro.',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    };

    return ( 
        <>
            <ToastContainer />
            <div className="card shadow-sm border-0 mb-0" style={{backgroundColor: '#fafafa', borderRadius: '0 0 4px 4px'}}>
                <div ref={componentRef} style={{
                    minHeight: '650px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderRadius: '0'
                }}>
                    <div className='row g-0'>
                        {/* Columna del logo e información de la empresa */}
                        <div className='col-12 col-lg-5 p-3 text-center border-bottom border-lg-end border-lg-bottom-0 bg-white'>
                            <img src={logo} className="img-fluid mb-2" style={{maxWidth: "150px"}} alt="logo" />
                            <p className="small text-secondary mb-1">de Cecilia Noemi Raiola</p>
                            <p className="small mb-1">Tramitespronto02@gmail.com</p>
                            <p className="small mb-1">Moine 1499 (1661) - Bella vista</p>
                            <p className="small mb-1">Pcia. de Bs. As - <span className="text-dark">Cel: 11 2710-3204</span> <i className="fa-brands fa-whatsapp text-success"></i></p>
                            <p className="small mb-0">RESPONSABLE MONOTRIBUTO</p>
                        </div>

                        {/* Columna del tipo de documento */}
                        <div className="col-12 col-lg-2 d-flex flex-column text-center justify-content-center border-bottom border-lg-end border-lg-bottom-0 py-3 py-lg-0" style={{backgroundColor: '#f8f9fa'}}>
                            <h3 className="mb-2" style={{color: '#210B65'}}>X</h3>
                            <p className="small text-secondary mb-0">Documento no válido como factura</p>
                        </div>

                        {/* Columna de información del comprobante */}
                        <div className="col-12 col-lg-5 p-3 bg-white">
                            <h6 className="text-center mb-3" style={{color: '#210B65'}}>Comprobante de pago por Cuenta y Orden de terceros</h6>
                            <div className="bg-light p-2 mb-3">
                                <p className="small mb-1"><strong>Numero de recibo:</strong> Nº 0001 - 00{user.numRecibo}</p>
                                <p className="small mb-0"><strong>Fecha de carga:</strong> {extraida}</p>
                            </div>
                            <div className="small">
                                <p className="mb-1">C.U.I.T: 27-22014816-0</p>
                                <p className="mb-1">Ing. Brutos: 27-22014816-0</p>
                                <p className="mb-0">Inicio Actividades: 10/2017</p>
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
                        <div className="mx-3 mb-3" style={{backgroundColor: '#210B65', padding: '0.5rem'}}>
                            <div className="row g-2">
                                <div className="col-12 col-sm-4">
                                    <p className="small mb-1 text-white"><strong>Total pagos a efectuar:</strong></p>
                                    <p className="h6 mb-2 mb-sm-0 text-white"><strong>$ {user.totalPagosEfectuar}</strong></p>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <p className="small mb-1 text-white"><strong>Arancel:</strong></p>
                                    <p className="h6 mb-2 mb-sm-0 text-white"><strong>$ {user.arancel}</strong></p>
                                </div>
                                <div className="col-12 col-sm-4">
                                    <p className="small mb-1 text-white"><strong>Total:</strong></p>
                                    <p className="h6 mb-0 text-white"><strong>$ {user.total}</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap no-print">
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
        </>
    );
}

export default User;