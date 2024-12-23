import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import logo from '../../assets/image/qairline_logo.png'
import { LogOut, User2, Menu, X, Bell, ChevronRight } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint'
import { useSelector, useDispatch } from 'react-redux'
import { setAllBooking } from '@/redux/bookingSlice'
import { setUser } from '@/redux/authSlice'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constraint'
import axios from 'axios'

const guessNavLinks = [
    {
        path: '/home',
        display: 'Trang chủ',
    },
    {
        path: '/promotion',
        display: 'Khuyến mãi & Tin tức',
    },
    {
        path: '/flight',
        display: 'Tìm chuyến bay',
    },
    {
        path: '/mybookings',
        display: 'Chuyến bay của tôi',
    },
]

const mobileNavLinks = [
  {
      path: '/home',
      display: 'Trang chủ',
  },
  {
      path: '/promotion',
      display: 'Ưu đãi',
  },
  {
      path: '/flight',
      display: 'Tìm chuyến bay',
  },
  {
      path: '/mybookings',
      display: 'Chuyến bay của tôi',
  },
]

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [navLinks, setNavLinks] = useState(guessNavLinks);
    const [delayNotices, setDelayNotices] = useState([]);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
      setNavLinks(isMobileMenuOpen ? mobileNavLinks : guessNavLinks);
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const fetchDelayNotices = async () => {
            try {
                const response = await axios.get(`${USER_API_END_POINT}/delayNotices/${user._id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                        "Content-Type": "application/json",
                    },
                });
            if (response.data) {
                const sortedNotices = response.data.sort((a, b) => new Date(b.noticeDate) - new Date(a.noticeDate));
                setDelayNotices(sortedNotices.slice(0, 20));
                setHasNewNotifications(true);
            }
            } catch (error) {
               
            }
        };

        fetchDelayNotices();
    }, []);

    useEffect(() => {
        // Calculate unread notifications count
        const unreadNotices = delayNotices.filter(notice => notice.status === "Chưa xem").length;
        setUnreadCount(unreadNotices);
    }, [delayNotices]);

    const toggleMobileMenu = async () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const handleLogout = async () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch(setUser(null));    
        dispatch(setAllBooking([]));
        toast.success('Đăng xuất thành công');
        navigate('/login');
    }

    const handleViewMoreNotifications = () => {
        navigate('/promotion');
    }

    const handleViewNotifications = async () => {
        if (!user) return;
        
        try {
            const response = await axios.put(
                `${USER_API_END_POINT}/updateDelayNotices/${user._id}`,
                {},
                {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setDelayNotices(prevNotices => 
                    prevNotices.map(notice => ({
                        ...notice,
                        status: "Đã xem"
                    }))
                );
                setUnreadCount(0);
                setHasNewNotifications(false);
            }
        } catch (error) {
            console.log('Có lỗi xảy ra');
        }
    }

    const handleNoticeClick = (noticeId) => {
        navigate(`/bookingdetail/${noticeId}`);
    }

    
    const { allPromotions } = useSelector(store => store.promotion);
    //lấy ra 5 promotions mới nhất
    const latestPromotions = allPromotions.slice(0, 5);

    const formatUTCDate = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    return (
        <div className='bg-white relative'>
            {/* Desktop and Mobile Header */}
            <div className='flex items-center justify-between mx-auto max-w-[95rem] h-20 px-4'>
                {/* Logo Section */}
                <div className="flex items-center">
                    <img id='userImg' width={40} height={40} src={logo} alt="QAirline Logo" className="rounded-full" />
                    <h1 className='ml-2 text-3xl font-bold text-[#DAA520]'>Q<span className='text-[#008080]'>Airline</span></h1>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden xl:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {navLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-[#DAA520] text-[18px] leading-8 font-[600]'
                                                : 'text-textColor text-[18px] leading-8 font-[500] hover:text-primaryColor'
                                        }
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                                {index < navLinks.length - 1 && (
                                    <div className="h-6 border-l border-gray-300 mx-2"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>

                    {!user ? (
                        <div className='flex items-center gap-2'> 
                            <Link to='/login'>
                                <Button className="bg-[#DAA520] text-white hover:bg-[#006666] text-base px-5 py-1.5">Đăng nhập</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className='bg-[#008080] text-white hover:bg-[#DAA520] text-base px-5 py-1.5'>Đăng ký</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                         <Popover>
    <PopoverTrigger asChild>
        <div className='relative cursor-pointer' onClick={handleViewNotifications}>
            <Bell className='text-black hover:text-[#DAA520] w-6 h-6' />
            {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadCount}
                </div>
            )}
        </div>
    </PopoverTrigger>
    <PopoverContent 
        align="center" 
        className="w-[350px] p-0 shadow-xl rounded-xl mt-2"
    >
        <div className='bg-[#DAA520] text-white px-4 py-3 rounded-t-xl flex justify-center'>
            <h2 className='text-lg font-semibold'>Thông Báo</h2>
        </div>
        <div className='max-h-[350px] overflow-y-auto'>
            {delayNotices.map((notice) => (
                <div 
                    key={notice._id} 
                    className='px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group'
                    onClick={() => handleNoticeClick(notice.bookingDetails._id)}
                >
                    <div className='flex items-center max-w-full'>
                        <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm text-gray-800 group-hover:text-[#DAA520] transition-colors truncate max-w-full'>
                                Delay chuyến bay số #{notice.flightDetails.flight_code}  
                            </h4>
                            <p className='text-xs text-gray-600 truncate max-w-full'>
                                {`Từ: ${notice.flightDetails.departure_location} đến: ${notice.flightDetails.destination}`}
                            </p>
                            <p className='text-xs text-gray-600 truncate max-w-full'>
                                {`Thời gian khởi hành mới: ${formatUTCDate(notice.newDepartureTime)}`}
                            </p>
                            <p className='text-xs text-gray-600 truncate max-w-full'>
                                {`Thời gian khởi hành cũ: ${formatUTCDate(notice.previousDepartureTime)}`}
                            </p>
                            <span className='text-xs text-gray-400 block truncate max-w-full'>
                                {notice.date}
                            </span>
                        </div>
                        <div className='pl-2 flex-shrink-0'>
                            <ChevronRight className='text-gray-400 w-4 h-4 group-hover:text-[#DAA520] transition-colors' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div 
            className='px-4 py-2 bg-gray-50 rounded-b-xl text-center cursor-pointer hover:bg-gray-100 transition-colors'
            onClick={handleViewMoreNotifications}
        >
            <span className='text-sm text-[#008080] font-medium flex items-center justify-center'>
                Xem thêm <ChevronRight className='ml-1 w-4 h-4' />
            </span>
        </div>
    </PopoverContent>
</Popover>
                            {/* User Profile Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage 
                                            src={`https://robohash.org/${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME).slice(-2)}`} 
                                            alt="User Avatar" 
                                        />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-2">
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded'>
                                            <User2 className='text-[#DAA520]' />
                                            <Link to='/account'>
                                                <Button variant="link" className="p-0">Tài khoản của tôi</Button>
                                            </Link>
                                        </div>
                                        <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded' onClick={handleLogout}>
                                            <LogOut className='text-[#DAA520]'/>
                                            <Button variant="link" className="p-0">Đăng xuất</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className='xl:hidden flex items-center'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className='relative cursor-pointer mr-4' onClick={handleViewNotifications}>
                                <Bell className='text-black hover:text-[#DAA520] w-6 h-6' />
                                {unreadCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent 
                            align="center" 
                            className="w-[350px] p-0 shadow-xl rounded-xl mt-2"
                        >
                            <div className='bg-[#DAA520] text-white px-4 py-3 rounded-t-xl flex justify-center'>
                                <h2 className='text-lg font-semibold'>Thông Báo</h2>
                            </div>
                            <div className='max-h-[350px] overflow-y-auto'>
                                {delayNotices.map((notice) => (
                                    <div 
                                        key={notice._id} 
                                        className='px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group'
                                        onClick={() => handleNoticeClick(notice.bookingDetails._id)}
                                    >
                                        <div className='flex items-center max-w-full'>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='font-semibold text-sm text-gray-800 group-hover:text-[#DAA520] transition-colors truncate max-w-full'>
                                                    Delay chuyến bay số #{notice.flightDetails.flight_code}  
                                                </h4>
                                                <p className='text-xs text-gray-600 truncate max-w-full'>
                                                    {`Từ: ${notice.flightDetails.departure_location} đến: ${notice.flightDetails.destination}`}
                                                </p>
                                                <p className='text-xs text-gray-600 truncate max-w-full'>
                                                    {`Thời gian khởi hành mới: ${formatUTCDate(notice.newDepartureTime)}`}
                                                </p>
                                                <p className='text-xs text-gray-600 truncate max-w-full'>
                                                    {`Thời gian khởi hành cũ: ${formatUTCDate(notice.previousDepartureTime)}`}
                                                </p>
                                                <span className='text-xs text-gray-400 block truncate max-w-full'>
                                                    {notice.date}
                                                </span>
                                            </div>
                                            <div className='pl-2 flex-shrink-0'>
                                                <ChevronRight className='text-gray-400 w-4 h-4 group-hover:text-[#DAA520] transition-colors' />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div 
                                className='px-4 py-2 bg-gray-50 rounded-b-xl text-center cursor-pointer hover:bg-gray-100 transition-colors'
                                onClick={handleViewMoreNotifications}
                            >
                                <span className='text-sm text-[#008080] font-medium flex items-center justify-center'>
                                    Xem thêm <ChevronRight className='ml-1 w-4 h-4' />
                                </span>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className='fixed inset-0 bg-white z-50 xl:hidden'>
                    {/* Add close button */}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4"
                        onClick={toggleMobileMenu}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <div className='container mx-auto px-4 pt-16'>
                        {/* Mobile Navigation Links */}
                        <ul className='space-y-4'>
                            {navLinks.map((link, index) => (
                                <li key={index} className='border-b pb-2'>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-[#DAA520] text-[16px] leading-7 font-[600] block'
                                                : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                        }
                                        onClick={toggleMobileMenu}
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                            {!user ? (
                                <>
                                    <li className='border-b pb-2'>
                                        <NavLink
                                            to='/login'
                                            className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                            onClick={toggleMobileMenu}
                                        >
                                            Đăng nhập
                                        </NavLink>
                                    </li>
                                    <li className='border-b pb-2'>
                                        <NavLink
                                            to='/register'
                                            className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                            onClick={toggleMobileMenu}
                                        >
                                            Đăng ký
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <li className='border-b pb-2'>
                                    <NavLink
                                        to='/account'
                                        className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                        onClick={toggleMobileMenu}
                                    >
                                        Tài khoản của tôi
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar