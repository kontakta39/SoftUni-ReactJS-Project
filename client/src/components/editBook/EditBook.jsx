import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";

export default function EditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { request } = useRequest();

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

  {/* Redirect unauthorized users */}
  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  {/* Fetch book once on mount */}
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await request(`/data/books/${bookId}`);

        {/* Only owner can edit */}
        if (data._ownerId !== user?._id) {
          alert("You are not authorized to edit this book!");
          navigate(`/book/details/${bookId}`);
          return;
        }

        setForm({
          title: data.title || "",
          author: data.author || "",
          genre: data.genre || "",
          date: data.date || "",
          summary: data.summary || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        alert(err.message);
      }
    };

    fetchBook();
    // изпълнява се само веднъж при mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  {/* Update form values + real-time validation */}
  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (fieldsToValidate.includes(field) && field !== "date") {
      let message = "";
      if (field === "summary") {
        if (!value.trim()) message = "Summary is required.";
        else if (value.length < 10 || value.length > 1000)
          message = "Summary must be between 10 and 1000 characters.";
        else message = undefined;
      } else {
        message = value.trim() ? undefined : `${capitalize(field)} is required.`;
      }
      setErrors((prev) => ({ ...prev, [field]: message }));
    }
  };

  {/* onBlur handler for date */}
  const handleDateBlur = () => {
    if (!form.date) setErrors((prev) => ({ ...prev, date: "Publication Date is required." }));
    else setErrors((prev) => ({ ...prev, date: undefined }));
  };

  {/* Validate form on submit */}
  const validateForm = () => {
    const newErrors = {};
    fieldsToValidate.forEach((f) => {
      if (!form[f]?.trim()) {
        newErrors[f] = f === "date" ? "Publication Date is required." : `${capitalize(f)} is required.`;
      }
      if (f === "summary" && form[f]?.trim() && (form[f].length < 10 || form[f].length > 1000)) {
        newErrors[f] = "Summary must be between 10 and 1000 characters.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  {/* Submit edited book */}
  const editBookHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedBook = {
      ...form,
      imageUrl: form.imageUrl || "/images/book-no-image-available.jpg",
      _ownerId: user._id,
      _updatedOn: Date.now(),
    };

    try {
      await request(`/data/books/${bookId}`, "PUT", updatedBook, {
        accessToken: user.accessToken,
      });
      navigate(`/book/details/${bookId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  {/* Helper classes */}
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
      <form onSubmit={editBookHandler} className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10">
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
          {errors.summary && <p className={errorClass}>{errors.summary}</p>}
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