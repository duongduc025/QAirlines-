import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../shared/Footer'
import axios from 'axios'

import { Loader2 } from 'lucide-react'


const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
  

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const SubmitHandler = async (e) => {
        e.preventDefault();
        console.log(input);
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12">
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>

                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="********"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                    
                    </div>
                      <Button type="submit" className="w-full my-4 bg-[#008080]">Login</Button>
                    <span className='text-sm'>Don't have an account? <Link to="/register" className='text-blue-600'>Register</Link></span>
                </form>
            </div>
            </div>
        <Footer/>
        </>
    )
}

export default Login