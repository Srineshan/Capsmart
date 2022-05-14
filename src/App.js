import React from 'react';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import ActiveContracts from './Screens/ContractManager'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route  path="/" element={<ActiveContracts />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
