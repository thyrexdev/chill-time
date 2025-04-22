'use client'

import { useEffect, useState } from 'react';
import Banner from "@/components/Banner";
import Card from "@/components/Card";
import Link from "next/link";
import { Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
import './globals.css';

interface Movie {
    id: string;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    genre_ids: number[];
    release_date: string;
    runtime?: number;
    overview: string;
    vote_average: number;
}

interface TVShow {
    id: string;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    genre_ids: number[];
    first_air_date: string;
    episode_run_time?: number[];
    overview: string;
    vote_average: number;
}

interface Genre {
    id: number;
    name: string;
}

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [popularShows, setPopularShows] = useState<TVShow[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p';

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=ar-SA`
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        const fetchTrendingMovies = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
                );
                const data = await response.json();
                setTrendingMovies(data.results.slice(0, 5));
            } catch (error) {
                console.error("Error fetching trending movies:", error);
            }
        };

        const fetchPopularMovies = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
                );
                const data = await response.json();
                setPopularMovies(data.results.slice(0, 16));
            } catch (error) {
                console.error("Error fetching popular movies:", error);
            }
        };

        const fetchPopularShows = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
                );
                const data = await response.json();
                setPopularShows(data.results.slice(0, 16));
            } catch (error) {
                console.error("Error fetching popular TV shows:", error);
            }
        };

        const fetchAllData = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchGenres(),
                fetchTrendingMovies(),
                fetchPopularMovies(),
                fetchPopularShows()
            ]);
            setIsLoading(false);
        };

        fetchAllData();
    }, [API_KEY]);

    // Helper function to get genre names from IDs
    const getGenreNames = (genreIds: number[]): string[] => {
        return genreIds
            .map(id => genres.find(genre => genre.id === id)?.name || '')
            .filter(name => name !== '') // Remove empty strings
            .slice(0, 2); // Limit to 2 genres
    };

    // Helper to format runtime
    const formatRuntime = (minutes?: number) => {
        return minutes ? `${minutes}m` : '';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen pb-16">
            {/* Banner Carousel */}
            <div className="relative">
                <Swiper
                    className="h-[100vh] w-full"
                    modules={[Pagination, Scrollbar, A11y, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                >
                    {trendingMovies.map((movie) => (
                        <SwiperSlide key={movie.id} className="relative">
                            <Banner
                                id={movie.id}
                                trendpic={movie.backdrop_path ? `${BASE_IMAGE_URL}/original${movie.backdrop_path}` : '/default-backdrop.jpg'}
                                title={movie.title}
                                length={formatRuntime(movie.runtime)}
                                genre={getGenreNames(movie.genre_ids)}
                                description={movie.overview}
                                rating={movie.vote_average}
                                year={movie.release_date}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Movies Section */}
            <div className="container mx-auto px-4">
                <div id="moviesLink" className="relative flex items-center justify-between mt-12 mb-6">
                    <h3
                        id="movieHomePage"
                        className="pr-4 border-r-4 border-solid border-red-600 text-white text-2xl font-bold flex items-center"
                    >
                        أفلام
                    </h3>
                    <Link href="/movies">
                        <button
                            id="moviesLinkBtn"
                            className="bg-red-600 text-white rounded-full py-2 px-6 text-sm font-medium
                      hover:bg-white hover:text-red-600 transition-colors duration-300"
                        >
                            شاهد الكل
                        </button>
                    </Link>
                </div>

                <div className="overflow-hidden">
                    <Swiper
                        id="movies"
                        className="py-4"
                        spaceBetween={16}
                        slidesPerView={2.2}
                        breakpoints={{
                            640: { slidesPerView: 3.2 },
                            768: { slidesPerView: 4.2 },
                            1024: { slidesPerView: 5.2 },
                            1280: { slidesPerView: 6.2 },
                        }}
                        pagination={{ clickable: true }}
                    >
                        {popularMovies.map((movie) => (
                            <SwiperSlide key={movie.id}>
                                <Card
                                    type="movie"
                                    id={movie.id}
                                    poster={movie.poster_path ? `${BASE_IMAGE_URL}/w500${movie.poster_path}` : '/default-poster.jpg'}
                                    title={movie.title}
                                    genre={getGenreNames(movie.genre_ids)}
                                    rating={movie.vote_average}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* TV Shows Section */}
                <div id="seriesLink" className="relative flex items-center justify-between mt-16 mb-6">
                    <h3
                        id="seriesHomePage"
                        className="pr-4 border-r-4 border-solid border-red-600 text-white text-2xl font-bold flex items-center"
                    >
                        مسلسلات
                    </h3>
                    <Link href="/series">
                        <button
                            id="seriesLinkBtn"
                            className="bg-red-600 text-white rounded-full py-2 px-6 text-sm font-medium
                      hover:bg-white hover:text-red-600 transition-colors duration-300"
                        >
                            شاهد الكل
                        </button>
                    </Link>
                </div>

                <div className="overflow-hidden">
                    <Swiper
                        id="series"
                        className="py-4"
                        spaceBetween={16}
                        slidesPerView={2.2}
                        breakpoints={{
                            640: { slidesPerView: 3.2 },
                            768: { slidesPerView: 4.2 },
                            1024: { slidesPerView: 5.2 },
                            1280: { slidesPerView: 6.2 },
                        }}
                        pagination={{ clickable: true }}
                    >
                        {popularShows.map((show) => (
                            <SwiperSlide key={show.id}>
                                <Card
                                    type="series"
                                    id={show.id}
                                    poster={show.poster_path ? `${BASE_IMAGE_URL}/w500${show.poster_path}` : '/default-poster.jpg'}
                                    title={show.name}
                                    genre={getGenreNames(show.genre_ids)}
                                    rating={show.vote_average}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default Home;