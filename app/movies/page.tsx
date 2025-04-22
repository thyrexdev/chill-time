// app/movies/page.tsx
import dynamic from 'next/dynamic';

const MovieClient = dynamic(() => import('./MovieClient'), { ssr: false });

export default function MoviesPage() {
    return <MovieClient />;
}
