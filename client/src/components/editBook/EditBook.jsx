import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBook() {
  const { bookId } = useParams();
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

  {/* GET request – Fetch book and populate the form */}
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:3030/jsonstore/books/${bookId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to delete book: ${res.statusText}`);
        }

        const data = await response.json();

        setForm({
          title: data.title ?? "",
          author: data.author ?? "",
          genre: data.genre ?? "",
          date: data.date ?? "",
          summary: data.summary ?? "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        alert(err.message);
      }
    };

    fetchBook();
  }, [bookId]);

  {/* Update form values + validations */}
  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (fieldsToValidate.includes(field) && field !== "date") {
      let message = "";

      if (field === "summary") {
        if (!value.trim()) {
          message = "Summary is required.";
        } else if (value.length < 10 || value.length > 1000) {
          message = "Summary must be between 10 and 1000 characters.";
        } else {
          message = undefined;
        }
      } else {
        message = value.trim()
          ? undefined
          : `${capitalize(field)} is required.`;
      }

      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  const handleDateBlur = () => {
    if (!form.date) {
      setErrors((prev) => ({
        ...prev,
        date: "Publication Date is required.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  {/* Validate whole form on submit */}
  const validateForm = () => {
    const newErrors = {};

    fieldsToValidate.forEach((f) => {
      if (!form[f]?.trim()) {
        if (f === "date") newErrors[f] = "Publication Date is required.";
        else newErrors[f] = `${capitalize(f)} is required.`;
      }

      if (f === "summary" && form[f]?.trim()) {
        if (form[f].length < 10 || form[f].length > 1000) {
          newErrors[f] = "Summary must be between 10 and 1000 characters.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  {/* PUT request – Submit changes */}
  const editBookHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedBook = {
      _id: bookId,
      ...form,    
      imageUrl: form.imageUrl || "/images/book-no-image-available.jpg",
      _updatedOn: Date.now(),
    };

    try {
      const response = await fetch(
        `http://localhost:3030/jsonstore/books/${bookId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedBook),
        }
      );

      if (!response.ok)
        throw new Error(`PUT error: ${response.status}`);

      navigate(`/book/details/${bookId}`);
    } catch (err) {
      alert.error(err.message);
    }
  };

  const inputFieldClass = (field) =>
    `peer w-full rounded-lg border px-4 py-3 placeholder-transparent bg-white text-black ${
      errors[field] ? "border-red-600" : "border-black"
    } hover:border-blue-600 focus:border-blue-600 focus:outline-none`;

  const labelFieldClass = (field) =>
    `absolute left-4 bg-white px-1 transition-all duration-200 top-3 text-black ${
      form[field] ? "top-[-10px] text-black" : ""
    } peer-hover:text-blue-600 peer-focus:top-[-10px] peer-focus:text-blue-600 peer-focus:text-sm`;

  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <section className="w-full flex justify-center py-16">
      <form
        onSubmit={editBookHandler}
        className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10"
      >
        <h1 className="text-4xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-5">
          Edit Book
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["title", "author", "genre", "date"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "date" ? "date" : "text"}
                name={field}
                id={field}
                value={form[field]}
                onChange={update(field)}
                onBlur={field === "date" ? handleDateBlur : undefined}
                placeholder=" "
                className={inputFieldClass(field)}
              />
              <label htmlFor={field} className={labelFieldClass(field)}>
                {field === "date"
                  ? "Publication Date"
                  : capitalize(field)}
              </label>
              {errors[field] && (
                <p className={errorClass}>{errors[field]}</p>
              )}
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
          <label htmlFor="imageUrl" className={labelFieldClass("imageUrl")}>
            Image URL (Optional)
          </label>
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
          <label htmlFor="summary" className={labelFieldClass("summary")}>
            Summary
          </label>
          {errors.summary && (
            <p className={errorClass}>{errors.summary}</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-12 py-4 text-lg bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}