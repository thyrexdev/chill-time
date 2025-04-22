'use client'

import useSWR from "swr";
import {useParams} from "next/navigation";
import React from "react";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    character: string;
}

interface Actor {
    biography: string | null;
    id: number;
    name: string;
    profile_path: string | null;
    credits?: {
        cast: Movie[]; // Array of movies
    };
}

const Page = () => {
    const params = useParams();
    const id = params.id as string;

    const { data: actorData, error: actorError, isLoading: actorLoading } = useSWR<Actor>(
        `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        fetcher
    );

    if (actorLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl">Loading movie details...</p>
            </div>
        );
    }

    if (actorError || !actorData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col justify-center items-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-2">Error Loading Actor</h2>
                <p className="text-gray-400">Unable to fetch movie details. Please try again later.</p>
            </div>
        );
    }

    const posterUrl = actorData.profile_path
        ? `https://image.tmdb.org/t/p/w500${actorData.profile_path}`
        : '/fallback-poster.jpg';

  return(
    <div>
      actor
      <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
          style={{
              backgroundImage: `url(${posterUrl})`,
              filter: 'blur(8px) brightness(0.55)',
          }}
      />

      <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/70 to-black z-0"></div>


      <div className='relative z-10 container mx-auto px-4 pt-32 lg:pt-40'>
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 '>
              <Image src={posterUrl} alt={actorData.name} width={250} height={500} className='rounded-2xl'/>
              <div className='flex flex-col items-center text-left lg:items-start gap-4'
              style={{direction: 'ltr'}}>
                <h1 className='text-4xl text-white'>{actorData.name}</h1>
                <p className='text-gray-400'>{actorData.biography}</p>
              </div>
          </div>
      </div>


  </div>
    )
};

export default Page;