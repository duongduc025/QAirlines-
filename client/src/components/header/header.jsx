import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BiMenu } from 'react-icons/bi';
import logo from '../../assets/image/qairlines_logo.png';
import userImg from '../../assets/image/qairlines_logo.png';


let navLinks = []

let account = []
const guessNavLinks = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/flights',
    display: 'Find a flight',
  },
  {
    path: 'Contact',
    display: 'Contact',
  }

]

const clientNavLinks = [
  {
    path: '/home',
    display: 'Home',
  },
]

const managerNavLinks = [
  {
    path: '/home',
    display: 'Home',
  },
]


const Header = () => {

  const role = 'guest'
  if(role === 'guest') {
    navLinks = guessNavLinks
  } else if(role === 'client') {
    navLinks = clientNavLinks
    account = "clientAccount"
  } else if(role === 'manager') {
    navLinks = managerNavLinks
    account = "managerAccount"
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const headerRef = useRef(null);

  const handleStickyHeader = () => {
    window.addEventListener('scroll', () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    });
  };
  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener('scroll', handleStickyHeader);
  }, []);
  

  return (
    <header className="header flex items-center">
      <div className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }} >
            <img id='userImg' width={30} src={logo} alt="" />
            <h4 style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '22px' }}>QAirlines</h4>
          </div>

          {/* Menu: Đoạn này sau tùy chỉnh theo role */}
          <div className="navigation" >
            <ul className="menu flex items-center gap-[2.7rem]">
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
          </div>

          {/* Nav Right */}
          <div className='flex items-center gap-4'>
            {(
              <div className="relative">
                <div className="inline-block relative">
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                    <Link to={`/${account}`}>
                    <img src={userImg} className="w-full rounded-full" alt="" />
                    </Link>
                  </figure>
                </div>
              </div>
            ) /*: (
              <Link to='/login'>
                <button
                  className='bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]'>
                  Login
                </button>
              </Link>
            )*/
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;