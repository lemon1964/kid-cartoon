"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { cartoonVideoMap } from "@/lib/cartoonVideoMap";
import { audioService } from "@/services/audioService";

const NEXT_PUBLIC_TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MoviePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  const router = useRouter();

  const youTubeId = id ? cartoonVideoMap[parseInt(id)] : undefined;

  useEffect(() => {
    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${NEXT_PUBLIC_TMDB_API_KEY}&language=ru`
      );
      if (!res.ok) return;
      const data = await res.json();
      setMovie(data);
    };

    fetchMovie();
  }, [params.id]);

  useEffect(() => {
    if (!movie) return;

    if (youTubeId) {
      const timer = setTimeout(() => {
        setShowVideo(false);
        audioService.speak("Пора возвращаться к задачам!");
        setTimeout(() => router.push("/"), 3000);
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    } else {
      audioService.speak("Обещай, что вернешься через 5 минут!");
      const timer = setTimeout(() => {
        audioService.speak("Пора возвращаться в Кид!");
        setTimeout(() => router.push("/"), 5000);
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [movie, youTubeId, router]);

  if (!movie) return null;

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white px-6 pt-6 pb-28"
      style={{
        backgroundImage: movie.backdrop_path
          ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
          : undefined,
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="max-w-4xl mx-auto bg-black/60 rounded-xl p-6 shadow-lg backdrop-blur-md pb-16">
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        <p className="mb-4 opacity-90">{movie.overview}</p>

        <Link
          href="/cartoon"
          className="inline-block mb-6 bg-yellow-400 text-black font-bold px-4 py-2 rounded shadow hover:bg-yellow-300"
        >
          ← Назад
        </Link>

        {youTubeId && showVideo ? (
          <div className="aspect-video w-full rounded overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youTubeId}?autoplay=1`}
              title={movie.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : !youTubeId ? (
          <div className="flex flex-col items-center gap-4 mt-6 pb-12">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="rounded shadow-xl object-contain max-w-xs sm:max-w-sm md:max-w-md w-auto h-auto"
              />
            )}
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                movie.title + " мультфильм"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg mb-2"
            >
              Смотрим на YouTube
            </a>
          </div>
        ) : (
          <div className="text-center mt-6 text-lg font-semibold text-white">
            Время просмотра закончилось! 🌟
          </div>
        )}
      </div>
    </main>
  );
}
