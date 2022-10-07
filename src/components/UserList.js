import React, {useState, useEffect} from 'react';
import axios from 'axios';
import User from './User';

const UserList = () => {
    
    const [dataUsuarios, setDatausuarios] = useState([]);
    const [filterUser, setFilterUser] = useState([]);
    const [error, actualizarError] = useState(false)
    const [arancel, setArancel] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);

    let arancelTotal = 0;
    const pages = new Array(numberOfPages).fill(null).map((v, i) => i)
    
    useEffect(() => {
        axios.get(`/api/user/obtainuser?page=${pageNumber}`)
        .then(res => {
            setDatausuarios(res.data.allUsers);
            setFilterUser(res.data.users);
            setNumberOfPages(res.data.totalPages);
        })
        // .then((res) => res.json())
        // .then(({totalPages, users}) => {
        //     setDatausuarios(users);
        //     setFilterUser(users);
        //     setNumberOfPages(totalPages);
        // })
        .catch(err => {
            console.log(err);
        })
    }, [pageNumber])

    // console.log(filterUser);
    // console.log(numberOfPages);

    const usersList = filterUser.map(user => {
        return (
            <div>
                <User user={user}/>
            </div>
        )
    })

    const searcher = (e) => {
        if (e.target.value !== '' || (dataUsuarios.length < filterUser.length)) {
            filtrar(e.target.value)
        }
    }
    
    const filtrar = (termino) => {
        let resultado = dataUsuarios.filter((user) => user.nombre.toLowerCase().includes(termino.toLowerCase()) || (new Date(user.fecha).getTime() === new Date(termino).getTime()))

        for (let i = 0; i < resultado.length; i++) {
            arancelTotal += resultado[i].arancel
            setArancel(parseFloat(arancelTotal));
        }

        setFilterUser(resultado);

        if (resultado.length === 0) {
            actualizarError(true);
            setArancel(0)
            return;
        }

        actualizarError(false);
    }

    const prevPage = () => { 
        setPageNumber(Math.max(0, pageNumber - 1));
    }

    const nextPage = () => { 
        setPageNumber(Math.min(numberOfPages - 1, pageNumber + 1));
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
                            <input onChange={searcher} type="text" className="form-control" required/>
                        </div>
                        <div className="mx-5">
                            <label className="form-label">Fecha desde</label>
                            <input type="date" onChange={searcher} className="form-control"/>
                        </div>
                    </div>
                        <a href='/crear' className="btn rounded-0 btn-success btn-lg p-2"> Nuevo registro <i className="fa-solid fa-plus"></i></a>
                    </div>
                </div>
                <div className="mb-4 d-flex ">
                    <h4 className="my-3">Arancel total de los registros según busqueda</h4>
                    <input type="text" value={arancel} disabled className="form-control w-25 mx-4 text-center border-0"/>
                </div>

                <button onClick={prevPage} className="btn btn-info">Anterior</button>

                {pages.map((pageIndex) => (
                    <button onClick={() => setPageNumber(pageIndex)} className="btn btn-info m-1">{pageIndex + 1}</button>
                ))}
                
                <button onClick={nextPage} className="btn btn-info">Siguiente</button>

                {error ? <p className = "alert alert-warning">No se encontró ningun registro</p> : null}
            </div>
            {usersList.reverse()}
        </>
    );
}

export default UserList;