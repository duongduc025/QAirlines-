import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import logo from '../../assets/image/qairline_logo.png'
import { LogOut, User2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom';
 

let navLinks = []
let account = []

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
    const user = false;
    navLinks = [...guessNavLinks];
    return (
        <>
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div style={{ display: 'flex', alignItems: 'center' }}> 
                    <img id='userImg' width={30} src={logo} alt="" />
                    <h1 className=' ml-2 text-2xl font-bold text-[#DAA520]'>Q<span className='text-[#008080]'>Airline</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                  <ul className='flex font-medium items-center gap-5'>
                  {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? 'text-primaryColor text-[16px] leading-7 font-[600]'
                        : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor'
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
                    </ul>
                { 
                !user ? (
                    <div className='flex items-center gap-2'> 
                      <Link to = '/login'> <Button variant="outline">Login</Button> </Link>
                      <Link to = '/register'> <Button className = 'bg-[#008080]'>Register</Button> </Link>
                    </div>
                        ) : (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className = "cursor-pointer">
                                <AvatarImage src= "https://github.com/shadcn.png" alt = "@shadcn"></AvatarImage>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className = "w-25">
                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                            <User2 className ='text-[#DAA520]' /> <Button variant="link">View Profile</Button>
                            </div>
                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                            <LogOut className = 'text-[#DAA520]'/>
                            <Button variant="link">Logout</Button>
                            </div>
                            </PopoverContent>
                        </Popover>
                    )
                }
                
                </div>

        </div>
        </div>
      
    </>
    )
}
export default Navbar