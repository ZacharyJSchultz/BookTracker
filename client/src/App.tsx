import NavBar from './components/NavBar'
import Main from './components/Main'
import AddItem from './components/AddItem'
import RemItem from './components/RemItem'
import ViewDB from './components/ViewDB';
import React, { useState, useEffect } from 'react'
import { Location, useLocation } from 'react-router-dom'

function App() {
  const loc: Location = useLocation();
  const [bookData, setBookData] = useState<JSON[]>([])

  /*useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setBookData(data.message));
  }, []);*/

  var currLoc: JSX.Element;

  if (loc.pathname.endsWith("/viewdb")) {
    currLoc = <ViewDB />;
  }
  else if (loc.pathname.endsWith("/additem")) {
    currLoc = <AddItem />;
  }
  else if (loc.pathname.endsWith("/remitem")) {
    currLoc = <RemItem />;
  }
  else {
    currLoc = <Main />
  }
  return (
    <>
        <NavBar />
        {currLoc}
        {/*<h1>{bookData}</h1>*/}
    </>
  );
}

export default App;
