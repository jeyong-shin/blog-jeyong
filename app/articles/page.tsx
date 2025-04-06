import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"

// 광고 컴포넌트 구현을 위한 클라이언트 래퍼
import ArticleAdWrapper from "@/components/article-ad-wrapper"

async function getArticles() {
  try {
    const serverClient = createServerClient()
    
    const { data, error } = await serverClient
      .from("articles")
      .select("id, title, slug, excerpt, category, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("글 목록 조회 에러:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("글 목록 조회 실패:", error)
    return []
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="container px-4 py-12 md:py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tighter md:text-4xl">모든 글</h1>
      
      {/* 광고 배너 - 클라이언트 래퍼 사용 */}
      <ArticleAdWrapper />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{article.excerpt}</p>
              {article.category && (
                <div className="mt-3">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {article.category}
                  </span>
                </div>
              )}
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
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">등록된 글이 없습니다.</p>
        </div>
      )}
    </div>
  )
}

