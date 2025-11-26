import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [errors, setErrors] = useState({});

  const fieldsToValidate = ["title", "author", "genre", "date", "summary"];
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (fieldsToValidate.includes(field)) {
      let message = "";
    
      if (field === "date") {
        message = "Publication Date is required.";
      } else if (field === "summary") {
          if (!value.trim()) {
            message = "Summary is required.";
          } else if (value.length < 10 || value.length > 200) {
            message = "Summary must be between 10 and 200 characters.";
          } else {
            message = undefined;
          }
      } else {
        message = value.trim() ? undefined : `${capitalize(field)} is required.`;
      }

      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  const validateForm = () => {
  const newErrors = {};

  fieldsToValidate.forEach((f) => {
      const message = f === "date" 
        ? "Publication Date is required." 
        : `${capitalize(f)} is required.`;

      if (!form[f]?.trim()) newErrors[f] = message;

      if (f === "summary" && form[f]?.trim()) {
        if (form[f].length < 10 || form[f].length > 200) {
          newErrors[f] = "Summary must be between 10 and 200 characters.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addBookHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      ...form,
      _createdOn: Date.now(),
      imageUrl: form.imageUrl || "/images/book-no-image-available.jpg",
    };

    console.log("Submitted data:", data);

    try {
      const response = await fetch("http://localhost:3030/jsonstore/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`POST error: ${response.status}`);

      const result = await response.json();
      console.log("Book created:", result);
      navigate("/");
    } catch (err) {
      console.error(err.message);
    }
  };

  const inputFieldClass = (field) => `
    peer w-full rounded-lg border px-4 py-3 placeholder-transparent
    bg-white text-black
    ${errors[field] ? "border-red-600" : "border-black"}
    hover:border-blue-600 focus:border-blue-600 focus:outline-none
  `;
  const labelFieldClass = (field) => `
    absolute left-4 bg-white px-1 transition-all duration-200
    top-3 text-black
    ${form[field] ? "top-[-10px] text-black" : ""}
    peer-hover:text-blue-600
    peer-focus:top-[-10px] peer-focus:text-blue-600 peer-focus:text-sm
  `;
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <section className="w-full flex justify-center py-16">
      <form onSubmit={addBookHandler} className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10 transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-5 drop-shadow-md">Add Book</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["title", "author", "genre", "date"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "date" ? "date" : "text"}
                name={field}
                id={field}
                value={form[field]}
                onChange={update(field)}
                placeholder=" "
                className={inputFieldClass(field)}
              />
              <label htmlFor={field} className={labelFieldClass(field)}>
                {field === "date" ? "Publication Date" : capitalize(field)}
              </label>
              {errors[field] && <p className={errorClass}>{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            value={form.imageUrl}
            onChange={update("imageUrl")}
            placeholder=" "
            className={inputFieldClass("imageUrl")}
          />
          <label htmlFor="imageUrl" className={labelFieldClass("imageUrl")}>Image URL (Optional)</label>
        </div>

        <div className="relative">
          <textarea
            name="summary"
            id="summary"
            rows="5"
            value={form.summary}
            onChange={update("summary")}
            placeholder=" "
            className={`${inputFieldClass("summary")} resize-none`}
          />
          <label htmlFor="summary" className={labelFieldClass("summary")}>Summary</label>
          {errors.summary && <p className={errorClass}>{errors.summary}</p>}
        </div>

        <div className="flex justify-center">
          <button type="submit" className="px-12 py-4 text-lg bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300">Add Book</button>
        </div>
      </form>
    </section>
  );
}