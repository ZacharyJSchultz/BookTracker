import NavBar from './components/NavBar'
import Main from './components/Main'
import AddItem from './components/AddItem'
import RemItem from './components/RemItem'
import ViewDB from './components/ViewDB';
import { useLocation } from 'react-router-dom'

function App() {
  const loc = useLocation();
  let currLoc = "";

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
    </>
  );
}

export default App;
