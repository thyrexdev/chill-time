'use client'; // Required for client-side interactivity

import React, { useState, useEffect } from 'react';
import Card from "@/components/Card";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import { Loader2, Search } from 'lucide-react';

// Define interfaces for TMDB data
interface Series {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
    original_language: string;
    first_air_date: string;
    vote_average: number;
    overview: string;
}

interface Genre {
    id: number;
    name: string;
}

interface Language {
    iso_639_1: string;
    english_name: string;
    name: string;
}

const SeriesPage = () => {
    // State variables
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
    const [selectedLang, setSelectedLang] = useState<string | null>(null);
    const [trendingSeries, setTrendingSeries] = useState<Series[]>([]);
    const [allSeries, setAllSeries] = useState<Series[]>([]);
    const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // API key from your environment variables
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    // Fetch genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=ar-SA`
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (err) {
                console.error('Error fetching genres:', err);
                setError('فشل في تحميل الأنواع');
            }
        };

        fetchGenres();
    }, [apiKey]);

    // Fetch languages on component mount
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`
                );
                const data = await response.json();
                // Filter to common languages and sort alphabetically by Arabic name
                const commonLanguages = data
                    .filter((lang: Language) =>
                        ['ar', 'en', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'ru', 'zh', 'hi', 'tr'].includes(lang.iso_639_1)
                    )
                    .sort((a: Language, b: Language) => a.english_name.localeCompare(b.english_name));

                setLanguages(commonLanguages);
            } catch (err) {
                console.error('Error fetching languages:', err);
                setError('فشل في تحميل اللغات');
            }
        };

        fetchLanguages();
    }, [apiKey]);

    // Fetch trending series on component mount
    useEffect(() => {
        const fetchTrendingSeries = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}&language=ar-SA`
                );
                const data = await response.json();
                setTrendingSeries(data.results.slice(0, 10));
            } catch (err) {
                console.error('Error fetching trending series:', err);
                setError('فشل في تحميل المسلسلات المشهورة');
            }
        };

        fetchTrendingSeries();
    }, [apiKey]);

    // Fetch all series with pagination
    useEffect(() => {
        const fetchAllSeries = async () => {
            setIsLoading(true);
            try {
                let url;

                if (isSearching && searchQuery.trim() !== '') {
                    // Search query
                    url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=ar-SA&query=${encodeURIComponent(searchQuery)}&page=${currentPage}`;
                } else {
                    // Regular discover with filters
                    url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&language=ar-SA&sort_by=popularity.desc&page=${currentPage}`;

                    if (selectedGenre) {
                        url += `&with_genres=${selectedGenre}`;
                    }

                    if (selectedLang) {
                        url += `&with_original_language=${selectedLang}`;
                    }
                }

                const response = await fetch(url);
                const data = await response.json();

                setAllSeries(data.results);
                setTotalPages(Math.min(data.total_pages, 20)); // Cap at 20 pages
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching series:', err);
                setError('فشل في تحميل المسلسلات');
                setIsLoading(false);
            }
        };

        fetchAllSeries();
    }, [apiKey, currentPage, selectedGenre, selectedLang, searchQuery, isSearching]);

    // Filter series based on selections
    useEffect(() => {
        setFilteredSeries(allSeries);
    }, [allSeries]);

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedGenre(value === 'all' ? null : parseInt(value));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLang(event.target.value === 'all' ? null : event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSearching(searchQuery.trim() !== '');
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        if (event.target.value.trim() === '') {
            setIsSearching(false);
            setCurrentPage(1);
        }
    };

    const getGenreName = (genreId: number): string => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : '';
    };

    const getLanguageName = (langCode: string): string => {
        const language = languages.find(l => l.iso_639_1 === langCode);
        return language ? language.english_name : langCode;
    };

    return (
        <div className="min-h-screen bg-black pb-20">
            {/* Container div for the entire page content */}
            <div className="container mx-auto px-4 text-white">
                {/* Trending Series Section */}
                <div className="pt-20 lg:pt-24 pb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl lg:text-3xl font-bold pr-4 border-r-4 border-red-600">
                            المسلسلات المشهورة
                        </h2>
                    </div>

                    {trendingSeries.length > 0 ? (
                        <Swiper
                            className="w-full"
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={16}
                            slidesPerView={2}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 5 },
                                1280: { slidesPerView: 6 },
                            }}
                            navigation
                            pagination={{ clickable: true }}
                        >
                            {trendingSeries.map((series) => (
                                <SwiperSlide key={series.id}>
                                    <Card
                                        type="series"
                                        id={series.id.toString()}
                                        poster={series.poster_path ? `https://image.tmdb.org/t/p/w342${series.poster_path}` : "/fallback-poster.jpg"}
                                        title={series.name}
                                        genre={series.genre_ids.slice(0, 2).map(id => getGenreName(id))}
                                        rating={series.vote_average}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex justify-center items-center h-64 bg-gray-900/40 rounded-xl">
                            {error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
                                    <p>جاري التحميل...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* All Series Section with Filters */}
                <div className="mt-10 lg:mt-16">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold pr-4 border-r-4 border-red-600">
                            استكشف المسلسلات
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="ابحث عن مسلسل..."
                                    className="bg-gray-800 text-white rounded-full py-2 px-4 pl-10 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                                <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-white">
                                    <Search size={18} />
                                </button>
                            </form>

                            <div className="flex gap-3">
                                {/* Language Selector */}
                                <select
                                    className="bg-gray-800 text-white rounded-full py-2 px-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
                                    onChange={handleLangChange}
                                    value={selectedLang || 'all'}
                                >
                                    <option value="all">جميع اللغات</option>
                                    {languages.map((lang) => (
                                        <option key={lang.iso_639_1} value={lang.iso_639_1}>
                                            {lang.english_name}
                                        </option>
                                    ))}
                                </select>

                                {/* Genre Selector */}
                                <select
                                    className="bg-gray-800 text-white rounded-full py-2 px-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
                                    onChange={handleGenreChange}
                                    value={selectedGenre?.toString() || 'all'}
                                >
                                    <option value="all">جميع الأنواع</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.id.toString()}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Series Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64 bg-gray-900/40 rounded-xl">
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
                                <p>جاري التحميل...</p>
                            </div>
                        </div>
                    ) : filteredSeries.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                                {filteredSeries.map((series) => (
                                    <Card
                                        key={series.id}
                                        type="series"
                                        id={series.id.toString()}
                                        poster={series.poster_path ? `https://image.tmdb.org/t/p/w342${series.poster_path}` : "/fallback-poster.jpg"}
                                        title={series.name}
                                        genre={series.genre_ids.slice(0, 2).map(id => getGenreName(id))}
                                        rating={series.vote_average}
                                        release={series.first_air_date?.split('-')[0]}
                                        language={getLanguageName(series.original_language)}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-10 gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="bg-gray-800 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                                    >
                                        السابق
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                            // Logic to show pages around current page
                                            let pageToShow;
                                            if (totalPages <= 5) {
                                                pageToShow = idx + 1;
                                            } else if (currentPage <= 3) {
                                                pageToShow = idx + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageToShow = totalPages - 4 + idx;
                                            } else {
                                                pageToShow = currentPage - 2 + idx;
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentPage(pageToShow)}
                                                    className={`w-10 h-10 rounded-lg ${
                                                        currentPage === pageToShow ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'
                                                    } transition`}
                                                >
                                                    {pageToShow}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="bg-gray-800 px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
                                    >
                                        التالي
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-gray-900/40 rounded-xl p-8 text-center">
                            <p className="text-xl mb-2">لا توجد نتائج</p>
                            <p className="text-gray-400">
                                {isSearching
                                    ? `لم يتم العثور على نتائج لـ "${searchQuery}"`
                                    : 'لم يتم العثور على مسلسلات تطابق معايير البحث المحددة'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeriesPage;