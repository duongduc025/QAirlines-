import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import logo from '../../assets/image/qairline_logo.png'
import { LogOut, User2, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom';

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

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = true;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='bg-white shadow-sm'>
            <div className='relative flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-8'>
                {/* Logo Section */}
                <div className='flex items-center'> 
                    <img id='userImg' width={30} src={logo} alt="QAirline Logo" />
                    <h1 className='ml-2 text-2xl font-bold text-[#DAA520]'>
                        Q<span className='text-[#008080]'>Airline</span>
                    </h1>
                </div>

                {/* Mobile Menu Toggle */}
                <div className='lg:hidden'>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMenu}
                        className='text-[#008080]'
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>

                {/* Navigation Links - Desktop */}
                <div className='hidden lg:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {guessNavLinks.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    to={link.path}
                                    className={(navClass) =>
                                        navClass.isActive
                                            ? 'text-[#DAA520] text-[16px] leading-7 font-[600]'
                                            : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                                    }
                                >
                                    {link.display}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {!user ? (
                        <div className='flex items-center gap-2'> 
                            <Link to='/login'>
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className='bg-[#008080]'>Register</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-25">
                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                    <User2 className='text-[#DAA520]' />
                                    <Link to='/account'>
                                        <Button variant="link">My Account</Button>
                                    </Link>
                                </div>
                                <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                    <LogOut className='text-[#DAA520]'/>
                                    <Button variant="link">Logout</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

                {/* Mobile Menu - Slide Out */}
                <div 
                    className={`absolute top-full left-0 w-full bg-white shadow-lg lg:hidden transition-transform duration-300 ease-in-out ${
                        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className='flex flex-col items-center p-4 space-y-4'>
                        <ul className='w-full'>
                            {guessNavLinks.map((link, index) => (
                                <li key={index} className='w-full'>
                                    <NavLink
                                        to={link.path}
                                        className={(navClass) =>
                                            navClass.isActive
                                                ? 'text-[#DAA520] text-[16px] leading-7 font-[600] block w-full text-center'
                                                : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block w-full text-center'
                                        }
                                        onClick={toggleMenu}
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {!user ? (
                            <div className='flex flex-col gap-2 w-full'> 
                                <Link to='/login' onClick={toggleMenu}>
                                    <Button variant="outline" className='w-full'>Login</Button>
                                </Link>
                                <Link to='/register' onClick={toggleMenu}>
                                    <Button className='w-full bg-[#008080]'>Register</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className='mt-4 space-y-2 w-full'>
                                <Link to='/account' onClick={toggleMenu} className='flex items-center gap-2 justify-center'>
                                    <User2 className='text-[#DAA520]' />
                                    <span>My Account</span>
                                </Link>
                                <div className='flex items-center gap-2 justify-center'>
                                    <LogOut className='text-[#DAA520]'/>
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar