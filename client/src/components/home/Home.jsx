import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3030/data/books")
      .then(res => res.json())
      .then(data => {
        const booksArray = Object.values(data)
          .sort((a, b) => b._createdOn - a._createdOn)
          .slice(0, 3);
        setBooks(booksArray);
      })
      .catch(err => console.error(err.message));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-20 py-16 bg-white/80 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center underline">
        Latest Books
      </h1>

      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10">
        {books.map(book => (
          <div
            key={book._id}
            className="relative group w-60 h-96 rounded-2xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 bg-white"
          >
            {/* Book Image */}
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />

              {/* Overlay with book information */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-4 space-y-4
                              bg-black/70
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                <h2 className="text-white text-2xl font-bold">{book.title}</h2>
                <p className="text-gray-200 text-lg">{book.author || "Unknown Author"}</p>
                <button className="mt-4 px-6 py-2 bg-yellow-400 text-gray-900 text-lg font-semibold rounded-lg hover:bg-yellow-300 transition w-auto">
                  Details
                </button>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}