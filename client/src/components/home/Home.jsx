import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequest from "../../hooks/useRequest";

export default function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { request } = useRequest();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        {/* Fetch the latest 3 books using SoftUni Practice Server pagination */}
        const data = await request(
          "/data/books?sortBy=_createdOn%20desc&pageSize=3"
        );

        setBooks(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-20 pt-10 pb-14 bg-white/80 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12 text-center underline decoration-blue-600 underline-offset-5">
        Latest Books
      </h1>

      <div className="relative flex flex-wrap justify-center items-center gap-x-20 gap-y-10 min-h-[200px]">

        {books.length === 0 ? (
          <p className="text-black text-3xl font-medium text-center">
            No books available yet. Add the first book!
          </p>
        ) : (
          <>
            {books.map(book => (
              <div
                key={book._id}
                className="relative group w-60 h-96 rounded-2xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-105 hover:-translate-y-2 hover:rotate-1 bg-white"
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center p-4 space-y-4
                                bg-black/70
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <h2 className="text-white text-2xl font-bold">{book.title}</h2>
                  <p className="text-gray-200 text-lg">{book.author || "Unknown Author"}</p>
                  <button
                    onClick={() => navigate(`/book/details/${book._id}`)}
                    className="mt-4 px-6 py-2 bg-sky-200 text-sky-700 text-lg font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition w-auto"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}