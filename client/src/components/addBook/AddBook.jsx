import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    date: "",
    imageUrl: "",
    summary: "",
  });

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const addBookHandler = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      _createdOn: Date.now(),
    };

    // пример — смени с твоя request
    // await request("/books", "POST", data);

    navigate("/");
  };

  const inputClass = `
    peer w-full rounded-lg border px-4 py-3
    bg-white text-black
    border-black
    hover:border-blue-600
    focus:border-blue-600 focus:outline-none
    placeholder-transparent
  `;

  const labelClass = `
    absolute left-4 top-3 text-black transition-all
    peer-focus:text-blue-600
    peer-placeholder-shown:top-3
    peer-focus:top-[-10px] peer-focus:text-sm
    bg-white px-1
  `;

  return (
    <section className="w-full flex justify-center py-16">
      <form
        onSubmit={addBookHandler}
        className="
          w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10
          transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl
        "
      >
        <h1 className="text-3xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 drop-shadow-md">
          Add Book
        </h1>

         {/* Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={update("title")}
              placeholder=" "
              className={inputClass}
            />
            <label htmlFor="title" className={labelClass}>Title</label>
          </div>

          {/* Author */}
          <div className="relative">
            <input
              type="text"
              name="author"
              id="author"
              value={form.author}
              onChange={update("author")}
              placeholder=" "
              className={inputClass}
            />
            <label htmlFor="author" className={labelClass}>Author</label>
          </div>

          {/* Genre */}
          <div className="relative">
            <input
              type="text"
              name="genre"
              id="genre"
              value={form.genre}
              onChange={update("genre")}
              placeholder=" "
              className={inputClass}
            />
            <label htmlFor="genre" className={labelClass}>Genre</label>
          </div>

          {/* Date */}
          <div className="relative">
            <input
              type="date"
              name="date"
              id="date"
              value={form.date}
              onChange={update("date")}
              placeholder=" "
              className={inputClass}
            />
            <label htmlFor="date" className={labelClass}>Publication Date</label>
          </div>
        </div>

        {/* Image URL */}
        <div className="relative">
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={form.imageUrl}
            onChange={update("imageUrl")}
            placeholder=" "
            className={inputClass}
          />
          <label htmlFor="imageUrl" className={labelClass}>Image URL</label>
        </div>

        {/* Summary */}
        <div className="relative">
          <textarea
            name="summary"
            id="summary"
            rows="5"
            value={form.summary}
            onChange={update("summary")}
            placeholder=" "
            className={`${inputClass} resize-none`}
          ></textarea>
          <label htmlFor="summary" className={labelClass}>Summary</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-12 py-4 text-lg bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Add Book
          </button>
        </div>
      </form>
    </section>
  );
}