'use client';

import React from 'react';
import MovieWatchBtn from "@/components/MovieWatchBtn";
import MovieDownloadbtn from "@/components/MovieDownloadBtn";
import ActorCard from "@/components/ActorCard";
import Head from 'next/head';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Image from "next/image";

// Define TypeScript interfaces for TMDB response
interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    runtime: number | null;
    release_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
}

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
}

interface MovieCredits {
    cast: Actor[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = () => {
    const params = useParams();
    const id = params.id as string;

    // Fetch movie details
    const { data: movieData, error: movieError, isLoading: movieLoading } = useSWR<Movie>(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar-SA`,
        fetcher
    );

    // Fetch movie credits (actors)
    const { data: creditsData, error: creditsError, isLoading: creditsLoading } = useSWR<MovieCredits>(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    );

    // Loading state with improved spinner
    if (movieLoading || creditsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl">Loading movie details...</p>
            </div>
        );
    }

    // Error state with improved styling
    if (movieError || creditsError || !movieData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">Error Loading Movie</h2>
                <p className="text-gray-400">Unable to fetch movie details. Please try again later.</p>
            </div>
        );
    }

    // Format duration
    const duration = movieData.runtime
        ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m`
        : null;

    // Get release year
    const releaseYear = movieData.release_date ? new Date(movieData.release_date).getFullYear() : null;

    // Format rating
    const rating = movieData.vote_average ? (movieData.vote_average / 10).toFixed(1) : null;

    // Get actor details (limit to top 4 for UI consistency)
    const actorDetails: Actor[] = (creditsData?.cast || []).slice(0, 4).filter(
        (actor): actor is Actor => actor !== undefined
    );

    // Get poster URL with fallback
    const posterUrl = movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : '/fallback-poster.jpg';

    return (
        <>
            <Head>
                <title>
                    مشاهدة فيلم {movieData.title} بجودة عاليه على Chill Time
                </title>
                <meta name="description" content={movieData.overview} />
                <meta
                    name="keywords"
                    content={`تحميل ومشاهدة فيلم ${movieData.title} مترجم`}
                />
            </Head>

            <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden pb-16">
                {/* Hero Background with Gradient Overlay */}
                <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(${posterUrl})`,
                        filter: 'blur(8px) brightness(0.55)',
                    }}
                />

                {/* Dark gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-black z-0"></div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 pt-32 lg:pt-40">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        {/* Poster Column */}
                        <div className="flex flex-col items-center lg:items-start">
                            {/* Poster with shadow effect */}
                            <div className="relative">
                                <Image
                                    fill
                                    className="w-64 h-auto rounded-2xl shadow-2xl shadow-blue-500/10"
                                    alt={movieData.title}
                                    src={posterUrl}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/fallback-poster.jpg';
                                    }}
                                />

                                {/* Rating badge */}
                                {rating && (
                                    <div className="absolute -top-4 -right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                                        {rating}
                                    </div>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="mt-8 w-full flex flex-col gap-3">
                                <MovieWatchBtn />
                                <MovieDownloadbtn />
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1">
                            {/* Title and Basic Info */}
                            <div className="mb-8">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-2">{movieData.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                                    {releaseYear && <span>{releaseYear}</span>}
                                    {duration && <span>{duration}</span>}
                                    {movieData.genres && (
                                        <div className="flex flex-wrap gap-2">
                                            {movieData.genres.map(genre => (
                                                <span key={genre.id} className="bg-red-800 px-2 py-1 rounded-md text-sm">
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Plot */}
                            <div className="mb-10">
                                <h3 className="text-2xl font-semibold mb-3">القصة</h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {movieData.overview || "لا يوجد ملخص متاح لهذا الفيلم."}
                                </p>
                            </div>

                            {/* Cast Section */}
                            <div>
                                <h3 className="text-2xl font-semibold mb-5">طاقم العمل</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4">
                                    {actorDetails.length > 0 ? (
                                        actorDetails.map((actor) => (
                                            <ActorCard
                                                key={actor.id}
                                                name={actor.name}
                                                id={actor.id.toString()}
                                                image={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/fallback-actor.jpg'}
                                                character={actor.character}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-400 col-span-4">لا تتوفر معلومات عن طاقم العمل.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;