"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }
        
        // 여기서 추가적인 권한 검사를 할 수 있습니다.
        // 예: 특정 역할을 가진 사용자만 접근 가능하게 하기
        
        setIsLoading(false);
      } catch (error) {
        console.error("인증 확인 실패:", error);
        router.push("/login");
      }
    }
    
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <p className="text-lg">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">관리자 페이지</h1>
        <Button variant="outline" onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}>
          로그아웃
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>새 글 작성</CardTitle>
          <CardDescription>블로그에 새로운 글을 작성합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                제목
              </label>
              <Input id="title" placeholder="글 제목을 입력하세요" />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                카테고리
              </label>
              <Input id="category" placeholder="카테고리를 입력하세요" />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                내용
              </label>
              <Textarea id="content" placeholder="글 내용을 입력하세요" className="min-h-[200px]" />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">최근 글 목록</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">샘플 글 제목 {i}</h3>
                  <p className="text-sm text-muted-foreground">2023-12-{15 - i} · 게시됨</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    수정
                  </Button>
                  <Button variant="destructive" size="sm">
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

