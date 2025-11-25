import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header"
import Home from "./components/home/Home"
import Footer from "./components/footer/Footer";

function App() {
  return (
      <div
        className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background-image.jpg')" }}
      >
        <Header />

        <main className="flex-1 flex items-center justify-center">
          <div className="my-25">
            <Home />
          </div>
        </main>

        <Footer />
      </div>
    );
}

export default App