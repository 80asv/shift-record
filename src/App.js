import { Route, Routes } from 'react-router';
import ChooseUsername from './components/ChooseUsername/ChooseUsername';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SingOut from './components/SingOut/SingOut';
import './App.css';
import Home from './components/Home/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>{/* inicio de sesion */}
      <Route path="/signout" element={<SingOut/>}/> {/* cierre de sesion */}
      <Route path="/registrar" element={<Register/>}/> {/* registrar una cita */}
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/choose-username" element={<ChooseUsername/>}/> {/* elejir nombre de usuario */}
    </Routes>
  );
}

export default App;
