import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useRequest from "../../hooks/useRequest";
import useForm from "../../hooks/useForm";

export default function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { request } = useRequest();

    const initialValues = {
        title: "",
        author: "",
        genre: "",
        date: "",
        imageUrl: "",
        summary: "",
    };

    const fieldLabels = {
        title: "Title",
        author: "Author",
        genre: "Genre",
        date: "Publication Date",
        imageUrl: "Image URL (Optional)",
        summary: "Summary",
    };
    
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const data = await request(`/data/books/${bookId}`);

                if (data._ownerId !== user?._id) {
                    alert("You are not authorized to edit this book!");
                    navigate(`/book/details/${bookId}`);
                    return;
                }

                setValues({
                    title: data.title || "",
                    author: data.author || "",
                    genre: data.genre || "",
                    date: data.date || "",
                    imageUrl: data.imageUrl || "",
                    summary: data.summary || "",
                });
            } catch (err) {
                alert(err.message);
            }
        };

        fetchBook();
    }, [bookId, user, isAuthenticated]);

    const validateField = (field, values) => {
        const value = values[field]?.trim();

        if (["title", "author", "genre"].includes(field) && !value)
            return `${fieldLabels[field]} is required.`;

        if (field === "date" && !value) return "Publication Date is required.";

        if (field === "summary") {
            if (!value) return "Summary is required.";
            if (value.length < 10 || value.length > 1000)
                return "Summary must be between 10 and 1000 characters.";
        }

        return "";
    };

    const onSubmit = async (formValues) => {
        const updatedBook = {
            ...formValues,
            imageUrl: formValues.imageUrl || "/images/book-no-image-available.jpg",
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

    useEffect(() => {
        if (!isAuthenticated) navigate("/login");
    }, [isAuthenticated, navigate]);

    const { values, errors, touched, register, handleSubmit, setValues } = useForm(
        initialValues,
        validateField,
        onSubmit
    );

    const inputFieldClass = (field) =>
        `peer w-full rounded-lg border px-4 py-3 placeholder-transparent bg-white text-black ${
            touched[field] && errors[field] ? "border-red-600" : "border-black"
        } hover:border-blue-600 focus:border-blue-600 focus:outline-none`;

    const labelFieldClass = (field) =>
        `absolute left-4 bg-white px-1 transition-all duration-200 top-3 text-black ${
            values[field] ? "top-[-10px] text-black" : ""
        } peer-hover:text-blue-600 peer-focus:top-[-10px] peer-focus:text-blue-600 peer-focus:text-sm`;

    const errorClass = "text-red-500 text-sm mt-1";

    return (
        <section className="w-full flex justify-center py-16">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10"
            >
                <h1 className="text-4xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-5">
                    Edit Book
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {["title", "author", "genre", "date"].map((field) => (
                        <div key={field} className="relative">
                            <input
                                id={field}
                                type={field === "date" ? "date" : "text"}
                                placeholder=" "
                                className={inputFieldClass(field)}
                                {...register(field)}
                            />
                            <label htmlFor={field} className={labelFieldClass(field)}>
                                {fieldLabels[field]}
                            </label>
                            {touched[field] && errors[field] && (
                                <p className={errorClass}>{errors[field]}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="relative">
                    <input
                        id="imageUrl"
                        placeholder=" "
                        className={inputFieldClass("imageUrl")}
                        {...register("imageUrl")}
                    />
                    <label htmlFor="imageUrl" className={labelFieldClass("imageUrl")}>
                        {fieldLabels["imageUrl"]}
                    </label>
                </div>

                <div className="relative">
                    <textarea
                        id="summary"
                        rows="5"
                        placeholder=" "
                        className={`${inputFieldClass("summary")} resize-none`}
                        {...register("summary")}
                    />
                    <label htmlFor="summary" className={labelFieldClass("summary")}>
                        {fieldLabels["summary"]}
                    </label>
                    {touched.summary && errors.summary && (
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