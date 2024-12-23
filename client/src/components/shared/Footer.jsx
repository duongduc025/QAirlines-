import { Link } from 'react-router-dom';
import { RiLinkedinFill } from 'react-icons/ri';
import { useEffect, useRef } from 'react';
import Logo from '../../assets/image/qairline_logo.png';

import {
  AiFillYoutube,
  AiFillGithub,
  AiOutlineInstagram,
} from 'react-icons/ai';

const socialLinks = [
  {
    path: '',
    icon: <AiFillYoutube className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: '',
    icon: <AiFillGithub className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: '',
    icon: <AiOutlineInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: '',
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
];

const Footer = () => {
    const year = new Date().getFullYear();
  
    return (
      <footer className="pt-10 pb-10 pl-5">
        <div className='bg-white'>
        <div className='flex items-center justify-between mx-auto max-w-7xl flex-col'>
        <div className="container">
          <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
            <div>
              
            <div className="flex items-center gap-2"> 
                <img width={30} src={Logo} alt="Law Connect Logo" />
                <h4 style = {{marginLeft: '4px', fontWeight: 'bold', fontSize: '22px' }}>
                <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span></h4>
              </div>
              
              <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
                Copyright © {year} developed by Group 66 all right reserved.
              </p>
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((link, index) => (
                  <Link
                    to={link.path}
                    key={index}
                    className="w-9 h-9 border border-solid border-[#1811AE] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
    </footer>
  );
};

export default Footer;