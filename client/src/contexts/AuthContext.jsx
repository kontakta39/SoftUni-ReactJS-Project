import { createContext, useContext } from "react";
import usePersistedState from "../hooks/usePersistedState";
import useRequest from "../hooks/useRequest";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = usePersistedState(null, "user");
    const { request } = useRequest();

    const register = async (username, email, password) => {
        const result = await request("/users/register", "POST", { username, email, password });
        setUser(result);
        return result;
    };

    const login = async (email, password) => {
        const result = await request("/users/login", "POST", { email, password });
        setUser(result);
        return result;
    };

    const logout = async () => {
        if (!user?.accessToken) return;
        await request("/users/logout", "GET", null, { accessToken: user.accessToken });
        setUser(null);
    };

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