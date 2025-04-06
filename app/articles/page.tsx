import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for articles
const articles = [
  {
    id: 1,
    title: "Next.js 14의 새로운 기능",
    excerpt: "Next.js 14에서 추가된 새로운 기능들을 살펴봅니다.",
    date: "2023-12-15",
    readTime: "5분",
    category: "Next.js",
  },
  {
    id: 2,
    title: "React Server Components 이해하기",
    excerpt: "React Server Components의 개념과 사용법에 대해 알아봅니다.",
    date: "2023-12-10",
    readTime: "7분",
    category: "React",
  },
  {
    id: 3,
    title: "Tailwind CSS로 효율적인 스타일링",
    excerpt: "Tailwind CSS를 활용한 효율적인 웹 개발 방법을 소개합니다.",
    date: "2023-12-05",
    readTime: "4분",
    category: "CSS",
  },
  {
    id: 4,
    title: "TypeScript 타입 시스템 마스터하기",
    excerpt: "TypeScript의 고급 타입 기능을 활용하는 방법을 알아봅니다.",
    date: "2023-11-28",
    readTime: "8분",
    category: "TypeScript",
  },
  {
    id: 5,
    title: "웹 성능 최적화 전략",
    excerpt: "웹 애플리케이션의 성능을 향상시키는 다양한 전략을 소개합니다.",
    date: "2023-11-20",
    readTime: "6분",
    category: "Performance",
  },
  {
    id: 6,
    title: "JavaScript 비동기 프로그래밍",
    excerpt: "Promise, async/await을 활용한 효과적인 비동기 프로그래밍 방법을 알아봅니다.",
    date: "2023-11-15",
    readTime: "7분",
    category: "JavaScript",
  },
  {
    id: 7,
    title: "React 상태 관리 라이브러리 비교",
    excerpt: "Redux, Zustand, Jotai, Recoil 등 다양한 상태 관리 라이브러리를 비교합니다.",
    date: "2023-11-10",
    readTime: "9분",
    category: "React",
  },
  {
    id: 8,
    title: "웹 접근성 향상을 위한 가이드",
    excerpt: "모두가 사용할 수 있는 웹사이트를 만들기 위한 접근성 가이드라인을 소개합니다.",
    date: "2023-11-05",
    readTime: "6분",
    category: "Accessibility",
  },
]

export default function ArticlesPage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tighter md:text-4xl">모든 글</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">{article.category}</div>
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
  )
}

