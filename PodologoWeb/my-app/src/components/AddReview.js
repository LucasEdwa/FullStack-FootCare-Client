//importing icoons to the stars rating
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

//importing the context to refresh the reviews list 
import { useContext, useState, useEffect } from 'react';
import { ReviewRefresh } from '../context/ReviewRefresh';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// function to create the stars rating

function RatingReview({ value, onChange, readOnly}) {
  
  return (
    <div>
      {/** ...to array the 5 stars mapeando
       * the array and creating a label for each star
       * with a radio input and a fontawesome icon
       * the _ is the value of the array, in this case is the index
       * 
       */}
      {[...Array(5)].map((_, i) => {
        {/* i + 1 to start the stars from 1 */}
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => readOnly ? null : onChange(ratingValue)}
              style={{ display: 'none' }}
            />
            <FontAwesomeIcon
              icon={faStar}
              color={ratingValue <= value ? '#ffc107' : '#e4e5e9'}
              size="xl"
            />
          </label>
        );
      })}
    </div>
  );
}

export default function AddReviews() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const { setRefreshKey } = useContext(ReviewRefresh);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [review, setReview] = useState("");
  const [user, setUser] = useState(null);
  

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
  useEffect(() => {
    getUser();
  }, []);
  
  const addReview = async (event) => {
    event.preventDefault();
    setRefreshKey(prevKey => prevKey + 1);
    const now = new Date();
    const timestamp = now.toISOString();
  
    try {
      await fetch('http://localhost:8080/add-review/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ name, rating, text, date: timestamp }),
      }).then(async (data) => {
        const response = await data.json();

        if (response.success) {
          navigate("/");
          setName("");
          setRating(0);
          setText("");
        } else if (response.error) {
          setError(response.error);
          setReview("");
          toast.error(response.error);
        } else {
          setError("Something went wrong.");
          toast.error("Something went wrong.");
        }
      }).catch((error) => {
        toast.error('An error occurred while adding the review.');
      });
    }
    catch (error) {
      toast.error('An error occurred while adding the review.');
    }
  }

  return (
    <>
      <div  className="block m-8 -z-3 ">

        <h1 className="text-xl p-2 text-center ">Conte-nos como foi sua expêriencia no pé e pé: </h1>
        
        <div id="add-review-container" className="flex justify-center m-2 bg-lime-500/60 h-1/2">
          <div className="w-full  flex items-center  flex-col justify-center bg-green-400/30  p-6">
          <p className="items center bg-slate-300/50 rounded-md p-[3px]  ">Compartilhe sobre seu atendimento.</p>
               {/* ... */}
               
      {user ? ( // Check if user exists before accessing user.id
        <form className="form flex flex-col gap-3 p-[3rem] w-1/2 rounded-md  bg-gray-100/40 mt-9 " onSubmit={addReview}>
          <label className="text-xs flex justify-between items-end gap-1">
            Nome: 
            <input type="text" value={name} name="name" 
            className=" shadow-inner pl-2 pt-1 pb-1 w-full  bg-transparent placeholder" 
            placeholder="se indentifique"  
            onChange={e => setName(e.target.value)} />

          </label>
          <label className="text-xs ">
            Avaliação:
            <RatingReview value={rating} 
              onChange={(value) => setRating(parseInt(value))} 
              />            
          </label>
          <label className="text-xs">
            Deixe seu comentário:
            <textarea className="w-full h-[50px] shadow-inner bg-transparent resize-none placeholder" 
            placeholder="Start typing here..." name="message" value={text} onChange={e => setText(e.target.value)} />            
            </label>
            <div className="flex justify-center">
              <button className="w-[6rem] p-2 rounded-full border hover:scale-75 hover:bg-lime-400/90 hover:border-black bg-lime-700/90" type="submit" >Enviar</button>

            </div>
        </form>
        
        ):
         (<><Link to='/sign-in'> Sign-In </Link> <p>or</p> <Link to='/sign-up'> Sign-Up </Link></>)}
      {/* ... */}
          </div>
        </div>
      </div>
      
    </>

  );
}