import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";
import { useNavigate } from "react-router-dom";

export default function BorrowedBooks() {
  const { user, isAuthenticated } = useAuth();
  const { request } = useRequest();
  const navigate = useNavigate();

  const [borrowed, setBorrowed] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const encoded = encodeURIComponent(`_ownerId="${user._id}"`);
      try {
        const records = await request(`/data/borrowedBooks?where=${encoded}`);
        if (records.length === 0) {
          setBorrowed([]);
          return;
        }

        const books = await request("/data/books"); 
        const borrowedWithBooks = records.map(r => {
          const book = books.find(b => b._id === r.bookId);
          return { ...r, book };
        });

        setBorrowed(borrowedWithBooks);
      } catch(err) {
        alert(err.message);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  const returnBook = async (recordId) => {
    try {
      await request(`/data/borrowedBooks/${recordId}`, "DELETE", null, {
        accessToken: user.accessToken,
      });
      setBorrowed((prev) => prev.filter((b) => b._id !== recordId));
    } catch (err) {
      alert("Failed to return the book: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-10 py-12 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-4xl font-bold text-center underline decoration-blue-600 underline-offset-4 mb-12">
        Borrowed Books
      </h1>

      {borrowed.length === 0 ? (
        <p className="text-center text-2xl font-medium text-gray-700 italic">
          You have not borrowed any books yet.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-16">
          {borrowed.map((record) => (
            <div
              key={record._id}
              onClick={() => record.book && navigate(`/book/details/${record.book._id}`)}
              className="w-70 bg-sky-200 shadow-lg rounded-2xl overflow-hidden hover:scale-105 transition p-5 text-center cursor-pointer"
            >
              {record.book && (
                <>
                  <img
                    src={record.book.imageUrl}
                    alt={record.book.title}
                    className="w-60 h-96 object-cover rounded-lg mx-auto"
                  />
                  <h3 className="text-xl font-bold mt-4 mb-3">{record.book.title}</h3>
                  <p className="text-gray-600">{record.book.author}</p>
                </>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  returnBook(record._id);
                }}
                className="mt-5 px-6 py-2 bg-red-300 text-red-800 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}