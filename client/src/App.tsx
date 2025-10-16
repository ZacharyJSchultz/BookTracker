import NavBar from "./components/NavBar";
import Main from "./components/Main";
import AddItem from "./components/AddItem";
import ViewDB from "./components/ViewDB";
import React, { useState } from "react";
import { Location, useLocation } from "react-router-dom";

function App() {
    const loc: Location = useLocation();
    const [alertVisible, setAlertVisible] = useState(false);

    /*useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setBookData(data.message));
  }, []);*/

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
            {getCurrLoc()}
            {/*<h1>{bookData}</h1>*/}
        </>
    );
}

export default App;
