// app/movies/page.tsx
import React, { Suspense } from 'react';
import MovieClient from './MovieClient';

export default function MoviesPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-10">Loading movies...</div>}>
            <MovieClient />
        </Suspense>
    );
}
