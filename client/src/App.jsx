import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header"
import Home from "./components/home/Home"
import Footer from "./components/footer/Footer";

function App() {
  return (  
    <>
      <Header />

      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App