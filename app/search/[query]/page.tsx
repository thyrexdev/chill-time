// app/search/[query]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Head from 'next/head';

interface MediaItem {
    _id: string;
    type: string;
    poster: string;
    title: string;
    genre: string;
}

interface SearchData {
    movies: MediaItem[];
    series: MediaItem[];
}

// Static search data
const staticSearchData: Record<string, SearchData> = {
    "breaking": {
        movies: [
            {
                _id: "1",
                type: "movie",
                poster: "/breaking-movie.jpg",
                title: "Breaking Point",
                genre: "Action"
            }
        ],
        series: [
            {
                _id: "1",
                type: "series",
                poster: "/breaking-bad.jpg",
                title: "Breaking Bad",
                genre: "Drama"
            }
        ]
    },
    "game": {
        movies: [],
        series: [
            {
                _id: "2",
                type: "series",
                poster: "/game-of-thrones.jpg",
                title: "Game of Thrones",
                genre: "Fantasy"
            }
        ]
    }
};

export default function SearchPage() {
    const params = useParams<{ query: string }>();
    const query = params.query as string;

    // Get search results or empty results if not found
    const searchData = staticSearchData[query.toLowerCase()] || { movies: [], series: [] };
    const { movies, series } = searchData;

    return (
        <>
            <Head>
                <title>نتائج البحث عن {query}</title>
            </Head>


            <div className="pt-[150px] pr-[100px]">
                <h2 className="text-white text-2xl pr-4 border-r-2 border-solid border-red-600">
                    نتائج البحث لـ {query}
                </h2>

                {/* Movies Section */}
                <div className="lg:flex grid grid-cols-1 mt-8">
                    {movies.length > 0 && (
                        <>
                            <h3 className="text-gray-500 text-xl mb-4">أفلام</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {movies.map((item) => (
                                    <Card
                                        key={item._id}
                                        type={item.type}
                                        id={item._id}
                                        poster={item.poster}
                                        title={item.title}
                                        genre={[item.genre]}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Series Section */}
                <div className="mt-[60px]">
                    {series.length > 0 && (
                        <>
                            <h3 className="text-gray-500 text-xl mb-4">مسلسلات</h3>
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {series.map((item) => (
                                    <Card
                                        key={item._id}
                                        type={item.type}
                                        id={item._id}
                                        poster={item.poster}
                                        title={item.title}
                                        genre={[item.genre]}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* No Results Message */}
                {movies.length === 0 && series.length === 0 && (
                    <p className="text-white mt-8">لا توجد نتائج مطابقة للبحث</p>
                )}
            </div>
        </>
    );
}