import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailsBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState({
        _id: "",
        title: "",
        author: "",
        genre: "",
        date: "",
        imageUrl: "",
        summary: "",
    });

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`http://localhost:3030/jsonstore/books/${bookId}`);
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch book: ${res.statusText}`);
                }

                const data = await res.json();
                setBook(data);
            } catch (err) {
                alert(err.message);
            }
        };
        fetchBook();
    }, [bookId]);

    const onDeleteClick = async () => {
        if (!book._id) return;

        const confirmDelete = confirm(
            `Are you sure you want to delete the book "${book.title}"?`
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:3030/jsonstore/books/${book._id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error(`Failed to delete book: ${res.statusText}`);
            }

            console.log(`Book with ID ${book._id} deleted successfully.`);
            navigate("/catalog");
        } catch (err) {
            console.error("Error deleting book:", err.message);
            alert(err.message);
        }
    };

    {/* Formatting date */}
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("de-DE"); 
    };

    const rowClass = "flex justify-between py-2";
    const rowBorderClass = "flex justify-between border-b border-gray-500 border-underline py-2";
    const labelClass = "font-bold text-blue-300";
    
    const btnClass = `
    inline-block px-10 py-3 mx-4 
    text-lg font-bold bg-sky-200 text-sky-700 rounded-lg
    shadow-[3px_3px_6px_#3081ff,-3px_-3px_6px_#3081ff]
    transition-transform hover:scale-105 hover:bg-blue-500 hover:text-white
    `;

    return (
        <div
            id="book-details"
            className="
            max-w-6xl mx-auto m-10 w-full 
            rounded-2xl p-10
            text-center 
            bg-white
            shadow-[0_0_24px_0_#ffffff,0_0_15px_#ffffff]
            "
        >
            {/* Title */}
            <h1 className="text-4xl font-bold underline decoration-blue-600 underline-offset-5 mb-12">
                Book Title: {book.title}
            </h1>

            {/* Image + Book Info */}
            <div className="flex flex-wrap justify-center gap-30">

            {/* Image */}
            <img
                src={book.imageUrl}
                alt={book.title}
                className="
                w-64 h-96 object-cover rounded-xl
                shadow-[5px_5px_10px_#191c21,-5px_-5px_10px_#5e6865]
                "
            />

            {/* Book Info */}
            <div
                className="
                p-6 w-120 flex flex-col justify-center gap-5 rounded-xl p-10
                bg-gray-700 
                shadow-[inset_2px_2px_4px_#2a3a48,inset_-2px_-2px_4px_#425c75]
                "
            >
                <h2 className="text-3xl mb-10 text-white text-center font-semibold">
                    Book Information
                </h2>

                <div className={rowBorderClass}>
                    <span className={labelClass}>Author</span>
                    <span className="text-white">{book.author}</span>
                </div>

                <div className={rowBorderClass}>
                    <span className={labelClass}>Genre</span>
                    <span className="text-white">{book.genre}</span>
                </div>

                <div className={rowClass}>
                    <span className={labelClass}>Publication Date</span>
                    <span className="text-white">{formatDate(book.date)}</span>
                </div>
            </div>
            </div>

                {/* Summary */}
                <div className="mt-10 text-center">
                <h2 className="text-2xl font-semibold mb-2">Summary</h2>
                <p className="text-lg leading-relaxed">
                    {book.summary}
                </p>
                </div>

                {/* Buttons */}
                <div className="w-full text-center mt-12 pt-6 border-t border-gray-500 border-underline">
                <button
                    onClick={() => navigate(`/book/edit/${book._id}`)}
                    className={btnClass}
                >
                    Edit
                </button>

                <button
                    onClick={onDeleteClick}
                    className={btnClass}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}