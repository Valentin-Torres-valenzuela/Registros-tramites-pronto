import React from 'react'

const Filters = () => {
    return ( 
        <>
        <h4 className="mx-4 my-2">Filtrar</h4>
            <div className="d-flex mb-4">
                <div className="mx-4">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" required/>
                </div>
                <div className="mx-4">
                        <label className="form-label">DNI</label>
                        <input type="number" className="form-control"/>
                </div>
                <div className="mx-4">
                        <label className="form-label">Fecha de carga</label>
                        <input type="date" className="form-control"/>
                </div>
            </div>
        </>
    );
}

export default Filters;