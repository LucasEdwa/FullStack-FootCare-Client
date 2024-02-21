import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: ""
    });
    const [error, setError] = useState("");

    const register = async () => {

        await fetch("http://localhost:8080/sign-up", 
        {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then( async (data) => {
            const response = await data.json();
            if (response.success) {
                navigate("/sign-in");
            } else if (response.error) {
                setError(response.error);
            } else {
                setError("Something went wrong.");
            }
        }).catch((error) => {
            console.log(error);
        });
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }

    return (
        <>
           <main className="flex flex-col gap-6 px-24 py-8 h-screen">
            <h2 className="text-2xl font-semibold">Register</h2>
            {error ?
                    <div className="bg-red-500 text-white p-4 rounded-xl">
                        {error}
                    </div> : null
                }
            
                <input name="email"  placeholder="Email" onChange={handleFormChange} type="email" className="border-2 border-gray-200 p-2 rounded-xl" />
                <input  name="password" placeholder="Password" onChange={handleFormChange} type="password" className="border-2 border-gray-200 p-2 rounded-xl" />
                <input name="fullName" placeholder="Full Name" onChange={handleFormChange} type="text" className="border-2 border-gray-200 p-2 rounded-xl" />
                <button onClick={register} className="bg-lime-500 hover:bg-green-950 text-white p-2 rounded-xl">Register!</button>
            </main>
        </>
    );
}