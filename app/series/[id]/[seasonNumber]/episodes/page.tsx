'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import Head from 'next/head';
import Image from 'next/image'; // Replaced img with Next.js Image component
import Episode from '@/components/Episode';
import { ChevronLeft, Calendar, Clock, Star, X } from 'lucide-react';

interface SeriesData {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    number_of_seasons: number;
    first_air_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
}

interface SeasonData {
    id: number;
    name: string;
    season_number: number;
    overview: string;
    poster_path: string;
    air_date: string;
    episodes: EpisodeData[];
}

interface EpisodeData {
    id: number;
    episode_number: number;
    name: string;
    overview: string;
    still_path: string;
    runtime: number;
    air_date: string;
    vote_average: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EpisodesMenu() {
    const router = useRouter();
    const params = useParams<{ id: string; seasonNumber: string }>();
    const { id, seasonNumber } = params;

    const [activeSeason, setActiveSeason] = useState(seasonNumber || '1');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch series basic info
    const { data: seriesData, error: seriesError } = useSWR<SeriesData>(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar-SA`,
        fetcher
    );

    // Fetch season episodes
    const { data: seasonData, error: seasonError } = useSWR<SeasonData>(
        `https://api.themoviedb.org/3/tv/${id}/season/${activeSeason}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ar-SA`,
        fetcher
    );

    const handleSeasonClick = (newSeasonNumber: string) => {
        setActiveSeason(newSeasonNumber);
        router.push(`/series/${id}/${newSeasonNumber}/episodes`);
        setMobileMenuOpen(false);
    };

    const closeBtnNavigate = () => {
        router.push(`/series/${id}`);
    };

    // Format date to Arabic
    const formatDate = (dateString: string) => {
        if (!dateString) return 'غير معروف';

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'غير معروف';
        }
    };

    if (seriesError || seasonError) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center p-8 rounded-xl bg-gray-900 shadow-lg max-w-md">
                    <X className="mx-auto mb-4 text-red-500" size={48} />
                    <h2 className="text-2xl mb-4 font-bold">خطأ في تحميل البيانات</h2>
                    <p className="mb-6 text-gray-400">عذراً، حدث خطأ أثناء محاولة تحميل بيانات المسلسل. يرجى المحاولة مرة أخرى.</p>
                    <button
                        onClick={closeBtnNavigate}
                        className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                    >
                        العودة
                    </button>
                </div>
            </div>
        );
    }

    if (!seriesData || !seasonData) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-red-600 border-red-600/30 rounded-full animate-spin"></div>
            </div>
        );
    }

    const posterUrl = seriesData.poster_path
        ? `https://image.tmdb.org/t/p/w500${seriesData.poster_path}`
        : '/fallback-poster.jpg';

    const backdropUrl = seriesData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${seriesData.backdrop_path}`
        : posterUrl;

    const seasonPosterUrl = seasonData.poster_path
        ? `https://image.tmdb.org/t/p/w300${seasonData.poster_path}`
        : posterUrl;

    return (
        <>
            <Head>
                <title>
                    {seriesData.name} - الموسم {activeSeason} | Chill Time
                </title>
                <meta name="description" content={seriesData.overview} />
            </Head>

            <div className="relative min-h-screen bg-black text-white overflow-x-hidden pb-16">
                {/* Background Image */}
                <div
                    className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(${backdropUrl})`,
                        filter: 'blur(8px) brightness(0.2)',
                    }}
                />

                {/* Gradient Overlay */}
                <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/80 to-black z-0"></div>

                {/* Header - Fixed on scroll */}
                <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-black/90 shadow-lg py-2' : 'bg-transparent py-4'
                }`}>
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <button
                            onClick={closeBtnNavigate}
                            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            <ChevronLeft size={18} />
                            <span>العودة</span>
                        </button>

                        <div className={`font-bold transition-all ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                            {seriesData.name} - الموسم {activeSeason}
                        </div>

                        {/* Mobile season selector toggle */}
                        <button
                            className="lg:hidden bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            اختر الموسم
                        </button>
                    </div>
                </header>

                {/* Mobile Seasons Menu - Slide down when open */}
                <div className={`fixed top-16 right-0 left-0 bg-gray-900 z-40 shadow-lg transition-transform duration-300 lg:hidden ${
                    mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                }`}>
                    <div className="container mx-auto px-4 py-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {Array.from({ length: seriesData.number_of_seasons }, (_, i) => i + 1).map((seasonNum) => (
                                <button
                                    key={seasonNum}
                                    onClick={() => handleSeasonClick(seasonNum.toString())}
                                    className={`text-center p-3 rounded-lg transition-colors ${
                                        activeSeason === seasonNum.toString()
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                                >
                                    {seasonNum}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 pt-32 lg:pt-36">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                        {/* Seasons List - Desktop */}
                        <div className="hidden lg:block lg:w-72 lg:fixed lg:right-4 xl:right-8 2xl:right-16">
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 text-center border-b border-gray-700 pb-3">المواسم</h2>
                                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {Array.from({ length: seriesData.number_of_seasons }, (_, i) => i + 1).map((seasonNum) => (
                                        <button
                                            key={seasonNum}
                                            onClick={() => handleSeasonClick(seasonNum.toString())}
                                            className={`text-lg p-3 rounded-lg transition-colors flex items-center justify-between ${
                                                activeSeason === seasonNum.toString()
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            <span>الموسم {seasonNum}</span>
                                            {activeSeason === seasonNum.toString() && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Series info card */}
                            <div className="mt-6 bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                                <div className="aspect-[2/3] mb-4 overflow-hidden rounded-lg">
                                    <Image
                                        src={posterUrl}
                                        alt={seriesData.name}
                                        width={500}
                                        height={750}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2 line-clamp-2">{seriesData.name}</h3>

                                {seriesData.genres && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {seriesData.genres.slice(0, 3).map(genre => (
                                            <span key={genre.id} className="text-xs bg-gray-800 px-2 py-1 rounded-md">
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-300 mb-2">
                                    <Calendar size={16} />
                                    <span className="text-sm">{formatDate(seriesData.first_air_date)}</span>
                                </div>

                                <div className="flex items-center gap-2 text-yellow-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm">{seriesData.vote_average?.toFixed(1)} / 10</span>
                                </div>
                            </div>
                        </div>

                        {/* Episodes List */}
                        <div className="flex-1 lg:mr-80">
                            {/* Season header */}
                            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Season poster - for medium screens and up */}
                                    <div className="hidden md:block w-40 h-60 flex-shrink-0">
                                        <Image
                                            src={seasonPosterUrl}
                                            alt={`${seriesData.name} - ${seasonData.name}`}
                                            width={300}
                                            height={450}
                                            className="w-full h-full object-cover rounded-lg shadow-md"
                                            priority
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold mb-2">
                                            الموسم {activeSeason} - {seasonData.name}
                                        </h2>

                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {seasonData.air_date && (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Calendar size={18} />
                                                    <span>{formatDate(seasonData.air_date)}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Clock size={18} />
                                                <span>{seasonData.episodes.length} حلقة</span>
                                            </div>
                                        </div>

                                        {seasonData.overview && (
                                            <p className="text-gray-300">{seasonData.overview}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Episodes */}
                            <div className="grid gap-6">
                                {seasonData.episodes.length > 0 ? (
                                    seasonData.episodes.map((episode) => (
                                        <Episode
                                            key={episode.id}
                                            episodeNumber={episode.episode_number}
                                            title={episode.name}
                                            description={episode.overview}
                                            img={
                                                episode.still_path
                                                    ? `https://image.tmdb.org/t/p/w400${episode.still_path}`
                                                    : '/fallback-episode.jpg'
                                            }
                                            runtime={episode.runtime}
                                            airDate={episode.air_date}
                                            rating={episode.vote_average}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 text-center">
                                        <p className="text-xl">لا توجد حلقات متاحة لهذا الموسم</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}