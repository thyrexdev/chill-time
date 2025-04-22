// app/series/[id]/page.tsx
'use client';

import React from 'react';
import SeriesWatchBtn from "@/components/SeriesWatchBtn";
import ActorCard from "@/components/ActorCard";
import SeriesDownloadBtn from "@/components/SeriesDownloadBtn";
import Head from 'next/head';
import {useParams} from "next/navigation";
import useSWR from "swr";
import Image from 'next/image';


// Define TypeScript interfaces
interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
}

interface Series {
    adult: boolean;
    backdrop_path: string | null;
    created_by: Array<{
        id: number;
        credit_id: string;
        name: string;
        gender: number;
        profile_path: string | null;
    }>;
    episode_run_time: number[];
    first_air_date: string;
    genres: Array<{
        id: number;
        name: string;
    }>;
    homepage: string | null;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: {
        id: number;
        name: string;
        overview: string;
        vote_average: number;
        vote_count: number;
        air_date: string;
        episode_number: number;
        season_number: number;
        still_path: string | null;
    } | null;
    name: string;
    next_episode_to_air: {
        id: number;
        name: string;
        overview: string;
        vote_average: number;
        vote_count: number;
        air_date: string;
        episode_number: number;
        season_number: number;
        still_path: string | null;
    } | null;
    networks: Array<{
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }>;
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    production_companies: Array<{
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }>;
    production_countries: Array<{
        iso_3166_1: string;
        name: string;
    }>;
    seasons: Array<{
        air_date: string | null;
        episode_count: number;
        id: number;
        name: string;
        overview: string;
        poster_path: string | null;
        season_number: number;
    }>;
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
}
interface SeriesCredits {
    cast: Actor[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function SeriesPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: seriesData, error: seriesError, isLoading: seriesLoading } = useSWR<Series>(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar-SA`,
        fetcher
    );

    const { data: creditsData, error: creditsError, isLoading: creditsLoading } = useSWR<SeriesCredits>(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    );

    // Loading state
    if (seriesLoading || creditsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl">جاري تحميل تفاصيل المسلسل...</p>
            </div>
        );
    }

    // Error state
    if (seriesError || creditsError || !seriesData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">خطأ في تحميل المسلسل</h2>
                <p className="text-gray-400">تعذر تحميل التفاصيل. الرجاء المحاولة لاحقاً.</p>
            </div>
        );
    }

    // Format data
    const rating = seriesData.vote_average ? (seriesData.vote_average / 10).toFixed(1) : null;
    const firstAirYear = seriesData.first_air_date ? new Date(seriesData.first_air_date).getFullYear() : null;
    const episodeRuntime = seriesData.episode_run_time?.[0] ?
        `${Math.floor(seriesData.episode_run_time[0] / 60)}h ${seriesData.episode_run_time[0] % 60}m` :
        null;

    const actorDetails = (creditsData?.cast || []).slice(0, 4);
    const posterUrl = seriesData.poster_path
        ? `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`
        : '/fallback-poster.jpg';

    return (
        <>
            <Head>
                <title>مشاهدة مسلسل {seriesData.name} بجودة عالية على Chill Time</title>
                <meta name="description" content={seriesData.overview} />
                <meta name="keywords" content={`تحميل ومشاهدة مسلسل ${seriesData.name} مترجم`} />
            </Head>

            <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden pb-16">
                {/* Background Image */}
                <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(${posterUrl})`,
                        filter: 'blur(8px) brightness(0.55)',
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-black z-0"></div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 pt-32 lg:pt-40">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        {/* Poster Column */}
                        <div className="flex flex-col items-center lg:items-start">
                            <div className="relative">
                                <Image
                                    className="w-64 h-auto rounded-2xl shadow-2xl shadow-blue-500/10"
                                    alt={seriesData.name}
                                    src={posterUrl}
                                    width={500} // Set appropriate width
                                    height={750} // Set appropriate height
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/fallback-poster.jpg';
                                    }}
                                />
                                {rating && (
                                    <div className="absolute -top-4 -right-4 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                                        {rating}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 w-full flex flex-col gap-3">
                                <SeriesWatchBtn />
                                <SeriesDownloadBtn />
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-1">
                            {/* Title and Info */}
                            <div className="mb-8">
                                <h1 className="text-3xl lg:text-5xl font-bold mb-2">{seriesData.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                                    {firstAirYear && <span>{firstAirYear}</span>}
                                    {episodeRuntime && <span>{episodeRuntime}</span>}
                                    <span>{seriesData.number_of_seasons} مواسم</span>
                                    {seriesData.genres?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {seriesData.genres.map(genre => (
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
                                    {seriesData.overview || "لا يوجد ملخص متاح لهذا المسلسل."}
                                </p>
                            </div>

                            {/* Cast */}
                            <div>
                                <h3 className="text-2xl font-semibold mb-5">طاقم العمل</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {actorDetails.length > 0 ? (
                                        actorDetails.map((actor) => (
                                            <ActorCard
                                                key={actor.id}
                                                name={actor.name}
                                                id={actor.id.toString()}
                                                image={actor.profile_path ?
                                                    `https://image.tmdb.org/t/p/w200${actor.profile_path}` :
                                                    '/fallback-actor.jpg'}
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
}