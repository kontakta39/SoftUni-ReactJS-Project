import { createContext, useContext, useEffect } from "react";
import usePersistedState from "../hooks/usePersistedState";
import useRequest from "../hooks/useRequest";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = usePersistedState(null, "user");

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    const { request } = useRequest(logout);

    const register = async (username, email, password) => {
        const result = await request("/users/register", "POST", {
            username,
            email,
            password,
        });

        setUser(result);
        return result;
    };

    const login = async (email, password) => {
        const result = await request("/users/login", "POST", {
            email,
            password,
        });

        setUser(result);
        return result;
    };

    {/* Check if access token is valid */}
    useEffect(() => {
        if (user?.accessToken) {
            request("/users/me", "GET", null, {
                accessToken: user.accessToken,
            }).catch(() => {
                logout();
            });
        }
    }, [user?.accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user?.accessToken,
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}