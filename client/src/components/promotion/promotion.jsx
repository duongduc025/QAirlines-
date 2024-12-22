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
  CreditCard,
  X,
  Bell,
  Newspaper,
  User
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import QApro from '../../assets/image/QApro.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Airplane from '../../assets/image/airplane.png';



const PromotionDetailModal = ({ promotion, isOpen, onClose }) => {
  // Nếu không có promotion, không hiển thị modal
  if (!promotion) return null;
  
  return (
    // Hiển thị modal chi tiết khuyến mãi
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative mt-4 h-[40vh]"> {/* Changed height here */}
          <div className="w-full h-full max-w-xl md:max-w-2xl mx-auto relative">
            <img
              src={promotion.image || Airplane}
              alt={promotion.title}
              className="w-full h-full object-cover rounded-t-xl" 
            />
            {promotion.mark !== "Khác" && (
              <div className="absolute top-6 right-6 bg-[#DAA520] text-white px-4 py-1 rounded-full font-bold">
                {promotion.mark}
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-[#008080]">
                {promotion.title}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {promotion.brief}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-[#DAA520]" />
                <span className="text-gray-700">
                  Đăng ngày: <strong>{new Date(promotion.posted_at).toLocaleDateString('vi-VN')}</strong>
                </span>
              </div>
            </div>
            
            <div className="bg-[#008080]/10 p-4 rounded-lg max-h-64 overflow-y-auto">
              <h4 className="text-[#008080] font-bold mb-2">Chi tiết</h4>
              <div style={{ whiteSpace: 'pre-line' }}>{promotion.content}</div>
            </div>
            
            <div className="flex justify-center mt-4">
              <button 
                onClick={onClose}
                className="bg-[#008080] text-white px-6 py-3 rounded-lg hover:bg-[#006666] transition duration-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PromotionCard = ({ promotion, onShowDetails }) => (
  // Hiển thị thẻ khuyến mãi
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-[#008080]/10">
    <div className="relative w-full h-0 pb-[56.25%]"> 
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
    <div className="p-6">
      <h3 className="text-xl font-bold text-[#008080] mb-2">{promotion.title}</h3>
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

const QairlinePromotions = () => {
  // Lấy danh sách tất cả khuyến mãi từ store
  const { allPromotions } = useSelector((store)=> store.promotion);
  const [promotions, setPromotions] = useState(allPromotions);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const itemsPerPage = 6;

  const categories = [
    { id: 'all', name: 'Tất cả', icon: Star },
    { id: 'Khuyến mãi', name: 'Khuyến mãi', icon: Tag },
    { id: 'Thông báo', name: 'Thông báo', icon: Bell },
    { id: 'Tin tức', name: 'Tin tức', icon: Newspaper },
    { id: 'Giới thiệu', name: 'Giới thiệu', icon: User },
  ];

  // Lọc khuyến mãi theo danh mục
  const filteredPromotions = selectedCategory === 'all' 
    ? promotions 
    : promotions.filter(promo => promo.category === selectedCategory);

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedPromotions = filteredPromotions.slice(startIndex, startIndex + itemsPerPage);

  // Chuyển sang trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Quay lại trang trước
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  React.useEffect(() => {
    setPromotions([...allPromotions]);
  }, [allPromotions]);

  // Xử lý khi nhấn nút "Đặt ngay"
  const handleBookNow = () => {
    navigate('/flight');
  };

  return (
    <>
    <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#008080] mb-4">
            Ưu đãi đặc biệt từ <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span>

          </h1>
          <p className="text-gray-600 max-w-4xl mx-auto text-xl">
            Khám phá những ưu đãi độc quyền với các chương trình khuyến mãi hấp dẫn từ QAirline.
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
                HOT
              </div>
              <h2 className="text-4xl font-bold mb-4">KHUYẾN MÃI & TIN TỨC</h2>
              <p className="mb-6 max-w-[29rem]">
                Đặt vé ngay hôm nay để nhận ưu đãi đặc biệt cho các chuyến bay trong và ngoài nước.
              </p>
              <button 
                onClick={handleBookNow}
                className="bg-white text-[#008080] px-8 py-3 rounded-full font-bold hover:bg-[#DAA520] hover:text-white transition duration-300"
              >
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
                <PromotionCard 
                  key={promo._id} 
                  promotion={promo} 
                  onShowDetails={(promotion) => setSelectedPromotion(promotion)} 
                />
              ))}
            </div>

       
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
    <PromotionDetailModal 
        promotion={selectedPromotion}
        isOpen={!!selectedPromotion}
        onClose={() => setSelectedPromotion(null)}
      />
    <Footer/>
    </>
  );
};

export default QairlinePromotions;