import React, { useState } from 'react';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const initialPassengerState = {
  fullname: '',
  gender: '',
  dob: '',
  id_number: ''
};

const PassengerInfo = ({ onSubmit, selectedFlight, returnFlight, numberOfPassenger, onBack }) => {
    const [passengers, setPassengers] = useState(
        Array(numberOfPassenger).fill(null).map(() => ({ ...initialPassengerState }))
      );
      const [errors, setErrors] = useState(Array(numberOfPassenger).fill({}));
      const { loading } = useSelector(store => store.auth);

      useEffect(() => {
        if (passengers.length < numberOfPassenger) {
          const additionalPassengers = Array(numberOfPassenger - passengers.length)
            .fill(null)
            .map(() => ({ ...initialPassengerState }));
          setPassengers([...passengers, ...additionalPassengers]);
          setErrors([...errors, ...Array(numberOfPassenger - passengers.length).fill({})]);
        } else if (passengers.length > numberOfPassenger) {
          setPassengers(passengers.slice(0, numberOfPassenger));
          setErrors(errors.slice(0, numberOfPassenger));
        }
      }, [numberOfPassenger]);
    
  // Hàm định dạng ngày giờ
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  // Hàm kiểm tra định dạng số CMND/Hộ chiếu
  const validateIdNumber = (idNumber) => {
    const passportRegex = /^[A-Z0-9]{8,9}$/;
    const cccdRegex = /^[0-9]{12}$/;
    return passportRegex.test(idNumber) || cccdRegex.test(idNumber);
  };

  // Hàm kiểm tra tính hợp lệ của form
  const validateForm = () => {
    
    const newErrors = passengers.map(passenger => {
      const passengerErrors = {};
      
      
      if (!passenger.gender) {
        passengerErrors.gender = 'Vui lòng chọn giới tính';
      }

      if (!passenger.dob) {
        passengerErrors.dob = 'Vui lòng nhập ngày sinh';
      }

      if (!passenger.id_number.trim()) {
        passengerErrors.id_number = 'Vui lòng nhập số CMND/Hộ chiếu';
      }

      if (!validateIdNumber(passenger.id_number.trim())) {
        passengerErrors.id_number = 'Số CMND/Hộ chiếu không hợp lệ';
      }

      return passengerErrors;
    });

    setErrors(newErrors);
    return newErrors.every(error => Object.keys(error).length === 0);
  };

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formData = {
        flight_id: returnFlight ? undefined : selectedFlight._id,
        outbound_flight_id: returnFlight ? selectedFlight._id : undefined,
        return_flight_id: returnFlight ? returnFlight._id : undefined,
        ticket_quantity: passengers.length,
        passengers: passengers.map(({ fullname, gender, dob, id_number }) => ({
          fullname,
          gender,
          dob,
          identity_number: id_number
        }))
      };
      onSubmit(formData);
    }
  };

  // Hàm xử lý khi thay đổi thông tin hành khách
  const handleChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  // Hàm tính tổng giá vé
  const calculateTotalPrice = () => {
    const departurePrice = selectedFlight ? selectedFlight.economy_price * passengers.length : 0;
    const returnPrice = returnFlight ? returnFlight.economy_price * passengers.length : 0;
    return departurePrice + returnPrice;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#008080] p-6 text-white">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="text-white hover:text-[#DAA520] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Thông tin hành khách</h2>
          </div>
        </div>

        {/* Flight Info */}
        {selectedFlight && (
          <div className="bg-[#008080]/10 p-6 border-b border-[#008080]/20">
            <h3 className="text-[#008080] font-semibold mb-4">Thông tin chiều đi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className = 'px-8'>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Hãng bay:</span>
                  <span className="font-medium">QAirline</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Chuyến bay:</span>
                  <span className="font-medium">{selectedFlight.departure_location} - {selectedFlight.destination}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Ngày bay:</span>
                  <span className="font-medium">{formatDateTime(selectedFlight.departure_time)}</span>
                </p>
              </div>
              <div className = 'px-8'>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giờ bay:</span>
                  <span className="font-medium">{selectedFlight.travel_time}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Số hành khách:</span>
                  <span className="font-medium">{passengers.length}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giá vé:</span>
                  <span className="font-medium text-[#DAA520]">
                    {selectedFlight ? selectedFlight.economy_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 VND'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {returnFlight && (
          <div className="bg-[#008080]/10 p-6 border-b border-[#008080]/20">
            <h3 className="text-[#008080] font-semibold mb-4">Thông tin chiều về:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className = 'px-8'>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Hãng bay:</span>
                  <span className="font-medium">QAirline</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Chuyến bay:</span>
                  <span className="font-medium">{returnFlight.departure_location} - {returnFlight.destination}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Ngày bay:</span>
                  <span className="font-medium">{formatDateTime(returnFlight.departure_time)}</span>
                </p>
              </div>
              <div className = 'px-8'>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giờ bay:</span>
                  <span className="font-medium">{returnFlight.travel_time}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Số hành khách:</span>
                  <span className="font-medium">{passengers.length}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giá vé:</span>
                  <span className="font-medium text-[#DAA520]">
                    {returnFlight ? returnFlight.economy_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 VND'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Forms */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {passengers.map((passenger, index) => (
            <Card key={index} className="border-[#008080]/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#008080]">
                    Hành khách {index + 1}
                  </h3>
                
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                    <div>
                      <Label htmlFor={`fullname-${index}`} className="text-[#008080] font-medium">
                        Họ và tên
                      </Label>
                      <Input
                        id={`fullname-${index}`}
                        value={passenger.fullname}
                        onChange={(e) => handleChange(index, 'fullname', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.fullname && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].fullname}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`gender-${index}`} className="text-[#008080] font-medium">
                        Giới tính
                      </Label>
                      <Select 
                        value={passenger.gender}
                        onValueChange={(value) => handleChange(index, 'gender', value)}
                      >
                        <SelectTrigger className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[index]?.gender && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].gender}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                    <div>
                      <Label htmlFor={`dob-${index}`} className="text-[#008080] font-medium">
                        Ngày sinh
                      </Label>
                      <Input
                        id={`dob-${index}`}
                        type="date"
                        value={passenger.dob}
                        onChange={(e) => handleChange(index, 'dob', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.dob && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].dob}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`id_number-${index}`} className="text-[#008080] font-medium">
                        Số CMND/Hộ chiếu
                      </Label>
                      <Input
                        id={`id_number-${index}`}
                        value={passenger.id_number}
                        onChange={(e) => handleChange(index, 'id_number', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.id_number && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].id_number}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

       

          {/* Summary and Submit */}
          <div className="pt-6 space-y-4">
            <Card className="border-[#008080]/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#008080] mb-4">Tổng kết đặt vé</h3>
                <div className="space-y-2">
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-600">Số lượng hành khách:</span>
                    <span className="font-medium">{passengers.length}</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá vé mỗi người:</span>
                    <span className="font-medium">
                      {(selectedFlight?.economy_price + (returnFlight?.economy_price || 0)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </p>
                  <div className="border-t border-[#008080]/20 my-2"></div>
                  <p className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-800">Tổng tiền:</span>
                    <span className="text-[#DAA520]">
                      {calculateTotalPrice().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit"
              className="w-full bg-[#DAA520] hover:bg-[#DAA520]/90 text-white py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận đặt vé'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerInfo;