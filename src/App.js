import { Route, Routes } from 'react-router';
import ChooseUsername from './components/ChooseUsername/ChooseUsername';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import SingOut from './components/SingOut/SingOut';
import './App.css';
import Home from './components/Home/Home';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AddTurn from './components/AddTurn/AddTurn';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/login" element={<Login/>}/>{/* inicio de sesion */}
          <Route path="/registrar" element={<Register/>}/> {/* registrar una cita */}
          <Route path="dashboard/agregar-turno" element={
            <ProtectedRoute>
              <AddTurn/>
            </ProtectedRoute>
          }/>
          <Route path="/choose-username" element={
            <ProtectedRoute>
              <ChooseUsername/>
            </ProtectedRoute>
          }/> 
          {/* <Route path="/signout" element={<SingOut/>}/>  */}
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
        </Routes>
    </AuthProvider>
  );
}

export default App;
