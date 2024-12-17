import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const PromotionCard = ({ promotion, onShowDetails }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 border border-[#008080]/10 w-[450px] mx-auto">
    <div className="relative w-full h-0 pb-[50%]"> 
      <img
        src={promotion.image || "/home/hdd/Documents/QAirlineX/QAirlines/client/src/assets/image/QApro.png"}
        alt={promotion.title}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      {promotion.mark !== "Khác" && (
        <div className="absolute top-4 right-4 bg-[#DAA520] text-white px-4 py-1 rounded-full font-bold">
          {promotion.mark}
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold text-[#008080] mb-2">{promotion.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{promotion.brief}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#DAA520]">
          <Clock className="w-4 h-4 mr-2" />
          <strong> {new Date(promotion.posted_at).toLocaleDateString('vi-VN')}</strong>
          </div>
        <button 
          onClick={() => onShowDetails(promotion)}
          className="flex items-center text-[#008080] hover:text-[#006666] font-medium"
        >
          Chi tiết
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
);

const RemarkablePromotions = () => {
  const { allPromotions } = useSelector(store => store.promotion);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  const navigate = useNavigate(); // Add this line

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleShowDetails = (promotion) => {
    navigate('/promotion', { state: { promotion } }); // Add this function
  };

  return (
    <div className="relative max-w-[1440px] mx-auto px-8 py-8">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-md hover:bg-white"
      >
        <ChevronLeft className="w-8 h-8 text-[#008080]" />
      </button>

      <div 
        ref={containerRef}
        className="flex overflow-x-hidden gap-8 scroll-smooth py-6"
      >
        {allPromotions.map((promotion, index) => (
          <div key={index} className="flex-none">
            <PromotionCard 
              promotion={promotion}
              onShowDetails={handleShowDetails} // Update this line
            />
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-md hover:bg-white"
      >
        <ChevronRight className="w-8 h-8 text-[#008080]" />
      </button>
    </div>
  );
};

export default RemarkablePromotions;
