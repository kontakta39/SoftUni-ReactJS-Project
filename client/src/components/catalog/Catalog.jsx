import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const carouselRef = useRef();
  const [offset, setOffset] = useState(0);


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3030/jsonstore/books");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setBooks(Object.values(data));
      } catch (err) {
        alert(err.message);
      }
    })();
  }, []);

  {/* Duplicate books for seamless scroll */}
  const loopedBooks = [...books, ...books];

  {/* Continuous scroll with requestAnimationFrame */}
  useEffect(() => {
    let animationFrame;
    const speed = 0.3; 

    const step = () => {
      if (!isPaused && carouselRef.current) {
        const width = carouselRef.current.scrollWidth / 2;
        setOffset((prev) => (prev + speed >= width ? 0 : prev + speed));
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused]);

  if (books.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-20 pt-10 pb-14 bg-white/80 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center underline decoration-blue-600 underline-offset-5">
          Book Catalog
        </h1>
        <p className="text-black text-3xl font-medium text-center">
          No books available yet. Add the first book!
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-10 pt-10 pb-14 bg-white/80 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center underline decoration-blue-600 underline-offset-5">
        Book Catalog
      </h1>

      <div
        className="overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={carouselRef}
          className="flex mt-12 mb-2 gap-x-10"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {loopedBooks.map((book, idx) => (
            <div
              key={book._id + idx}
              className="relative group w-60 h-96 flex-shrink-0 rounded-2xl shadow-2xl
                         transform transition duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 overflow-hidden bg-white"
            >
              <img
                src={book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex flex-col justify-center items-center p-4 space-y-4
                              bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                <h2 className="text-white text-2xl font-bold">{book.title}</h2>
                <p className="text-white text-lg">{book.author || "Unknown Author"}</p>
                <p className="text-white mb-3">{book.genre}</p>
                <button
                  onClick={() => navigate(`/book/details/${book._id}`)}
                  className="mt-4 px-6 py-2 bg-sky-200 text-sky-700 text-lg font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}