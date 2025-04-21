// app/series/[id]/[seasonNumber]/[episodeNumber]/[type]/page.tsx
'use client';

import React from 'react';
import {useParams, useRouter} from 'next/navigation';
import Head from 'next/head';

interface EpisodeQuality {
    type: string;
    link: string;
}

interface Series {
    _id: string;
    title: string;
    poster: string;
    seasons: {
        [seasonNumber: string]: {
            [episodeNumber: string]: {
                qualities: EpisodeQuality[];
            }
        }
    };
}

// Static data
const staticData: Record<string, Series> = {
    "1": {
        _id: "1",
        title: "Breaking Bad",
        poster: "/breaking-bad-poster.jpg",
        seasons: {
            "1": {
                "1": {
                    qualities: [
                        { type: "720p", link: "https://example.com/bb-s1e1-720p" },
                        { type: "1080p", link: "https://example.com/bb-s1e1-1080p" }
                    ]
                },
                "2": {
                    qualities: [
                        { type: "720p", link: "https://example.com/bb-s1e2-720p" }
                    ]
                }
            },
            "2": {
                "1": {
                    qualities: [
                        { type: "4k", link: "https://example.com/bb-s2e1-4k" }
                    ]
                }
            }
        }
    }
};

export default function WatchSeriesPage() {
    const router = useRouter();
    const params = useParams<{ id: string; seasonNumber: string, episodeNumber: string, type: string }>();
    const { id, seasonNumber, episodeNumber, type } = params;

    const seriesData = staticData[id] || {
        _id: '',
        title: 'Series Not Found',
        poster: '',
        seasons: {}
    };

    const episode = seriesData.seasons[seasonNumber]?.[episodeNumber]?.qualities.find(
        (quality) => quality.type === type
    );

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        minHeight: '100vh',
        color: 'white'
    };

    const backgroundStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${seriesData.poster})`,
        backgroundSize: 'cover',
        filter: 'blur(5px) brightness(0.2)',
        zIndex: -1
    };

    return (
        <>
            <Head>
                <title>{seriesData.title} - Season {seasonNumber} Episode {episodeNumber}</title>
            </Head>

            <div style={containerStyle}>
                <div style={backgroundStyle}></div>



                <div className="lg:absolute lg:mt-[100px] lg:mr-[50px] lg:w-full lg:h-[100vh] space-y-6">
                    <h2 className="cursor-pointer text-white lg:text-3xl mr-12 text-2xl mt-12">
                        {seriesData.title} - S{seasonNumber}E{episodeNumber}
                    </h2>

                    {episode ? (
                        <iframe
                            className="lg:absolute lg:items-center lg:mt-[50px] lg:mr-[150px] lg:w-[1200px] lg:h-[600px] w-[350px] h-[300px] mr-6 mt-10"
                            width="1200"
                            height="620"
                            src={episode.link}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${seriesData.title} - Season ${seasonNumber} Episode ${episodeNumber}`}
                        />
                    ) : (
                        <div className="text-white lg:text-lg text-base mt-5 p-4 bg-black bg-opacity-50 rounded-lg">
                            <p>الحلقة غير متوفرة بجودة {type}. يرجى المحاولة بجودة أخرى.</p>
                            <div className="mt-4">
                                <p>الجودات المتاحة:</p>
                                <ul className="list-disc list-inside">
                                    {seriesData.seasons[seasonNumber]?.[episodeNumber]?.qualities.map((quality) => (
                                        <li key={quality.type}>
                                            <button
                                                onClick={() => router.push(`/series/${id}/${seasonNumber}/${episodeNumber}/${quality.type}`)}
                                                className="text-blue-400 hover:underline"
                                            >
                                                {quality.type}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}