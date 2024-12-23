import React from 'react';
import { Plane, Users, Globe, Shield, Award, Check } from 'lucide-react';

const QAirlineIntro = () => {
  const stats = [
    { icon: <Plane className="h-10 w-10" />, value: "500+", label: "Chuyến bay mỗi ngày" },
    { icon: <Users className="h-10 w-10" />, value: "2M+", label: "Hành khách phục vụ" },
    { icon: <Globe className="h-10 w-10" />, value: "50+", label: "Điểm đến" },
    { icon: <Award className="h-10 w-10" />, value: "15+", label: "Năm kinh nghiệm" }
  ];

  return (
    <div className="container mx-auto px-6 -mt-24 relative z-10 pt-20">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-12 border">
        <div className="text-center mb-8 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-[#008080] bg-clip-text mb-6">
            Chào mừng đến với <span className="text-[#DAA520]">Q</span>Airline
          </h2>
          <p className="text-gray-600 text-xl leading-relaxed">
            Hãng hàng không hàng đầu Việt Nam với nhiều năm kinh nghiệm
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
          {stats.map((stat, index) => (
            <div key={index} 
                 className="relative overflow-hidden group rounded-2xl p-4 sm:p-8 bg-white hover:bg-gradient-to-br hover:from-[#008080] hover:to-[#006666] transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex flex-col items-center space-y-2 sm:space-y-4">
                <div className="text-[#DAA520] group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-[#008080] group-hover:text-white transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600 group-hover:text-white/90 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#008080] mb-6 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#DAA520]" />
              Cam kết của chúng tôi
            </h3>
            <ul className="space-y-4">
              {['An toàn là ưu tiên hàng đầu', 'Dịch vụ khách hàng 24/7', 'Đội ngũ phi hành đoàn chuyên nghiệp'].map((item, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-full bg-[#008080]/10 group-hover:bg-[#008080] transition-colors duration-300">
                    <Check className="h-4 w-4 text-[#008080] group-hover:text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#008080] mb-6 flex items-center gap-3">
              <Award className="h-6 w-6 text-[#DAA520]" />
              Dịch vụ nổi bật
            </h3>
            <ul className="space-y-4">
              {['Đội bay hiện đại', 'Mạng lưới đường bay rộng khắp châu Á', 'Chương trình thành viên hấp dẫn'].map((item, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <div className="p-2 rounded-full bg-[#008080]/10 group-hover:bg-[#008080] transition-colors duration-300">
                    <Check className="h-4 w-4 text-[#008080] group-hover:text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QAirlineIntro;