import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn () {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const SignIn = async () => {

        await fetch("http://localhost:8080/sign-in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),

        }).then(async (data) => {
            const response = await data.json();

            if (response.token) {
                localStorage.setItem("token", response.token);
                navigate("/");
            } else if (response.error) {
                setError(response.error);
            } else {
                setError("Something went wrong, please try again later.");
            }

        }).catch((error) => {
            console.log(error);
        });

    
    };

    return (
        <main className="flex flex-col gap-6 px-24 py-8 h-screen">
            <h2 className="text-2xl font-semibold">Login</h2>
            <p>
                Login to your account!
            </p>
            {error ?
                <div className="bg-red-500 text-white p-4 rounded-xl">
                    {error}
                </div> : null
            }
            <input value={email} onChange={(e) => (
                setEmail(e.target.value))} 
                placeholder="Email" type="email" className="border-2 border-gray-200 p-2 rounded-xl" />
            <input value={password} onChange={(e) => (
                setPassword(e.target.value))} 
                placeholder="Password" type="password" className="border-2 border-gray-200 p-2 rounded-xl" />
            <button onClick={SignIn} className="bg-lime-500 hover:bg-green-950 text-white p-2 rounded-xl">Login!</button>
        </main>
    );
}