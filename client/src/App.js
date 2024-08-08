import NavBar from './NavBar'
import { BrowserRouter } from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {
  const [bookData, setBookData] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setBookData(data.message));
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
      <h1>{bookData}</h1>
    </div>
  );
}

export default App;
