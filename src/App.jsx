import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Admin from './pages/Admin.jsx'
import Cliente from './pages/Cliente.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cliente />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
