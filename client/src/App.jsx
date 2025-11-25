import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header"
import Home from "./components/home/Home"
import AddBook from "./components/addBook/AddBook";
import Footer from "./components/footer/Footer";

function App() {
  return (
      <div
        className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background-image.jpg')" }}
      >
        <Header />

        <main className="flex-1 py-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addbook" element={<AddBook />} />
          </Routes>
        </main>

        <Footer />
      </div>
    );
}

export default App