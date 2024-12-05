import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import logo from '../../assets/image/qairline_logo.png'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'




const guessNavLinks = [
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
  {
    path: '/Account',
    display: 'Tài khoản của tôi',
  },
]


const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    

    const [navLinks, setNavLinks] = useState(guessNavLinks);

    useEffect(() => {
      setNavLinks(isMobileMenuOpen ? mobileNavLinks : guessNavLinks);
  }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleLogout = async () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        localStorage.removeItem('user');
        dispatch(setUser(null));
        navigate('/login');
    }



    return (
        <div className='bg-white relative'>
            {/* Desktop and Mobile Header */}
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}> 
                    <img id='userImg' width={30} src={logo} alt="QAirline Logo" />
                    <h1 className='ml-2 text-2xl font-bold text-[#DAA520]'>Q<span className='text-[#008080]'>Airline</span></h1>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'text-[#DAA520] text-[16px] leading-7 font-[600]'
                                            : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                                    }
                                >
                                    {link.display}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Authentication Section */}
                    {!user ? (
                        <div className='flex items-center gap-2'> 
                            <Link to='/login'>
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className='bg-[#008080] text-white hover:bg-[#006666]'>Register</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage 
                                        src="https://github.com/shadcn.png" 
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
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className='md:hidden'>
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
                <div className='fixed inset-0 bg-white z-50 md:hidden'>
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
                            
                        </ul>
                            
                        
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar