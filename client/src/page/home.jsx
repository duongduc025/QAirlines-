import React from "react";
function Home() {
  return (
    <div className="relative h-screen bg-cover bg-center" 
    style={{backgroundImage : "url('../src/assets/image/plane1.png')"}}>
      <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center'> 
      <h1 className='text-4x1 md:text-6x1 font-bold text-white mb-4'>Explore the world with Us!</h1>
      <p className='text-lg nd:text-2x1 text-white mb-8'>Discover new destinations, book flights, and manage your trips with ease.</p>
      <button className='border text-white px-6 py-2 rounded-full text-lg md:text-xl hover:bog-blue-500
      transform transition duration-300 hover:scale-105 '>Get started!</button>
      </div>
    </div>
  );
}
export default Home;