// app/api/cartoons/search/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query') || ''
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ru`

  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
