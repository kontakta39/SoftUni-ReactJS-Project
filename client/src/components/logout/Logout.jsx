import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Logout() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.logout();
        navigate("/");
    }, [auth, navigate]);

    return null;
}