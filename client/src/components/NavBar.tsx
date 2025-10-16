import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.scss";

type Props = {
    setAlertVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavBar({ setAlertVisible }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    function getDynamicListItemStyling(elementIndex: number) {
        return {
            backgroundColor:
                selectedIndex === elementIndex ? "#007bff" : "transparent",
            color: selectedIndex === elementIndex ? "#D3D3D3" : "white",
        };
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-primary">
            <div className="container-fluid nav-inner-container">
                <Link to="" className="navbar-brand">
                    BookTracker
                </Link>
                <ul className="navbar-nav">
                    <li
                        className="navbar-item px-2"
                        id={"0"}
                        onMouseEnter={(event) => {
                            let obj = event.currentTarget;
                            setSelectedIndex(parseInt(obj.id));
                        }}
                        onMouseLeave={() => {
                            setSelectedIndex(-1);
                        }}
                        style={getDynamicListItemStyling(0)}
                    >
                        <Link to="/viewdb" className="nav-link">
                            View Read Books
                        </Link>
                    </li>
                    <li
                        className="navbar-item px-2"
                        id={"1"}
                        onMouseEnter={(event) => {
                            let obj = event.currentTarget;
                            setSelectedIndex(parseInt(obj.id));
                        }}
                        onMouseLeave={() => {
                            setSelectedIndex(-1);
                        }}
                        onClick={() => {
                            // Pass alertVisible as a variable into Nav simply so clicking "Add Books" brings back the form after submitting
                            setAlertVisible(false);
                        }}
                        style={getDynamicListItemStyling(1)}
                    >
                        <Link to="/additem" className="nav-link">
                            Add Books
                        </Link>
                    </li>
                    {/*<li className="navbar-item px-2" id={"2"} onMouseEnter={(event) => {
                        let obj = event.currentTarget;
                        setSelectedIndex(parseInt(obj.id));
                    }} onMouseLeave={(event) => {
                        setSelectedIndex(-1);
                    }} style={{
                        backgroundColor: selectedIndex === 2 ? "#007bff" : "transparent",
                        color: selectedIndex === 2 ? "#D3D3D3" : "white"
                    }}>
                        <Link to="/remitem" className="nav-link" style={{color:"inherit", fontWeight:500}}>Remove Books</Link>
                    </li>*/}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
