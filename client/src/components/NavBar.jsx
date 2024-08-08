import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-primary">
            <div className="container-fluid">
                <Link to="" className="navbar-brand" style={{color:"white", fontWeight:"bold"}}>BookTracker</Link>
                <ul className="navbar-nav">
                    <li className="navbar-item px-2" id={"0"} onMouseEnter={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(obj.id);
                    }} onMouseLeave={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(-1);
                    }} style={{
                        backgroundColor: selectedIndex == 0 ? "#007bff" : "transparent",
                        color: selectedIndex == 0 ? "#D3D3D3" : "white"
                    }}>
                        <Link to="/viewdb" className="nav-link" style={{color:"inherit", fontWeight:500}} >View Read Books</Link></li>
                    <li className="navbar-item px-2" id={"1"} onMouseEnter={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(obj.id);
                    }} onMouseLeave={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(-1); 
                    }} style={{
                        backgroundColor: selectedIndex == 1 ? "#007bff" : "transparent",
                        color: selectedIndex == 1 ? "#D3D3D3" : "white"
                    }}>
                        <Link to="/additem" className="nav-link" style={{color:"inherit", fontWeight:500}}>Add Books</Link></li>
                    <li className="navbar-item px-2" id={"2"} onMouseEnter={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(obj.id);
                    }} onMouseLeave={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(-1);
                    }} style={{
                        backgroundColor: selectedIndex == 2 ? "#007bff" : "transparent",
                        color: selectedIndex == 2 ? "#D3D3D3" : "white"
                    }}>
                        <Link to="/remitem" className="nav-link" style={{color:"inherit", fontWeight:500}}>Remove Books</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;