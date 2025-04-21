'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Card from "@/components/Card";
import Paginate from "@/components/Paginate";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current URL parameters
    const currentPage = parseInt(searchParams.get('page') || '1');
    const selectedGenre = searchParams.get('genre') || 'allGenres';
    const selectedLang = searchParams.get('lang') || 'allLangs';

    // Fetch movies data
    const { data: movies, isLoading: moviesLoading } = useSWR(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}`,
        fetcher
    );

    // Fetch genres
    const { data: genresData } = useSWR(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    );

    // Handle filter changes
    const updateFilters = (filter: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(filter, value);
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    // Filter movies client-side
    const filteredMovies = React.useMemo(() => {
        if (!movies?.results) return [];
        return movies.results.filter((movie: any) => {
            const genreMatch = selectedGenre === 'allGenres' ||
                movie.genre_ids.includes(Number(selectedGenre));
            const langMatch = selectedLang === 'allLangs' ||
                movie.original_language === selectedLang;
            return genreMatch && langMatch;
        });
    }, [movies, selectedGenre, selectedLang]);

    // Create pagination URLs
    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', pageNumber.toString());
        return `?${params.toString()}`;
    };

    if (moviesLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex justify-center items-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Filters Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-medium border-b-2 border-red-600 pb-2">
                        Popular Movies
                    </h1>
                    <div className="flex gap-4">
                        {/* Language Filter */}
                        <select
                            className="bg-red-600 text-white p-2 rounded-full text-sm focus:outline-none"
                            onChange={(e) => updateFilters('lang', e.target.value)}
                            value={selectedLang}
                        >
                            <option value="allLangs">All Languages</option>
                            {/* Add language options dynamically if available */}
                        </select>

                        {/* Genre Filter */}
                        <select
                            className="bg-red-600 text-white p-2 rounded-full text-sm focus:outline-none"
                            onChange={(e) => updateFilters('genre', e.target.value)}
                            value={selectedGenre}
                        >
                            <option value="allGenres">All Genres</option>
                            {genresData?.genres?.map((genre: any) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                    {filteredMovies.map((movie: any) => (
                        console.log(movie),
                        <Card
                            key={movie.id}
                            type="movie"
                            id={movie.id}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : '/no-poster.png'
                            }
                            title={movie.title}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                    <Paginate
                        currentPage={currentPage}
                        totalPages={movies?.total_pages || 1}
                        createPageUrl={createPageUrl}
                        pageType=""
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;