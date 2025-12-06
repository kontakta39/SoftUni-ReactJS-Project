import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Logout() {
    var auth = useAuth();
    var navigate = useNavigate();

    try {
        auth.logout();
    } catch (err) {
        alert("Problem with logout: " + err.message);
    } finally {
        navigate("/");
    }

    return null; 
}