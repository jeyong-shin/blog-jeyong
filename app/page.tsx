import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient, supabase } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"

// 날짜 포맷 함수 (필요하면 lib/utils.ts에 추가)
// 이 시점에서 utils.ts가 없다면 추후에 생성해 주세요

async function getRecentArticles() {
  try {
    const serverClient = createServerClient();
    
    const { data, error } = await serverClient
      .from("articles")
      .select("id, title, slug, excerpt, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("최근 글 조회 에러:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("최근 글 조회 실패:", error);
    return [];
  }
}

export default async function Home() {
  const recentArticles = await getRecentArticles();

  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      {/* Hero Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-8 md:py-12">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              개발 강사 신제용의 블로그에 오신 것을 환영합니다
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              웹 개발, 프로그래밍, 그리고 기술 교육에 관한 이야기를 나눕니다.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/articles">모든 글 보기</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">소개</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">최근 글</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentArticles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{article.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(article.created_at)}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/articles/${article.slug}`}>읽기</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

