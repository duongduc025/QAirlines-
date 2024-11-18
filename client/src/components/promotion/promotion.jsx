import React, { useState } from 'react';
import { 
  Plane, 
  Calendar, 
  Tag, 
  Gift, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Star,
  Hotel,
  Car,
  CreditCard
} from 'lucide-react';
import Navbar from '../shared/Navbar';
import QApro from '../../assets/image/QApro.png';

const PromotionCard = ({ title, desc, validUntil, discount, imagePath }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-[#008080]/10">
    <div className="relative h-48">
      <img
        src={imagePath || "/api/placeholder/400/200"}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-[#DAA520] text-white px-4 py-1 rounded-full font-bold">
        -{discount}%
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-[#008080] mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#DAA520]">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">Đến {validUntil}</span>
        </div>
        <button className="flex items-center text-[#008080] hover:text-[#006666] font-medium">
          Chi tiết
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
);

const QairlinePromotions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const categories = [
    { id: 'all', name: 'Tất cả', icon: Star },
    { id: 'flights', name: 'Vé máy bay', icon: Plane },
    { id: 'hotels', name: 'Khách sạn', icon: Hotel },
    { id: 'cars', name: 'Thuê xe', icon: Car },
    { id: 'credit', name: 'Thẻ tín dụng', icon: CreditCard },
  ];

  const promotions = [
    {
      id: 1,
      category: 'flights',
      title: 'Bay Châu Âu Giá Rẻ',
      desc: 'Khám phá châu Âu với giá vé ưu đãi đặc biệt. Áp dụng cho các chuyến bay từ Hà Nội và TP.HCM.',
      validUntil: '31/12/2024',
      discount: 30
    },
    {
      id: 2,
      category: 'hotels',
      title: 'Combo Nghỉ Dưỡng 5 Sao',
      desc: 'Tận hưởng kỳ nghỉ tại các khách sạn 5 sao với ưu đãi đặc biệt khi đặt cùng vé máy bay.',
      validUntil: '30/11/2024',
      discount: 25
    },
    {
      id: 3,
      category: 'flights',
      title: 'Ưu Đãi Đông Nam Á',
      desc: 'Khám phá Đông Nam Á với giá vé siêu tiết kiệm. Áp dụng cho mọi điểm đến trong khu vực.',
      validUntil: '30/09/2024',
      discount: 40
    },
    {
      id: 4,
      category: 'credit',
      title: 'Hoàn Tiền Thẻ Tín Dụng',
      desc: 'Hoàn tiền lên đến 15% cho chủ thẻ tín dụng Qairline khi đặt vé trực tuyến.',
      validUntil: '31/12/2024',
      discount: 15
    },
    {
      id: 5,
      category: 'flights',
      title: 'Du Lịch Nhật Bản',
      desc: 'Trải nghiệm mùa thu Nhật Bản với ưu đãi đặc biệt cho các chuyến bay thẳng.',
      validUntil: '30/10/2024',
      discount: 35
    },
    {
      id: 6,
      category: 'cars',
      title: 'Thuê Xe Tự Lái',
      desc: 'Ưu đãi đặc biệt khi thuê xe tự lái tại các điểm đến nội địa và quốc tế.',
      validUntil: '31/12/2024',
      discount: 20
    },
    {
      id: 7,
      category: 'flights',
      title: 'Bay Úc Siêu Tiết Kiệm',
      desc: 'Khám phá nước Úc xinh đẹp với giá vé ưu đãi đặc biệt từ Qairline.',
      validUntil: '31/12/2024',
      discount: 45
    },
    {
      id: 8,
      category: 'hotels',
      title: 'Resort Maldives 5 Sao',
      desc: 'Nghỉ dưỡng tại Maldives với ưu đãi đặc biệt cho combo vé máy bay và resort.',
      validUntil: '30/11/2024',
      discount: 30
    }
  ];

  const filteredPromotions = selectedCategory === 'all' 
    ? promotions 
    : promotions.filter(promo => promo.category === selectedCategory);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Reset page when category changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#008080] mb-4">
            Ưu Đãi Đặc Biệt từ <span classNamăe = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span>

          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Khám phá những ưu đãi độc quyền và tiết kiệm với các chương trình khuyến mãi hấp dẫn từ QAirline.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 shadow-xl">
          <img 
            src= {QApro}
            alt="Featured promotion"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#008080]/90 to-transparent flex items-center">
            <div className="text-white p-12">
              <div className="inline-block bg-[#DAA520] px-4 py-1 rounded-full text-sm font-bold mb-4">
                Ưu đãi hot
              </div>
              <h2 className="text-4xl font-bold mb-4">SIÊU ƯU ĐÃI GIẢM ĐẾN 50%</h2>
              <p className="mb-6 max-w-[29rem]">
                Đặt vé ngay hôm nay để nhận ưu đãi đặc biệt cho các chuyến bay trong và ngoài nước.
              </p>
              <button className="bg-white text-[#008080] px-8 py-3 rounded-full font-bold hover:bg-[#DAA520] hover:text-white transition duration-300">
                Đặt ngay
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300
                ${selectedCategory === category.id 
                  ? 'bg-[#008080] text-white' 
                  : 'bg-white text-gray-600 hover:bg-[#DAA520] hover:text-white'}`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Promotions Grid with Navigation */}
        <div className="relative">
          {currentPage > 0 && (
            <button
              onClick={prevPage}
              className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg text-[#008080] hover:text-[#DAA520] transition-colors duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPromotions.map(promo => (
              <PromotionCard key={promo.id} {...promo} />
            ))}
          </div>

          {currentPage < totalPages - 1 && (
            <button
              onClick={nextPage}
              className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg text-[#008080] hover:text-[#DAA520] transition-colors duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 
                  ${currentPage === index ? 'bg-[#008080]' : 'bg-gray-300 hover:bg-[#DAA520]'}`}
              />
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-lg border border-[#008080]/10">
          <div className="max-w-2xl mx-auto text-center">
            <Gift className="w-12 h-12 text-[#DAA520] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#008080] mb-4">
              Đừng Bỏ Lỡ Ưu Đãi Nào!
            </h3>
            <p className="text-gray-600 mb-6">
              Đăng ký nhận thông báo để cập nhật những ưu đãi mới nhất từ 
              <span className="block">Cùng <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span></span>

            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#008080] focus:border-transparent"
              />
              <button className="bg-[#008080] text-white px-6 py-3 rounded-lg hover:bg-[#006666] transition duration-300">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default QairlinePromotions;