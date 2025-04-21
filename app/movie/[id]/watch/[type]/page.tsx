'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';

// Define TypeScript interfaces
interface MovieQuality {
    link: string;
}

interface MovieQualities {
    hd?: MovieQuality;
    sd?: MovieQuality;
    [key: string]: MovieQuality | undefined;
}

interface Movie {
    _id: string;
    title: string;
    poster: string;
    qualities: MovieQualities;
}

interface StaticData {
    movies: Record<string, Movie>;
}

// Static data with proper typing
const staticData: StaticData = {
    movies: {
        "1": {
            _id: "1",
            title: "Movie Title",
            poster: "/movie-poster.jpg",
            qualities: {
                "hd": { link: "https://example.com/hd-stream" },
                "sd": { link: "https://example.com/sd-stream" }
            }
        }
    }
};

export default function page() {
    const router = useRouter();
    const params = useParams<{ id: string; type: string }>();

    if (!params?.id || !params?.type) {
        // Handle missing params case
        return <div>Invalid movie parameters</div>;
    }

    const { id, type } = params;

    // Close button navigation handler
    const closeBtnNavigate = () => {
        router.back();
    };

    // Get movie data from static data with type safety
    const movieData = staticData.movies[id] ?? {
        _id: '',
        title: 'Movie Not Found',
        poster: '',
        qualities: {}
    };

    const movieQuality = movieData.qualities[type] ?? { link: '' };

    // Inline styles with proper typing
    const containerStyle: React.CSSProperties = {
        position: 'relative',
        minHeight: '100vh'
    };

    const backgroundStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${movieData.poster})`,
        backgroundSize: 'cover',
        filter: 'blur(5px) brightness(0.2)',
        zIndex: -100
    };

    return (
        <>
            <Head>
                <title>{`Watching ${movieData.title} - Chill Time`}</title>
            </Head>

            <div style={containerStyle}>
                {/* Background overlay */}
                <div style={backgroundStyle}></div>

                {/* Close button */}


                {/* Movie player */}
                <div className="lg:absolute lg:mt-[50px] lg:mr-[50px] lg:w-full lg:h-[100vh]">
                    <h2
                        onClick={closeBtnNavigate}
                        className="cursor-pointer text-white lg:text-3xl mr-12 text-2xl mt-12"
                    >
                        {movieData.title}
                    </h2>

                    <iframe
                        className="lg:absolute lg:items-center lg:mt-[50px] lg:mr-[150px] lg:w-[1200px] lg:h-[600px] w-[350px] h-[300px] mr-6 mt-10"
                        width="1200"
                        height="620"
                        src={movieQuality.link}
                        allow="fullscreen"
                        allowFullScreen
                        title={`${movieData.title} Player`}
                    />
                </div>
            </div>
        </>
    );
}