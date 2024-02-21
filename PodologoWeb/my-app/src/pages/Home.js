import {useEffect, useState} from 'react';
import FeaturedSevices from '../components/FeaturedServices';

import AddReview from '../components/AddReview';
import ShowReviews from '../components/ShowReviews';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';


function Home(){
    const [featured, setFeatured] = useState({});
    const [user, setUser] = useState({});
    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
        setUser({});

    };

    useEffect(() => {
      async function fetchFeaturedProduct (){
          await fetch("http://localhost:8080/featured-service/1")
              .then(async (data) =>{
                  const response = await data.json();
                  setFeatured(response);
              });
      }
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
        getUser();
      fetchFeaturedProduct();
      //empty array to load only once the information from the API
    
    }, []);
    useEffect(() => {
        
    }
    , []);

    return (
        <>
            <main>
                <div>
                {user.id? <div className="flex justify-between m-[2rem]">
                    <p>Welcome,  {user.fullName}!</p>  
                    <button className="bg-lime-400 rounded-xl hover:bg-lime-800 p-2" onClick={logout}>Logout</button>
                    </div> : null}
                </div>
                <header className=' shadow-lg w-full relative '>
                    { featured && (
                        <><img src={`http://localhost:8080/${featured.image}`} className='h-[75%] w-full object-cover p-1' alt='' />
                    </>
                    )}
                </header>
                < FeaturedSevices  />
                <div id="animation">
                    <div className="bg-black w-full"  >
                        
                    </div>
                </div>
                <div>
                    <AddReview />
                    <ShowReviews />
                </div>
                

            </main>
            <a id="whatsapp-link" href="https://wa.me/5584988049980" className="fixed right-[2rem] bottom-[6rem]">
                    <FontAwesomeIcon icon={faWhatsapp} className="text-4xl" />
                </a>
            <Footer/>

        </>
    );
}


export default Home;