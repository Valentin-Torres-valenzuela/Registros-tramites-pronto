import React, {useState, useEffect} from 'react';
import axios from 'axios';
import User from './User';

const UserList = () => {
    
    const [filterUser, setFilterUser] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [numberOfPages, setNumberOfPages] = useState(0);
    
    let arancelTotal = 0;
    
    const pages = new Array(numberOfPages).fill(null).map((v, i) => i)
    
    const getData = (page=``) => {
        axios.get(`/api/user/obtainuser?page=${page}&nombre=${nombre}&fecha=${fecha}`)
        .then(res => {
            setFilterUser(res.data.users);
            setNumberOfPages(res.data.totalPages);
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getData();
    }, [nombre, fecha])

    const usersList = filterUser.map(user => {

        arancelTotal += user.arancel

        return (
            <div className="w-50">
                <User user={user}/>
            </div>
        )
    })

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

    return ( 
        <>
            <div className="container">
                <div className="row">
                    <h4 className="my-3">Filtrar</h4>
                    <div className="column d-flex justify-content-between align-items-end mb-5 mt-2">
                    <div className="d-flex">
                        <div>
                            <label className="form-label">Nombre / Apellido</label>
                            <input onChange={e => setNombre(e.target.value)} type="text" className="form-control" required/>
                        </div>
                        <div className="mx-5">
                            <label className="form-label">Fecha desde</label>
                            <input type="date" onChange={e => setFecha(e.target.value)} className="form-control"/>
                        </div>
                    </div>
                        <a href='/crear' className="btn rounded-0 btn-success btn-lg p-2"> Nuevo registro <i className="fa-solid fa-plus"></i></a>
                    </div>
                </div>
                <div className="mb-4 d-flex ">
                    <h4 className="my-3">Arancel total de los registros según criterio de busqueda</h4>
                    <input type="text" value={arancelTotal} disabled className="form-control w-25 mx-4 text-center border-0"/>
                </div>

                <button onClick={prevPage} className="btn btn-info">Anterior</button>

                {pages.map((pageIndex) => (
                    <button onClick={() => {setPageNumber(pageIndex); getData(pageIndex)}} className="btn btn-info m-1">{pageIndex + 1}</button>
                ))}
                
                <button onClick={nextPage} className="btn btn-info">Siguiente</button>

                <div className="row d-flex">
                    {usersList.length !== 0 ? usersList : <p className = "alert alert-warning my-5">No se encontró ningun registro</p>}
                </div>
            </div>
        </>
    );
}

export default UserList;