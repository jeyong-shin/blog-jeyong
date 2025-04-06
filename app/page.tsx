import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for recent articles
const recentArticles = [
  {
    id: 1,
    title: "Next.js 14의 새로운 기능",
    excerpt: "Next.js 14에서 추가된 새로운 기능들을 살펴봅니다.",
    date: "2023-12-15",
    readTime: "5분",
  },
  {
    id: 2,
    title: "React Server Components 이해하기",
    excerpt: "React Server Components의 개념과 사용법에 대해 알아봅니다.",
    date: "2023-12-10",
    readTime: "7분",
  },
  {
    id: 3,
    title: "Tailwind CSS로 효율적인 스타일링",
    excerpt: "Tailwind CSS를 활용한 효율적인 웹 개발 방법을 소개합니다.",
    date: "2023-12-05",
    readTime: "4분",
  },
  {
    id: 4,
    title: "TypeScript 타입 시스템 마스터하기",
    excerpt: "TypeScript의 고급 타입 기능을 활용하는 방법을 알아봅니다.",
    date: "2023-11-28",
    readTime: "8분",
  },
  {
    id: 5,
    title: "웹 성능 최적화 전략",
    excerpt: "웹 애플리케이션의 성능을 향상시키는 다양한 전략을 소개합니다.",
    date: "2023-11-20",
    readTime: "6분",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8 md:py-12">
      {/* Hero Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
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
                    {article.date} · {article.readTime} 읽기
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/articles/${article.id}`}>읽기</Link>
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

