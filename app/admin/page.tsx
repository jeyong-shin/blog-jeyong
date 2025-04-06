"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient, supabase } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

// 글 목록 타입 정의
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // 브라우저 클라이언트 초기화
    const browserClient = createBrowserClient();
    setClient(browserClient);
    
    async function checkAuth() {
      try {
        const { data: { session } } = await browserClient.auth.getSession();
        
        if (!session) {
          router.push("/login");
          return;
        }
        
        // 글 목록 불러오기
        await fetchArticles(browserClient);
        
        setIsLoading(false);
      } catch (error) {
        console.error("인증 확인 실패:", error);
        router.push("/login");
      }
    }
    
    checkAuth();
  }, [router]);

  // 글 목록 불러오기
  const fetchArticles = async (clientToUse: any) => {
    try {
      const supabaseClient = clientToUse || client;
      if (!supabaseClient) return;
      
      const { data, error } = await supabaseClient
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("글 목록 조회 실패:", error);
      toast.error("글 목록을 불러오는데 실패했습니다.");
    }
  };

  // 글 작성 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    
    setIsSubmitting(true);

    try {
      // 슬러그 생성 (제목 기반)
      // 한글이나 특수문자를 안전하게 처리
      const slug = formData.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, "") // 안전한 문자만 허용
        .replace(/\s+/g, "-") // 공백을 하이픈으로 변환
        .replace(/-+/g, "-") // 중복 하이픈 제거
        .replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
      
      console.log("생성된 슬러그:", slug); // 디버깅용
      
      // 슬러그 중복 확인
      const { data: existingArticle, error: checkError } = await client
        .from("articles")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      
      // 중복된 슬러그가 있는 경우 타임스탬프 추가
      const finalSlug = existingArticle 
        ? `${slug}-${Date.now().toString().slice(-6)}` 
        : slug;

      const { data, error } = await client.from("articles").insert([
        {
          title: formData.title,
          slug: finalSlug,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          published: true, // 바로 게시
          author_id: (await client.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) throw error;

      toast.success("글이 성공적으로 저장되었습니다.");
      
      // 폼 초기화
      setFormData({
        title: "",
        category: "",
        excerpt: "",
        content: "",
      });
      
      // 글 목록 다시 불러오기
      await fetchArticles(client);
    } catch (error) {
      console.error("글 저장 실패:", error);
      toast.error("글을 저장하는데 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 글 삭제 처리
  const handleDelete = async (id: number) => {
    if (!client) return;
    
    if (!confirm("정말로 이 글을 삭제하시겠습니까?")) return;

    try {
      const { error } = await client.from("articles").delete().eq("id", id);
      if (error) throw error;

      toast.success("글이 삭제되었습니다.");
      await fetchArticles(client);
    } catch (error) {
      console.error("글 삭제 실패:", error);
      toast.error("글을 삭제하는데 실패했습니다.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
          if (client) {
            await client.auth.signOut();
          }
          router.push("/login");
        }}>
          로그아웃
        </Button>
      </div>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle>새 글 작성</CardTitle>
          <CardDescription>블로그에 새로운 글을 작성합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                제목
              </label>
              <Input
                id="title"
                name="title"
                placeholder="글 제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                카테고리
              </label>
              <Input
                id="category"
                name="category"
                placeholder="카테고리를 입력하세요"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                요약
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="글의 요약을 입력하세요"
                value={formData.excerpt}
                onChange={handleChange}
                className="min-h-[80px]"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                내용
              </label>
              <Textarea
                id="content"
                name="content"
                placeholder="글 내용을 입력하세요"
                value={formData.content}
                onChange={handleChange}
                className="min-h-[300px]"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">글 목록</h2>
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(article.created_at)} · {article.published ? "게시됨" : "비공개"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                        보기
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">등록된 글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

