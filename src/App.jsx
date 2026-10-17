import { HashRouter as Router, Routes, Route } from "react-router-dom"
import SignIn from "./Enterance/Sign-In.jsx"
import Login from "./Enterance/Log-In.jsx"
import Shop from "./Shop/Shop.jsx"

function App() {

  return (
      <Router>
        <Routes>
          <Route path="/" element={<SignIn/>}/>
          <Route path="/Log-In" element={<Login/>}/>
          <Route path="/Shop" element={<Shop/>}/>
        </Routes>
      </Router>
  )
}

export default App
