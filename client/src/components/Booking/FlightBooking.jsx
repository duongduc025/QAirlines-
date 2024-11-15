import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import Airplane from '../../assets/image/airplane.png';

const airports = [
  { code: 'HAN', name: 'Nội Bài International Airport, Hà Nội' },
  { code: 'SGN', name: 'Tân Sơn Nhất International Airport, Hồ Chí Minh' },
  { code: 'DAD', name: 'Đà Nẵng International Airport, Đà Nẵng' },
  { code: 'PQC', name: 'Phú Quốc International Airport, Phú Quốc' },
  { code: 'CXR', name: 'Cam Ranh International Airport, Nha Trang' },
];

const FlightBooking = () => {
  const [tripType, setTripType] = useState('oneWay');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const handleSearch = (input, type) => {
    if (!input) return type === 'origin' ? setOriginSuggestions([]) : setDestSuggestions([]);
    
    const filtered = airports.filter(airport => 
      airport.name.toLowerCase().includes(input.toLowerCase()) ||
      airport.code.toLowerCase().includes(input.toLowerCase())
    );
    
    if (type === 'origin') {
      setOriginSuggestions(filtered);
    } else {
      setDestSuggestions(filtered);
    }
  };

  return (
    <>
     <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#008080] mb-4">
            Đặt vé ngay cùng <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span>

          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
           Chúc quý khách có chuyến bay an toàn và thú vị.
          </p>
        </div>

    <Card className="w-full max-w-4xl mx-auto flex-1 mt-10 mb-20">
    <CardHeader className="bg-gradient-to-r from-[#008080]/90 to-transparent text-white">
    <CardTitle className="text-2xl font-bold">Đặt vé máy bay</CardTitle>
</CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Trip Type Selection */}
          <RadioGroup
            defaultValue="oneWay"
            className="flex space-x-4"
            onValueChange={setTripType}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oneWay" id="oneWay" />
              <Label htmlFor="oneWay">Một chiều</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="roundTrip" id="roundTrip" />
              <Label htmlFor="roundTrip">Khứ hồi</Label>
            </div>
          </RadioGroup>

          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Label htmlFor="origin">Điểm đi</Label>
              <Input
                id="origin"
                placeholder="Nhập điểm đi"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  handleSearch(e.target.value, 'origin');
                }}
                className="border-[#DAA520] focus:ring-[#008080]"
              />
              {originSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                  {originSuggestions.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setOrigin(airport.name);
                        setOriginSuggestions([]);
                      }}
                    >
                      {airport.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="destination">Điểm đến</Label>
              <Input
                id="destination"
                placeholder="Nhập điểm đến"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  handleSearch(e.target.value, 'destination');
                }}
                className="border-[#DAA520] focus:ring-[#008080]"
              />
              {destSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                  {destSuggestions.map((airport) => (
                    <div
                      key={airport.code}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setDestination(airport.name);
                        setDestSuggestions([]);
                      }}
                    >
                      {airport.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Ngày đi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-[#DAA520]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departDate ? format(departDate, 'dd/MM/yyyy') : 'Chọn ngày đi'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departDate}
                    onSelect={setDepartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {tripType === 'roundTrip' && (
              <div>
                <Label>Ngày về</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-[#DAA520]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, 'dd/MM/yyyy') : 'Chọn ngày về'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date) => 
                        departDate ? date < departDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Passengers Selection */}
          <div>
            <Label htmlFor="passengers">Số hành khách</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPassengers(prev => Math.max(1, prev - 1))}
                disabled={passengers <= 1}
                className="border-[#DAA520]"
              >
                -
              </Button>
              <div className="w-16 text-center">{passengers}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPassengers(prev => prev + 1)}
                className="border-[#DAA520]"
              >
                +
              </Button>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            className="w-full bg-[#008080] hover:bg-[#006666] text-white"
            size="lg"
          >
            Tìm chuyến bay
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
    </>
  );
};

export default FlightBooking;