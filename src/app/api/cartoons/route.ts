// app/api/cartoons/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=16&language=ru&region=RU`

  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
