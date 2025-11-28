import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
      (async () => {
          try {
              const res = await fetch("http://localhost:3030/jsonstore/books");

              if (!res.ok) {
                  throw new Error(`Server error: ${res.status}`);
              }

              const data = await res.json();
              setBooks(Object.values(data));

          } catch (err) {
              alert(err.message);
          }
      })();
  }, []);

  {/* Scroll the container left or right */}
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-20 pt-10 pb-14 bg-white/80 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center underline decoration-blue-600 underline-offset-5">
        Book Catalog
      </h1>

      <div className="relative flex justify-center items-center min-h-[200px]">

        {books.length === 0 ? (
          <p className="text-black text-3xl font-medium text-center">
            No books available yet. Add the first book!
          </p>
        ) : (
          <>
            {/* Left arrow */}
            {books.length > 3 && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-1 z-10 bg-gray-700 text-white hover:bg-blue-600 p-2 rounded-full shadow text-2xl"
              >
                &#8592;
              </button>
            )}

            {/* Books list */}
            <div 
              ref={scrollRef} 
              className="flex justify-center gap-x-20 gap-y-10"
            >
              {books.map(book => (
                <div
                  key={book._id}
                  className="relative group w-60 h-96 rounded-2xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 bg-white"
                >
                  <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 flex flex-col justify-center items-center p-4 space-y-4 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <h2 className="text-white text-2xl font-bold">{book.title}</h2>
                    <p className="text-white text-lg">{book.author || "Unknown Author"}</p>
                    <p className="text-white mb-3">{book.genre}</p>
                    <button 
                      onClick={() => navigate(`/book/details/${book._id}`)}
                      className="mt-4 px-6 py-2 bg-sky-200 text-sky-700 text-lg font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right arrow */}
            {books.length > 3 && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-1 z-10 bg-gray-700 text-white hover:bg-blue-600 p-2 rounded-full shadow text-2xl"
              >
                &#8594;
              </button>
            )}
          </>
        )}

      </div>
    </section>
  );
}