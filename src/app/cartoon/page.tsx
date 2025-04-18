"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { audioService } from "@/services/audioService";
import { cartoonVideoMap } from "@/lib/cartoonVideoMap";

const cartoonIds = Object.keys(cartoonVideoMap).map(id => parseInt(id));
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function CartoonPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  const didSpeak = useRef(false);

  useEffect(() => {
    audioService.setSpeechLanguage("ru-RU");
    if (!didSpeak.current) {
      audioService.speak("Назови мультфильм или героя.");
      didSpeak.current = true;
    }

    const fetchAllMovies = async () => {
      const requests = cartoonIds.map(id =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=ru`).then(
          res => res.json()
        )
      );
      const results = await Promise.all(requests);
      setMovies(results);
      setVisibleMovies(pickRandom(results, 6));
    };

    fetchAllMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMovies(pickRandom(movies, 6));
    }, 7000);
    return () => clearInterval(interval);
  }, [movies]);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Ваш браузер не поддерживает голосовой ввод");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
      console.log("Голосовой ввод:", transcript);
      audioService.speak(`Ищу мультфильмы по запросу ${transcript}`);

      fetch(`/api/cartoons/search?query=${encodeURIComponent(transcript)}`)
        .then(res => res.json())
        .then(data => {
          setMovies(data.results);
          setVisibleMovies(data.results.slice(0, 6));
        });
    };

    recognition.onerror = e => {
      console.error("Ошибка распознавания:", e);
      audioService.speak("Не удалось распознать. Попробуй снова!");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage: 'url("/images/vinni-puh.jpeg")',
      }}
    >
      <div className="text-center text-green-700 drop-shadow-lg mb-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          Какой мультфильм ты хочешь посмотреть?
        </h1>
        <div className="flex justify-center flex-wrap gap-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-green-500"
            onClick={handleVoiceSearch}
          >
            🎤 Говорить
          </motion.button>

          <Link
            href="/"
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl shadow hover:bg-yellow-300"
          >
            ← На главную
          </Link>
        </div>

        {recognizedText && (
          <div className="mt-2 text-lg font-semibold text-white bg-black/30 inline-block px-4 py-2 rounded-lg shadow">
            Ты сказал: <span className="text-yellow-300">«{recognizedText}»</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {visibleMovies.map(movie => (
            <Link href={`/cartoon/${movie.id}`} key={movie.id}>
              <motion.div
                key={movie.id}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.2 }}
                transition={{ duration: 3 }}
                className="cursor-pointer rounded shadow p-2 bg-white/70 flex flex-col items-center border border-yellow-400 hover:scale-105 transition-transform"
              >
                {movie.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="rounded mb-2 object-contain w-full h-auto"
                  />
                )}
                <h2 className="text-sm font-bold text-center">{movie.title}</h2>
              </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}

function pickRandom(arr: Movie[], count: number): Movie[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
