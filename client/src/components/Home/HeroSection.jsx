import React, { useEffect, useState } from 'react';
import { ChevronDown, Clock, CreditCard, Shield } from 'lucide-react';
import { Link } from 'react-router-dom'; // Update this import
import Airplane from '../../assets/image/airplane.png';


const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 text-white">
    <Icon className="w-6 h-6" />
    <span>{text}</span>
  </div>
);

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-[96vh] overflow-hidden">
  
      <div className="absolute inset-0">
        <img 
          src={Airplane}
          alt="Airplane in sky" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>

    

      {/* Main Content */}
      <div className="relative container mx-auto px-6 h-full flex items-center pb">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 
            className={`
              text-4xl md:text-6xl font-bold mb-6 text-white
              transform transition-all duration-1000
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
            `}
          >
            Vui từng chuyến bay
            
            <span className="block">Cùng <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span></span>
          </h1>

          {/* Subheading */}
          <p 
            className={`
              text-xl md:text-2xl mb-8 text-white
              transform transition-all duration-1000 delay-300
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
            `}
          >
            Trải nghiệm dịch vụ hàng không hàng đầu Việt Nam
          </p>

          {/* CTA Buttons */}
          <div 
            className={`
              space-x-4
              transform transition-all duration-1000 delay-500
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
            `}
          >
            <Link to="/flight">
              <button 
                className="
                  bg-[#008080] text-white 
                  px-8 py-3 rounded-full transition duration-300 
                  transform hover:scale-105
                "
              >
                Đặt vé ngay
              </button>
            </Link>
            <Link to="/promotion">
              <button 
                className="
                  bg-transparent border-2 border-white 
                  hover:bg-[#DAA520] hover:text-white text-white 
                  px-8 py-3 rounded-full transition duration-300
                "
              >
                Xem ưu đãi
              </button>
            </Link>
          </div>

          {/* Features */}
          <div 
            className={`
              mt-12 grid grid-cols-1 md:grid-cols-3 gap-6
              transform transition-all duration-1000 delay-700
              ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
            `}
          >
           
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
          <span className="block mb-2">Cuộn xuống</span>
          <ChevronDown className="w-6 h-6 mx-auto animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;