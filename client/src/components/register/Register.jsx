import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const fieldsToValidate = ["username", "email", "password", "confirmPassword"];
    const fieldLabels = {
        username: "Username",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
    };

    const update = (field) => (e) => {
        const value = e.target.value;
        setForm(prev => {
            const updatedForm = { ...prev, [field]: value };
            const newErrors = { ...errors };

            if (!value.trim()) newErrors[field] = `${fieldLabels[field]} is required.`;
            else newErrors[field] = undefined;

            if (updatedForm.confirmPassword.trim() !== "") {
                if (updatedForm.password !== updatedForm.confirmPassword)
                    newErrors.confirmPassword = "Passwords do not match.";
                else newErrors.confirmPassword = undefined;
            }

            setErrors(newErrors);
            return updatedForm;
        });
    };

    const validateForm = () => {
        const newErrors = {};
        fieldsToValidate.forEach(f => {
            if (!form[f].trim()) newErrors[f] = `${fieldLabels[f]} is required.`;
        });
        if (form.confirmPassword.trim() !== "" && form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const registerHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await register(form.username, form.email, form.password);
            navigate("/");
        } catch (err) {
            alert(err.message);
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
                onSubmit={registerHandler}
                className="w-full max-w-3xl bg-white shadow-xl rounded-3xl p-10 space-y-10 transform transition-transform duration-300 hover:scale-103 hover:shadow-2xl"
            >
                <h1 className="text-4xl font-bold text-black text-center mb-10 underline decoration-blue-600 decoration-2 underline-offset-5 drop-shadow-md">
                    Register
                </h1>

                {["username", "email", "password", "confirmPassword"].map((field) => (
                    <div key={field} className="relative">
                        <input
                        type={
                            field === "password" || field === "confirmPassword" ? "password"
                            : field === "email" ? "email" : "text"
                        }
                        name={field}
                        id={field}
                        value={form[field]}
                        onChange={update(field)}
                        placeholder=" "
                        className={inputFieldClass(field)}
                        />
                        <label htmlFor={field} className={labelFieldClass(field)}>
                        {fieldLabels[field]}
                        </label>
                        {errors[field] && <p className={errorClass}>{errors[field]}</p>}
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