'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        const formattedSearchTerm = searchTerm.trim().replace(/\s+/g, '-');
        if (formattedSearchTerm !== '') {
            router.push(`/search/${formattedSearchTerm}`);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className=" relative w-[300px] h-[40px]">
            <input
                className=' absolute left-0 top-0 w-full h-full text-white bg-transparent border-[1px] border-solid border-white outline-none rounded pr-[10px] backdrop:blur-[10px]'
                type="text"
                placeholder="أبحث عما تريد..."
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

export default Search;
