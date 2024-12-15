import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FlightConfirmation = ({ selectedFlight, flightType = 'oneway', numberOfPassenger, onConfirm }) => {
  if (!selectedFlight) {
    return (
      <Card className="w-full md:w-1/4 fixed md:right-[3rem] md:top-[12rem] h-[50] p-6 border-l border-[#008080] bg-[#00808010]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#008080] text-center">Chi tiết đặt vé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center">Vui lòng chọn một chuyến bay</p>
        </CardContent>
      </Card>
    );
  }

  const FlightInfo = ({ flight, label }) => (
    <div className="mb-4">
      {label && (
        <h4 className="text-[#008080] font-medium mb-2">{label}</h4>
      )}
      <div className="text-sm space-y-2">
        <p><span className="text-[#DAA520] font-semibold">Ngày bay:</span> {flight.date}</p>
        <p>
          <span className="text-[#DAA520] font-semibold">Giờ bay:</span> {flight.departureTime} - {flight.arrivalTime}
        </p>
        <p>
          <span className="text-[#DAA520] font-semibold">From </span>
          <span className="font-semibold text-[#008080]">{flight.departure} </span>
          <span className="text-[#DAA520] font-semibold">To </span>
          <span className="font-semibold text-[#008080]">{flight.arrival}</span>
        </p>
        <p>
          <span className="text-[#DAA520] font-semibold">Hạng vé: </span>
          <span>{flight.cabinClass || 'Economy'}</span>
        </p>
        <p>
          <span className="text-[#DAA520] font-semibold">Số hành khách:</span> {numberOfPassenger}
        </p>
      </div>
    </div>
  );

  const totalPrice = flightType === 'roundtrip'
    ? (selectedFlight.departure?.price || 0) + (selectedFlight.return?.price || 0)
    : selectedFlight.price;

  return (
    <Card className="w-full md:w-1/4 md:fixed md:right-[3rem] md:top-[12rem] p-2 border-l border-[#008080] bg-[#00808010]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#008080] text-center">
          Chi tiết đặt vé {flightType === 'roundtrip' ? 'khứ hồi' : 'một chiều'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-[#008080] text-xl">Thông tin chuyến bay</h3>
            
            {flightType === 'roundtrip' ? (
              <>
                <FlightInfo 
                  flight={selectedFlight.departure} 
                  label="Chuyến đi"
                />
                <FlightInfo 
                  flight={selectedFlight.return} 
                  label="Chuyến về"
                />
              </>
            ) : (
              <FlightInfo flight={selectedFlight} />
            )}
          </div>
          
          <Separator className="bg-[#00808040]" />
          
          {flightType === 'roundtrip' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#DAA520] font-semibold">Chuyến đi:</span>
                <span>{selectedFlight.departure.price.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#DAA520] font-semibold">Chuyến về:</span>
                <span>{selectedFlight.return.price.toLocaleString()}đ</span>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2 text-[#008080]">Tổng tiền</h3>
            <p className="text-xl font-bold text-[#DAA520]">
              {totalPrice.toLocaleString()}đ
            </p>
          </div>
          
          <Button 
            className="w-full bg-[#008080] hover:bg-[#006666] text-white"
            onClick={onConfirm}
          >
            Xác nhận đặt vé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightConfirmation;