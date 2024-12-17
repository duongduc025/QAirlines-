import React from 'react';
import { Plane, ShieldCheck, Clock, CreditCard } from 'lucide-react';

const features = [
  {
    icon: Plane,
    title: "Bay Thẳng",
    description: "Kết nối hơn 100+ điểm đến với các chuyến bay thẳng tiện lợi."
  },
  {
    icon: ShieldCheck,
    title: "An Toàn",
    description: "An toàn là ưu tiên hàng đầu với các biện pháp bảo vệ hàng đầu."
  },
  {
    icon: Clock,
    title: "Hỗ Trợ 24/7",
    description: "Dịch vụ khách hàng luôn sẵn sàng hỗ trợ mọi lúc, mọi nơi."
  },
  {
    icon: CreditCard,
    title: "Thanh Toán Linh Hoạt",
    description: "Nhiều phương thức thanh toán an toàn và tiện lợi."
  }
];

const Features = () => {
  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#008080] text-[#DAA520]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#008080]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;