import { useState } from "react";

export default function useForm(initialValues, validateField, onSubmit) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setValues(prev => {
            const updated = { ...prev, [name]: value };

            const fieldError = validateField(name, updated);

            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: fieldError
            }));

            return updated;
        });

        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        Object.keys(values).forEach(field => {
            const error = validateField(field, values);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onSubmit(values, resetForm);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    const register = (fieldName) => ({
        name: fieldName,
        value: values[fieldName],
        onChange: changeHandler,
    });

    return {
        values,
        errors,
        touched,
        register,
        handleSubmit,
        resetForm,
    };
}