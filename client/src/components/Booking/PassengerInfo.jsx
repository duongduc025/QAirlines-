import React, { useState } from 'react';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const initialPassengerState = {
  name: '',
  gender: '',
  dateOfBirth: '',
  nationality: '',
  idNumber: ''
};

const PassengerInfo = ({ onSubmit, selectedFlight, returnFlight, numberOfPassenger, onBack }) => {
    const [passengers, setPassengers] = useState(
        Array(numberOfPassenger).fill(null).map(() => ({ ...initialPassengerState }))
      );
      const [errors, setErrors] = useState(Array(numberOfPassenger).fill({}));

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
    

  const validateForm = () => {
    const newErrors = passengers.map(passenger => {
      const passengerErrors = {};
      
      if (!passenger.lastName.trim()) {
        passengerErrors.lastName = 'Vui lòng nhập tên';
      }
      
      if (!passenger.gender) {
        passengerErrors.gender = 'Vui lòng chọn giới tính';
      }

      if (!passenger.dateOfBirth) {
        passengerErrors.dateOfBirth = 'Vui lòng nhập ngày sinh';
      }

      if (!passenger.idNumber.trim()) {
        passengerErrors.idNumber = 'Vui lòng nhập số CMND/Hộ chiếu';
      }

      return passengerErrors;
    });

    setErrors(newErrors);
    return newErrors.every(error => Object.keys(error).length === 0);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(passengers);
    }
  };

  const handleChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };



  const calculateTotalPrice = () => {
    const departurePrice = selectedFlight ? selectedFlight.price * passengers.length : 0;
    const returnPrice = returnFlight ? returnFlight.price * passengers.length : 0;
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
              <div>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Hãng bay:</span>
                  <span className="font-medium">{selectedFlight.airline}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Chuyến bay:</span>
                  <span className="font-medium">{selectedFlight.departure} - {selectedFlight.arrival}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Ngày bay:</span>
                  <span className="font-medium">{selectedFlight.departureDate}</span>
                </p>
              </div>
              <div>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giờ bay:</span>
                  <span className="font-medium">{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Số hành khách:</span>
                  <span className="font-medium">{passengers.length}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Tổng giá vé:</span>
                  <span className="font-medium text-[#DAA520]">{calculateTotalPrice().toLocaleString()}đ</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {returnFlight && (
          <div className="bg-[#008080]/10 p-6 border-b border-[#008080]/20">
            <h3 className="text-[#008080] font-semibold mb-4">Thông tin chiều về:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Hãng bay:</span>
                  <span className="font-medium">{returnFlight.airline}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Chuyến bay:</span>
                  <span className="font-medium">{returnFlight.departure} - {returnFlight.arrival}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Ngày bay:</span>
                  <span className="font-medium">{returnFlight.departureDate}</span>
                </p>
              </div>
              <div>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Giờ bay:</span>
                  <span className="font-medium">{returnFlight.departureTime} - {returnFlight.arrivalTime}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Số hành khách:</span>
                  <span className="font-medium">{passengers.length}</span>
                </p>
                <p className="flex justify-between py-2">
                  <span className="text-gray-600">Tổng giá vé:</span>
                  <span className="font-medium text-[#DAA520]">{calculateTotalPrice().toLocaleString()}đ</span>
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
                      <Label htmlFor={`lastName-${index}`} className="text-[#008080] font-medium">
                        Họ và tên
                      </Label>
                      <Input
                        id={`lastName-${index}`}
                        value={passenger.lastName}
                        onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.lastName && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].name}</AlertDescription>
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
                      <Label htmlFor={`dateOfBirth-${index}`} className="text-[#008080] font-medium">
                        Ngày sinh
                      </Label>
                      <Input
                        id={`dateOfBirth-${index}`}
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handleChange(index, 'dateOfBirth', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.dateOfBirth && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].dateOfBirth}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`idNumber-${index}`} className="text-[#008080] font-medium">
                        Số CMND/Hộ chiếu
                      </Label>
                      <Input
                        id={`idNumber-${index}`}
                        value={passenger.idNumber}
                        onChange={(e) => handleChange(index, 'idNumber', e.target.value)}
                        className="mt-1 border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]"
                      />
                      {errors[index]?.idNumber && (
                        <Alert className="mt-2 text-red-600 bg-red-50 border-red-200">
                          <AlertDescription>{errors[index].idNumber}</AlertDescription>
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
                    <span className="font-medium">{selectedFlight?.price.toLocaleString()}đ</span>
                  </p>
                  <div className="border-t border-[#008080]/20 my-2"></div>
                  <p className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-800">Tổng tiền:</span>
                    <span className="text-[#DAA520]">{calculateTotalPrice().toLocaleString()}đ</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit"
              className="w-full bg-[#DAA520] hover:bg-[#DAA520]/90 text-white py-3"
            >
              Xác nhận đặt vé
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerInfo;