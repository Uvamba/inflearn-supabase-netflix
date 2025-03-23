"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function searchMovies({ search, page, pageSize }) {
  const supabase = await createServerSupabaseClient();

  const { data, count, error } = await supabase
    .from("movie")
    .select("*", { count: "exact" })
    .like("title", `%${search}%`)
    .range((page - 1) * pageSize, page * pageSize - 1);

  const hasNextPage = count > page * pageSize;

  if (error) {
    console.error(error);
    return {
      data: [],
      count: 0,
      page: null,
      pageSize: null,
      error,
    };
  }

  return {
    data,
    page,
    pageSize,
    hasNextPage,
  };
}

export async function getMovie(id) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}

export async function toggleFavorite(movieId) {
  const supabase = await createServerSupabaseClient();

  const { data: movie } = await supabase
    .from("movie")
    .select("favorite")
    .eq("id", movieId)
    .single();

  const newState = !movie?.favorite;

  const { error } = await supabase
    .from("movie")
    .update({ favorite: newState })
    .eq("id", movieId);

  return { success: !error, isFavorite: newState, error };
}

// 사용자가 찜한 영화 ID 목록 가져오기
export async function getFavoriteIds() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("movie")
    .select("id")
    .eq("favorite", true);

  return { data: data?.map((item) => item.id) || [] };
}

// "use server";

// import { createServerSupabaseClient } from "utils/supabase/server";

// function handleError(error) {
//   if (error) {
//     console.error(error);
//     throw error;
//   }
// }

// export async function searchMovies({ search, page, pageSize }) {
//   const supabase = await createServerSupabaseClient();

//   const { data, count, error } = await supabase
//     .from("movie")
//     .select("*", { count: "exact" })
//     .like("title", `%${search}%`)
//     .range((page - 1) * pageSize, page * pageSize - 1);
//   // 현재 가져와야 하는 페이지가 몇 번쨰부터 시작을 하는지
//   // 첫번째가 오프셋이고, 두번째는 마이너스 1, 여기가 어디서 끝나야 하는지를 알려줌
//   //즉 Range는 start와 end를 받는다.

//   const hasNextPage = count > page * pageSize;

//   if (error) {
//     console.error(error);
//     return {
//       data: [],
//       count: 0,
//       page: null,
//       pageSize: null,
//       // 페이지와 페이지 사이즈를 널로 주는 이유?
//       // 무비 카드 리스트의 getNextPageParam이 있는데, 여기의 페이지 값이 null이 될테고,
//       // 그렇기 떄문에 다음 페이지가 존재하지 않는다. 그래서 hasNextPage가 false가 될거다.
//       //그렇게 하지 않으면 우리가 넣어줬던 페이지를 그대로 에러인 상황에서도 리턴하고 있었기 떄문에
//       // 이 페이지가 계속 다음 페이지가 있다고 말하는 상황이었어ㅓㅅ 이 부분이 오류가 있을 수 있게 된다.
//       // 이렇게 하면 맨 아래 부분에 내렸을 때 더이상 다음 페이지가 존재하지 않기 때문에 InView가 HasNextPage에서 HasNextPage가 호출이 안 되게 된다.

//       error,
//     };
//   }

//   return {
//     data,
//     page,
//     pageSize,
//     hasNextPage,
//   };
// }

// export async function getMovie(id) {
//   const supabase = await createServerSupabaseClient();

//   const { data, error } = await supabase
//     .from("movie")
//     .select("*")
//     .eq("id", id)
//     .maybeSingle();

//   handleError(error);

//   return data;
// }
