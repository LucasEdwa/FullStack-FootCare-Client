import { useParams } from "react-router-dom";
import { useEffect, useState,  } from "react";


// Call this function when the toast is to be displayed


function FeaturedSevice(){

    const{ id } = useParams();

    const [featuredService, setfeaturedService] = useState({});


    useEffect(() => {
        async function FetchfeaturedSevice(){
            await fetch("http://localhost:8080/featured-Service/" + id)                
            .then(async (data) => {

                    const response = await data.json();
                    setfeaturedService(response);
                });
                
        }
        FetchfeaturedSevice();

    }, []);

    return (
      
         
        <div id="featuredSevice-in-featuredSevice" className=' gap-8 h-full  p-4 bg-gray-200 rounded-xl '>
            <img src={`http://localhost:8080/${featuredService.image}`} className='w-1/3 object-cover p-1' alt={featuredService.name || 'Featured Service'} />
            <div className="flex flex-col gap-4 ">
            <h2 className="text-xl semi-bold mb-2">{featuredService.header}</h2>                
            {/*dangeroulysetInnerHTML is usede to respect the original format of texts in this case*/}
            <p dangerouslySetInnerHTML={{ __html: featuredService.description }} className="text-left text-sm" style={{ whiteSpace: 'pre-line' }}/>
             
            
            </div>

            </div>
       
    );
}
export default FeaturedSevice;