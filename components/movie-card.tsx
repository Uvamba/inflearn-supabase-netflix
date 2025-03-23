"use client";

import Link from "next/link";
import { toggleFavorite } from "actions/movieActions";

export default function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
}) {
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(movie.id);
    // 부모 컴포넌트에 알려서 목록 다시 불러오기
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <div className="col-span-1 relative">
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 z-20 bg-black bg-opacity-50 p-2 rounded-full"
      >
        <i
          className={`fa${isFavorite ? "s" : "r"} fa-heart text-${
            isFavorite ? "red-500" : "white"
          }`}
        />
      </button>

      {/* Image 부분  */}
      <img src={movie.image_url} className="w-full" />
      {/* ,"Follow the mythic journey of Paul Atreides as he unites
      with Chani and the Fremen while on a path of revenge against the
      conspirators who destroyed his family. Facing a choice between the love of
      his life and the fate of the known universe, Paul endeavors to prevent a
      terrible future only he can foresee.",8.3,3437.313,2024-02-27 */}

      {/* Title Dim */}
      <Link href={`/movies/${movie.id}`}>
        <div className="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-0 hover:opacity-80 transition-opacity duration-300">
          <p className="text-xl font-bold text-white">{movie.title}</p>
        </div>
      </Link>
    </div>
  );
}
