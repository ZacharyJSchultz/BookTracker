import logo from './logo.svg';
import './App.css';

var main = require('./main.html')

function App() {
  return (
    <iframe src={main }></iframe>
  );
}

export default App;
