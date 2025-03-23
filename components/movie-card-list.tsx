"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import MovieCard from "./movie-card";
import { getFavoriteIds, searchMovies } from "actions/movieActions";
import { Spinner } from "@material-tailwind/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { searchState } from "utils/recoil/atoms";
import { useInView } from "react-intersection-observer";

export default function MovieCardList() {
  const search = useRecoilValue(searchState);
  const [favoriteIds, setFavoriteIds] = useState([]);

  const loadFavorites = useCallback(async () => {
    const { data } = await getFavoriteIds();
    setFavoriteIds(data || []);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["movie", search], //이 queryKey에 search를 넣어줘야 search값이 변경될때마다 query function이 재호출된다.
      queryFn: ({ pageParam }) =>
        searchMovies({ search, page: pageParam, pageSize: 12 }),
      getNextPageParam: (lastPage) =>
        lastPage.page ? lastPage.page + 1 : null,
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    console.log(inView);
  }, [inView]);
  // inView가 값이 변경될 때마다 호출될거다

  // 영화 목록 가공 - 찜한 영화를 상단에 표시
  const movies = data?.pages?.map((page) => page.data)?.flat() || [];

  // 찜한 영화를 상단으로 정렬
  const sortedMovies = [...movies].sort((a, b) => {
    const aFavorite = favoriteIds.includes(a.id);
    const bFavorite = favoriteIds.includes(b.id);
    return (bFavorite ? 1 : 0) - (aFavorite ? 1 : 0);
  });

  return (
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
      {
        <>
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favoriteIds.includes(movie.id)}
              onToggleFavorite={loadFavorites}
            />
          ))}
          {/* 데이터의 pages를 돌면서 각 페이지에는 페이지 파람, 몇 번째 페이지, 이런 여러가지 값들이 있는데, 우리는 이 데이터, 즉 Movie List만 뽑아올거다*/}
          {/* 그렇게 뽑아와서 flatten을 시킨다. 그럼 그냥 Movie List가 된다. */}
          {/* 그리고 이 무비 리스트를 돌면서 각 무비 아이템을 무비 카드에 넣어주는 부분이다. */}
          {/* 그리고 아래 부분에는 레퍼런스 하나 이렇게 있게 된다. InView를 관리하는 레퍼런스다.*/}
          <div ref={ref}></div>
          {/* 이런 빈 div 태그를 만들어주는 이유는 맨 아래로 내렸을 때 보이지 않는 어떤 태그가 호출되도록 만들 것이기 때문 */}
        </>
      }
      {(isFetching || isFetchingNextPage) && <Spinner />}
    </div>
  );
}
