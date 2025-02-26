import React from 'react'
import logo from '../img/tramites.png';
import Styles from './Styles.css'

const NavBar = () => {
    return ( 
        <div>
            <nav className="navbar navbar-expand-lg navbarc">
                <div className="container-fluid d-flex justify-content-center">
                    <a href='/' className="navbar-brand m-0">
                        <img src={logo} alt="logo" className="img-fluid" style={{height: '50px', backgroundColor: 'white'}} />
                    </a>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;