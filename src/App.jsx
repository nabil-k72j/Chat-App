import Room from './pages/Room'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PrivateRoutes from './Components/PrivateRoutes'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Utils/AuthContext'
import './App.css'

function App() {

  return (
    <Router>

      <AuthProvider>

        <Routes>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<PrivateRoutes />}>

            <Route path='/' element={<Room />} />

          </Route>


        </Routes>

      </AuthProvider>

    </Router>
  )
}

export default App
