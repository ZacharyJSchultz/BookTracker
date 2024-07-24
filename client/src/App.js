import './App.css';

const main = require(process.env.PUBLIC_URL + '/main.html');

function App() {
  return (
    <div className="App">
      <iframe src={main }></iframe>
    </div>
  );
}

export default App;
