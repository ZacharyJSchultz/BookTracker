import "./styles/General.scss";
import "./styles/GenericComponents.scss";
import "./styles/Pages.scss";

import React, { useState } from "react";
import { Location, useLocation } from "react-router-dom";

import AddItem from "./components/AddItem";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import ViewDB from "./components/ViewDB";

function App() {
    const loc: Location = useLocation();
    const [alertVisible, setAlertVisible] = useState(false);

    function getCurrLoc(): JSX.Element {
        if (loc.pathname.endsWith("/viewdb")) {
            return <ViewDB />;
        } else if (loc.pathname.endsWith("/additem")) {
            return (
                <AddItem
                    alertVisible={alertVisible}
                    setAlertVisible={setAlertVisible}
                />
            );
        } else {
            return <Main />;
        }
    }

    return (
        <>
            <NavBar setAlertVisible={setAlertVisible} />
            <div className="navbar-padding" />
            {getCurrLoc()}
            {/*<h1>{bookData}</h1>*/}
        </>
    );
}

export default App;
