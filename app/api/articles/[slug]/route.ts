import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  
  // 슬러그로 글 조회
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  
  if (error) {
    console.error("글 상세 조회 에러:", error);
    return NextResponse.json(
      { error: "글을 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ article: data });
} 