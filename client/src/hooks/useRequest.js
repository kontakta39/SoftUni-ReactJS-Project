const baseUrl = "http://localhost:3030";

export default function useRequest() {
    const request = async (url, method = "GET", data = null, config = {}) => {
        const options = { method, headers: {} };

        if (data) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
        }

        if (config.accessToken) {
            options.headers["X-Authorization"] = config.accessToken;
        }

        const res = await fetch(baseUrl + url, options);

        if (!res.ok && res.status !== 204) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || res.statusText);
        }

        if (res.status === 204) return {};

        return await res.json();
    };

    return { request };
}