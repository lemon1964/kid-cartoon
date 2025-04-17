// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cartoons")
      .then(res => res.json())
      .then(data => setMovies(data.results));
  }, []);

  return (
    <>
      <div className="text-xl font-bold text-center text-blue-500">Привет, KidCartoon!</div>
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-300"
          onClick={() => router.push("/cartoon")}
        >
          Хочу смотреть мультфильм!
        </motion.button>
      </div>
      <main className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="rounded shadow p-2 bg-white">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded shadow-xl max-w-xs sm:max-w-sm md:max-w-md max-h-max object-contain"
              />
            )}
            <h2 className="text-sm font-bold">{movie.title}</h2>
            <p className="text-xs text-gray-600 line-clamp-3">{movie.overview}</p>
          </div>
        ))}
      </main>
    </>
  );
}
