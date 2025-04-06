import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  
  // 기본 쿼리 설정
  let query = supabase
    .from("articles")
    .select("id, title, slug, excerpt, category, created_at, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  
  // featured 파라미터가 있는 경우 필터링
  if (featured === "true") {
    query = query.eq("featured", true);
  }
  
  // 페이지네이션 적용
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  // 쿼리 실행
  const { data, error, count } = await query
    .range(from, to)
    .limit(limit);
  
  if (error) {
    console.error("글 목록 조회 에러:", error);
    return NextResponse.json(
      { error: "글 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    articles: data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: count ? Math.ceil(count / limit) : 0
    }
  });
} 