'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import Card from '@/components/Card';
import Paginate from '@/components/Paginate';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    genre_ids: number[];
    original_language: string;
    // Add other properties you use from the API
}

interface Genre {
    id: number;
    name: string;
}

interface MoviesResponse {
    results: Movie[];
    total_pages: number;
    // Add other properties you use from the API
}

interface GenresResponse {
    genres: Genre[];
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const MovieClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get('page') || '1');
    const selectedGenre = searchParams.get('genre') || 'allGenres';
    const selectedLang = searchParams.get('lang') || 'allLangs';

    const { data: movies, isLoading: moviesLoading } = useSWR<MoviesResponse>(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${currentPage}`,
        fetcher
    );

    const { data: genresData } = useSWR<GenresResponse>(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    );

    const updateFilters = (filter: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(filter, value);
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const filteredMovies = React.useMemo(() => {
        if (!movies?.results) return [];
        return movies.results.filter((movie: Movie) => {
            const genreMatch = selectedGenre === 'allGenres' ||
                movie.genre_ids.includes(Number(selectedGenre));
            const langMatch = selectedLang === 'allLangs' ||
                movie.original_language === selectedLang;
            return genreMatch && langMatch;
        });
    }, [movies, selectedGenre, selectedLang]);

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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-medium border-b-2 border-red-600 pb-2">
                        Popular Movies
                    </h1>
                    <div className="flex gap-4">
                        <select
                            className="bg-red-600 text-white p-2 rounded-full text-sm focus:outline-none"
                            onChange={(e) => updateFilters('lang', e.target.value)}
                            value={selectedLang}
                        >
                            <option value="allLangs">All Languages</option>
                        </select>
                        <select
                            className="bg-red-600 text-white p-2 rounded-full text-sm focus:outline-none"
                            onChange={(e) => updateFilters('genre', e.target.value)}
                            value={selectedGenre}
                        >
                            <option value="allGenres">All Genres</option>
                            {genresData?.genres?.map((genre: Genre) => (
                                <option key={genre.id} value={genre.id.toString()}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                    {filteredMovies.map((movie: Movie) => (
                        <Card
                            key={movie.id}
                            type="movie"
                            id={movie.id.toString()}
                            poster={
                                movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                    : '/no-poster.png'
                            }
                            title={movie.title}
                        />
                    ))}
                </div>

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

export default MovieClient;
