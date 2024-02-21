import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function FeaturedServices() {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    async function fetchFeaturedServices() {
      await fetch("http://localhost:8080/featured-service")
        .then(async (data) => {
          const response = await data.json();
          const filteredFeaturedServices = response.filter(service => service.id !== 1);
          
          setFeaturedServices(filteredFeaturedServices);
        });
    }
    fetchFeaturedServices();
  }, []);

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text; 
  }

  return (
    <div id="service-holder" className="flex">
      {featuredServices.map(service => (
        <div id="service-holder-div" key={service.id} className='flex flex-col justify-between items-center gap-3 m-4 p-4 bg-gray-200 w-[350px] rounded-xl '>
            <img src={`http://localhost:8080/${service.image}`} className='w-full h-[12rem] object-cover p-1' alt='' />
          <div className="flex flex-col gap-2 items-center ">
            <h2 className="text-xl semi-bold ">{service.header}</h2>                
            <p className=" text-sm flex justify-start h-[9rem] ">{truncateText(service.description, 100)}</p>
           <div className="w-full">
                <Link to={`/featured-service/${service.id}`} className="flex p-2 text-sm w-full bg-lime-500 text-white rounded-xl hover:bg-green-950">
                Saiba Mais
                </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}