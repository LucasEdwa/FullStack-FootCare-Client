import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function User () {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    const logout = () => {
        localStorage.removeItem("token");
        setPosts([]);
        setUser({});
    }   
    useEffect(() => {
        const getPosts = async () => {
            await fetch("http://localhost:8080/get-reviews", {
                method: "GET",
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then(async (data) => {
                const response = await data.json();
                if (response.posts) {
                    setPosts(response.posts);
                }
            });
        };
        const getUser = async () => {
            await fetch("http://localhost:8080/current-user", {
                method: "GET",
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            }).then(async (data) => {
                const response = await data.json();
                if (response.user) {
                    setUser(response.user);
                }
            });
        };
        getPosts();
        getUser();
    }, []);

    return (
        <main className="flex flex-col gap-6 px-24 py-8">
           <div>
               <button onClick={logout} className="bg-black text-white p-2 rounded-xl">Logout</button>
                {user.id?
                    <h2 className="text-2xl font-semibold">Welcome {user.fullName}</h2>
                    : <>
                        <Link to="/sign-in" className="bg-black text-white p-2 rounded-xl">Sign In</Link> <p>or</p>
                        <Link to="/sign-up" className="bg-black text-white p-2 rounded-xl">Sign Up</Link>
                    </>    }
                                
            </div>
            {user.id?
            <>
                {posts.length > 0 ?
                    <div className="flex flex-col gap-6">
                        <h2 className="text-2xl font-semibold">Your Posts</h2>
                        {posts.map((post) => (
                            <div key={post.id} className="flex flex-col gap-6">
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <p>{post.text}</p>
                            </div>
                        ))}
                    </div>
                    : <p> You have not added any posts yet. </p>
                }
            </>      : null

        }
        <div className="flex gap-4">
            {user.id ? (
                <button onClick={logout} className="underline font-semibold">Logout</button>
                ) : (<>
                    <div className="flex">
                    <Link to="/sign-up" className="underline font-semibold">Sign Up</Link>
                <p>or</p>
                <Link to="/sign-in" className="underline font-semibold">Sign In</Link>
                    </div>
                </>
            )}
            </div>

            
        </main>

    );

}
