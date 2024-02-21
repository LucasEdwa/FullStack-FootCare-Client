function Footer() {
  return (
    <footer id='footer' className=" bottom-0 flex justify-between gap-8 items-center p-5 bg-green-900">

        <div id='footer-adress' className="flex flex-col shadow justify-center w-1/3">
            <h2 className="text-sm">Endereço:</h2>

            <p className="text-sm">R. Baía da Traição, 8897 - LJ B - Ponta Negra, Natal 
                - RN, 59094-090, Brasil</p>
        </div>
       <div id="footer-holder" className="gap-5 text-green-400">
            <div id="footer-logo" className="flex flex-col justify-center">
                <h2 className="text-sm underline bold">Pé e pé</h2>
            </div>
            <p className=""> Fale com o podólogo no Whatsapp</p>
        </div>
    </footer>
  );
}
export default Footer;