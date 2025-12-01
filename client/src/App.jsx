import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header"
import Home from "./components/home/Home"
import Catalog from "./components/catalog/Catalog";
import AddBook from "./components/addBook/AddBook";
import EditBook from "./components/editBook/EditBook";
import DetailsBook from "./components/detailsBook/DetailsBook";
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
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/book/details/:bookId" element={<DetailsBook />} />
            <Route path="/book/edit/:bookId" element={<EditBook />} />
          </Routes>
        </main>

        <Footer />
      </div>
    );
}

export default App