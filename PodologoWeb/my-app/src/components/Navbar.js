import { Link } from 'react-router-dom';
import logo from '../img/logo.jpeg';

function Navbar (){

    return (
       <>
        <div className='bg-yellow-100'>
            <nav className="flex text-white justify-between w-full p-4 bg-lime-400/90 sm:flex-row">
            <img src={logo} alt="logo" className='w-20 h-10 rounded-2xl opacity-1'/>
            <ul className={`flex gap-6 `}>
             
                <li>
                    <Link to="/">Home</Link>
                </li>
                
          
            </ul>
            </nav>    
        </div>     </>
    );
}
export default Navbar;