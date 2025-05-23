import { LogOut, Menu, Search } from 'lucide-react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


import { useAuthStore } from '../store/authUser';
import { useContentStore } from '../store/content';

export const Navbar = () => {
    const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setisMobileMenuOpen(!isMobileMenuOpen)
    const {user, logout} = useAuthStore()

    const {setContentType} = useContentStore()

   

  return (
    <header className='max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20'>

        <div className='flex items-center gap-10 z-50'>
            <Link to="/">
                <img src='/netflix-logo.png' alt='Netflix Logo' className='w-32 sm:w-40' onClick={() => setContentType("movie")} />
            </Link>

            {/* Desktop navbar items  */}
            <div className='hidden sm:flex gap-2 items-center'>
                <Link className='hover:underline' to="/" onClick={() => setContentType("movie")}>
                Movies
                </Link>
                <Link className='hover:underline' to="/" onClick={() => setContentType("tv")}>
                TV Shows
                </Link>
                <Link className='hover:underline' to="/history">
                Search History
                </Link>
            </div>
        </div>

        <div className='flex gap-2 items-center z-50'>
            <Link to={"/search"}>
                <Search className='size-6 cursor-pointer' /> 
            </Link>
            <img src={user.image} alt='User profile picture' className='h-8 rounded cursor-pointer' />
            <LogOut className='size-6 cursor-pointer' onClick={logout} />

            <div className='sm:hidden'>
                <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu} />
            </div>
        </div>

        {/* Mobile navbar  items  */}
        {isMobileMenuOpen && (
            <div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
                <Link to="/" className='block hover:underline p-2' onClick={() => {
                    toggleMobileMenu();
                    setContentType('movie');
                    }}>
                    Movies
                </Link>
                <Link to="/" className='block hover:underline p-2' onClick={() => {
                    toggleMobileMenu();
                    setContentType('tv');
                    }}>
                    TV Shows
                </Link>
                <Link to="/history" className='block hover:underline p-2' onClick={toggleMobileMenu}>
                    Search History
                </Link>
            </div>
        )}
            
        
    </header>
  )
}
