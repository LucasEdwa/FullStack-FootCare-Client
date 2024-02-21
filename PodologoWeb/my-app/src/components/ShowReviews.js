import { useState, useEffect, useCallback } from "react";
import {RatingReview} from "./RatingReview";

function ShowReviews() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchReviews = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:8080/get-reviews");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            data = data.sort((a, b) => new Date(b.published) - new Date(a.published));
            setReviews(data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }, []); // No dependencies

    useEffect(() => {
        fetchReviews();
        
        const interval = setInterval(() => {
            fetchReviews();
        }, 1000);
        return () => clearInterval(interval);
    }, [fetchReviews]); // add fetchReviews as a dependency

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    //Here we make to show the time 
    function timeAgo(dateParam) {
        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const today = new Date();
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const months = Math.round(days / 30);
        const years = Math.round(months / 12);
    
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (minutes < 60) {
            return `${minutes} minutes ago`;
        } else if (hours < 24) {
            return `${hours} hours ago`;
        } else if (days < 30) {
            return `${days} days ago`;
        } else if (months < 12) {
            return `${months} months ago`;
        } else {
            return `${years} years ago`;
        }
    }
    
    return (
        <>
                <h1 className="text-xl p-2  text-center">Avaliações dos clientes: </h1>

                <div  className="w-full reviews-wrapper grid grid-flow-col p-2 overflow-y-auto overflow-x-hidden max-h-[100vh] ">
                        <div  className=" flex flex-col w-[screen] rounded-xl items-center justify-center">
                            {reviews.length > 0 ? (
                                ( reviews.map((review) => (
                                    <div  className="  w-full border-2 rounded-2xl p-1 mt-[1rem]" key={review.id}>
                                        <div className=' h-1/2 p-2 rounded-xl w-full review-holder'>
                                            <div className=" flex review rounded-3xl pl-3 gap-1  bg-lime-600/70">
                                                <div className="flex justify-center items-center p-3 gap-1 bg-stone-400/30 rounded-full ">
                                                    <h3 className="text-[10px] pl-2">Avaliação: </h3>
                                                    <RatingReview value={review.rating} readOnly={true} /> 
                                                </div>
                                                <div className=" w-[75%]">
                                                    <h3 className="text-[10px]">Nome : <span className="text-[15px]">{review.name}</span></h3>

                                                    <p className=" p-1 text-sm break-words ">{review.text}</p>
                                                    <p className="text-xs w-[9rem]  ">postado á: <span className="italic text-2xs">{timeAgo(review.published)}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            ) : (
                                <p>No reviews available.</p>
                            )}
                            
                        </div>
                </div>
        </>
    );
}

export default ShowReviews;