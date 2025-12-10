import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useForm from "../../hooks/useForm";

export default function Register() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const fieldLabels = {
        username: "Username",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
    };

    const validateField = (field, values) => {
        const value = values[field].trim();

        if (!value) return `${fieldLabels[field]} is required.`;

        if (field === "confirmPassword") {
            if (values.password !== values.confirmPassword) {
                return "Passwords do not match.";
            }
        }

        return "";
    };

    const onSubmit = async (formValues) => {
        try {
            await registerUser(
                formValues.username,
                formValues.email,
                formValues.password
            );
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    const { values, errors, touched, register, handleSubmit } = useForm(
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
                className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10 transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl"
            >
                <h1 className="text-4xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-5 drop-shadow-md">
                    Register
                </h1>

                {Object.keys(initialValues).map((field) => (
                    <div key={field} className="relative">
                        <input
                            id={field}
                            type={
                                field === "password" || field === "confirmPassword"
                                    ? "password"
                                    : field === "email"
                                    ? "email"
                                    : "text"
                            }
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

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-12 py-4 text-lg bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                    >
                        Register
                    </button>
                </div>
            </form>
        </section>
    );
}