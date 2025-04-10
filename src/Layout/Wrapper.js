import { useEffect, useState } from "react";
import GLogin from "./GLogin";

export default function Wrapper() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("https://rect-zmzt.onrender.com//oauth2/success", {
            method: "GET",
            credentials: "include", // Sends authentication cookies
        })
            .then(res => res.json())
            .then(data => setUser(data))
            .catch(err => console.error("Error fetching user:", err));
    }, []);

    return (
        <div>
            <h1>Google OAuth Login</h1>
            {user?.name ? (
                <div>
                    <p>Welcome, {user.name}!</p>
                    <p>Email: {user.email}</p>
                    <img src={user.picture} alt="Profile" />
                </div>
            ) : (
                <GLogin />
            )}
        </div>
    );
}
