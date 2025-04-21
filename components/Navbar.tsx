'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Film, Tv, Heart, User, Menu, X, ChevronDown, LogOut, Settings, Clock } from 'lucide-react';

interface NavbarProps {
    userLoggedIn?: boolean;
    userName?: string;
    userAvatar?: string;
}

const Navbar: React.FC<NavbarProps> = ({
                                           userLoggedIn = false,
                                           userName = 'مستخدم',
                                           userAvatar = '/default-avatar.jpg'
                                       }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when navigating to a new page
    useEffect(() => {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement your search navigation here
            // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    // Nav links configuration
    const navLinks = [
        { name: 'الرئيسية', href: '/', icon: <Home size={20} /> },
        { name: 'أفلام', href: '/movies', icon: <Film size={20} /> },
        { name: 'مسلسلات', href: '/series', icon: <Tv size={20} /> },
        { name: 'المفضلة', href: '/favorites', icon: <Heart size={20} /> },
    ];

    // User menu items
    const userMenuItems = [
        { name: 'الملف الشخصي', href: '/profile', icon: <User size={18} /> },
        { name: 'المشاهدة لاحقاً', href: '/watchlist', icon: <Clock size={18} /> },
        { name: 'الإعدادات', href: '/settings', icon: <Settings size={18} /> },
        { name: 'تسجيل الخروج', href: '/logout', icon: <LogOut size={18} /> },
    ];

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                isScrolled || mobileMenuOpen || searchOpen
                    ? 'bg-black shadow-lg'
                    : 'bg-gradient-to-b from-black/80 to-transparent'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-white font-bold text-2xl">Time</span>
                        <span className="text-red-600 font-bold text-2xl">Chill</span>

                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 mx-1 rounded-lg text-sm flex items-center transition-colors ${
                                    pathname === link.href
                                        ? 'bg-red-600 text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                }`}
                            >
                                <span className="ml-2">{link.icon}</span>
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-2 space-x-reverse">
                        {/* Search Button */}
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-gray-800"
                            aria-label="بحث"
                        >
                            <Search size={20} />
                        </button>

                        {/* User Menu (Desktop) */}
                        {userLoggedIn ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 space-x-reverse rounded-full hover:bg-gray-800 pr-2 pl-3 py-1"
                                >
                                    <span className="text-white text-sm">{userName}</span>
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                        <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1" role="menu" aria-orientation="vertical">
                                            {userMenuItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                                                    role="menuitem"
                                                >
                                                    <span className="ml-3">{item.icon}</span>
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                تسجيل الدخول
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-white rounded-full hover:bg-gray-800"
                            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Search overlay - Full width */}
                {searchOpen && (
                    <div className="absolute top-16 md:top-20 left-0 right-0 bg-black/95 p-4 border-t border-gray-800 shadow-lg">
                        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن فيلم أو مسلسل..."
                                className="w-full bg-gray-800 text-white py-3 px-4 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-black/95 border-t border-gray-800">
                        <nav className="px-2 pt-2 pb-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center px-3 py-3 rounded-md ${
                                        pathname === link.href
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <span className="ml-3">{link.icon}</span>
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile user actions */}
                            {userLoggedIn ? (
                                <>
                                    <div className="border-t border-gray-800 pt-2 mt-2">
                                        <div className="flex items-center px-3 py-3">
                                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                                                <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                                            </div>
                                            <span className="mr-3 text-white font-medium">{userName}</span>
                                        </div>

                                        {userMenuItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center px-3 py-3 mr-10 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                                            >
                                                <span className="ml-3">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center justify-center mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;