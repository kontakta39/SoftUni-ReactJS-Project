export async function logout(token) {
    const res = await fetch("http://localhost:3030/users/logout", {
        method: "GET",
        headers: {
            "X-Authorization": token,
        },
    });

    if (res.status !== 204) {
        throw new Error("Logout failed");
    }

    return true;
}