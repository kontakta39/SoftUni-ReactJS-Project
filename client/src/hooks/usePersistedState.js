import { useState } from "react";

export default function usePersistedState(initialState, key) {
    const [state, setState] = useState(() => {
        const storageData = localStorage.getItem(key);
        if (storageData) {
            return JSON.parse(storageData);
        }
        return initialState;
    });

    const setPersistedState = (value) => {
        const newValue = typeof value === "function" ? value(state) : value;
        localStorage.setItem(key, JSON.stringify(newValue));
        setState(newValue);
    };

    return [state, setPersistedState];
}