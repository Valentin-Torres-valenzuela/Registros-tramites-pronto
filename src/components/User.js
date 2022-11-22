import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../img/tramites.png';
import Styles from './Styles.css'

const User = ({user}) => {

    let extraida = user.fecha.substring(0, 10)
    const listaServicios = () => {
        return (
                <table class="table table-bordered table-striped m-0">
                        <thead>
                            <tr>
                            <th scope="col">Servicio</th>
                            <th scope="col">Nom. Titular</th>
                            <th scope="col">Importe</th>
                            <th scope="col">Observacion</th>
                            </tr>
                        </thead>
                        <tbody>
                        {user.servicios.map(service => 
                            <tr>
                                <td className="p-0">{service.servicio}</td>
                                <td className="p-0"></td>
                                <td className="p-0">{service.importe}</td>
                                <td className="p-0">{service.obs}</td>
                            </tr>)}
                        </tbody>
                </table>
                )
            }
    return ( 
        <>
                {/* <table class="table table-bordered">
                        <thead>
                            <tr>
                            <th style={{width:200}} scope="col">Numero de recibo:</th>
                            <th style={{width:200}} scope="col">Nombre y apellido:</th>
                            <th style={{width:200}} scope="col">Fecha de carga:</th>
                            <th style={{width:200}} scope="col">Servicios:</th>
                            <th style={{width:30}} scope="col">Total pagos a efectuar:</th>
                            <th style={{width:30}} scope="col">Arancel:</th>
                            <th style={{width:30}} scope="col">Total:</th>
                            <th style={{width:30}} scope="col">Editar:</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                            <td>Nº 0001 - 00 {user.numRecibo}</td>
                            <td>{user.nombre}</td>
                            <td>{extraida}</td>
                            <td>{listaServicios()}</td>
                            <td>{user.totalPagosEfectuar}</td>
                            <td>{user.arancel}</td>
                            <td>{user.total}</td>
                            <td><Link to={`/editar/${user._id}`} className="btn btn-warning rounded-0 d-flex align-items-center justify-content-center"><i className="fa-solid fa-pen-to-square"></i></Link></td>
                            </tr>
                            </tbody>
                            </table>
                        <hr/> */}
                
            <div className="card my-3">
                <div className='row flex-row p-0'>
                    <div className='col-5 d-flex flex-column align-items-center'>
                        <a className="my-1"><img src={logo} width="200" alt="logo" /></a>
                        <i>de Cecilia Noemi Raiola</i>
                        <p className="m-0 sm">Tramitespronto02@gmail.com</p>
                        <p className="m-0 sm">Moine 1499 (1661) - Bella vista</p>
                        <p className="m-0 sm">Pcia. de Bs. As - Tel: 4668 - 0908</p>
                        <p className="m-0 sm">RESPONSABLE MONOTRIBUTO</p>
                    </div>
                    <div className="col-2 d-flex flex-column text-center border">
                        <h4 className="h-25">X</h4>
                        <small className="m-0">Documento no valido como factura</small>
                    </div>
                    <div className="col-5 d-flex flex-column text-center">
                        <p className="m-0">Comprobante de pago por Cuenta y Orden de terceros</p>
                            <ul className="list-group ">
                                <li className=" list-group-item bg-secondary text-white rounded-0 border-0 p-0"> <strong>Numero de recibo: </strong> Nº 0001 - 00{user.numRecibo}</li>
                                <li className=" list-group-item border-0 p-0"> <strong>Fecha de carga: </strong> {extraida}</li>
                            </ul>
                        <p className="m-0">C.U.I.T: 27-22014816-0</p>
                        <p className="m-0">Ing. Brutos: 27-22014816-0</p>
                        <p className="m-0">Inicio Actividades: 10/2017</p>
                    </div>
                </div>
                    <div className="d-flex my-2 col-12">
                        <ul className="list-group w-100">
                            <li className="list-group-item p-1 rounded-0"> <strong>Nombre y apellido: </strong> {user.nombre}</li>
                            <div className="d-flex">
                                <li className="list-group-item w-50 p-1"> <strong>C.U.I.T: </strong></li>
                                <li className="list-group-item w-50 p-1"> <strong>I.V.A: </strong></li>
                            </div>
                            <li className="list-group-item w-100 rounded-0 p-1"> <strong>Recibimos la suma de $: </strong></li>
                        </ul>
                    </div>
                    <div className="col-12">
                        <p className="p-0 m-0">En concepto de pago de los siguientes servicios, impuestos, contribuciones, etc:</p>
                        <ul className="list-group w-100">
                            <li className="list-group-item p-0 border-0"> {listaServicios()} </li>
                        </ul>
                    </div>
                    <div className="d-flex col-12 my-1">
                        <ul className="list-group w-100">
                            <li className="list-group-item p-1 rounded-0"> <strong>Total pagos a efectuar: </strong> {user.totalPagosEfectuar}</li>
                            <li className="list-group-item p-1"> <strong>Arancel: </strong> {user.arancel}</li>
                            <li className="list-group-item bg-success text-white rounded-0 m-0 p-1"> <strong>Total: </strong> {user.total}</li>
                        </ul>
                    </div>
                        <Link to={`/editar/${user._id}`} className="btn sm btn-sm btn-warning rounded-0 text-center"> <strong>Editar </strong> <i className="fa-solid fa-pen-to-square"></i></Link>
                        {/* <button className="btn btn-info rounded-0 my-2 text-center" onClick={() => window.print()}> <strong>Imprimir </strong> <i class="fa-solid fa-print"></i></button> */}
            </div>
        </>
    );
}

export default User;

