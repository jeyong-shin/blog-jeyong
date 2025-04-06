import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createServerClient, supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

// 마크다운 렌더링을 위한 라이브러리 필요시:
// npm install react-markdown 설치 후 사용

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const encodedSlug = params?.slug;
  
  if (!encodedSlug) {
    return {
      title: "글을 찾을 수 없습니다",
      description: "요청하신 글을 찾을 수 없습니다."
    };
  }
  
  // URL slug 디코딩
  const slug = decodeURIComponent(encodedSlug);
  console.log("메타데이터용 slug(인코딩됨):", encodedSlug);
  console.log("메타데이터용 slug(디코딩됨):", slug);
  
  try {
    // 서버 클라이언트 생성
    const serverClient = createServerClient();
    
    // 디코딩된 슬러그로 검색
    const { data, error } = await serverClient
      .from("articles")
      .select("title, excerpt")
      .eq("slug", slug)  // 디코딩된 슬러그 사용
      .eq("published", true)
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.log("메타데이터 조회 실패, 대체 검색 시도:", error?.message);
      
      // 모든 글 조회 (대체 검색 위해)
      const { data: allArticles } = await serverClient
        .from("articles")
        .select("id, slug, title, excerpt")
        .eq("published", true);
      
      // 대체 검색 방법
      const matchedArticle = allArticles?.find(article => 
        article.slug === slug || 
        article.slug === encodedSlug
      );
      
      if (matchedArticle) {
        console.log("대체 검색으로 일치하는 글 찾음:", matchedArticle.slug);
        
        // 해당 ID로 다시 조회
        const { data: foundArticle, error: secondError } = await serverClient
          .from("articles")
          .select("*")
          .eq("id", matchedArticle.id)
          .limit(1);
          
        if (secondError || !foundArticle || foundArticle.length === 0) {
          console.error("두 번째 조회 실패:", secondError?.message);
          notFound();
        }
        
        const article = foundArticle[0];
        
        return {
          title: article.title,
          description: article.excerpt
        };
      }
      
      return {
        title: "글을 찾을 수 없습니다",
        description: "요청하신 글을 찾을 수 없습니다."
      };
    }
    
    const article = data[0];
    
    return {
      title: article.title,
      description: article.excerpt
    };
  } catch (error) {
    console.error("메타데이터 생성 에러:", error);
    return {
      title: "글을 찾을 수 없습니다",
      description: "요청하신 글을 찾을 수 없습니다."
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const encodedSlug = params?.slug;
  
  if (!encodedSlug) {
    notFound();
  }
  
  // URL slug 디코딩 및 디버깅
  const slug = decodeURIComponent(encodedSlug);
  console.log("URL slug 값(인코딩됨):", encodedSlug);
  console.log("URL slug 값(디코딩됨):", slug);
  
  try {
    // 서버 클라이언트 생성
    const serverClient = createServerClient();
    
    // 모든 글 조회 (디버깅 및 fallback 위해)
    const { data: allArticles } = await serverClient
      .from("articles")
      .select("id, slug, title")
      .eq("published", true);
    
    console.log("모든 글 슬러그:", allArticles?.map(a => a.slug));
    
    // 디코딩된 슬러그로 검색
    const { data, error } = await serverClient
      .from("articles")
      .select("*")
      .eq("slug", slug)  // 디코딩된 슬러그 사용
      .eq("published", true)
      .limit(1);
    
    // 정확한 슬러그로 찾을 수 없는 경우
    if (error || !data || data.length === 0) {
      console.log("디코딩된 슬러그로 검색 실패, 대체 검색 시도");
      
      // 대체 검색 방법: 모든 글에서 슬러그 비교
      const matchedArticle = allArticles?.find(article => 
        article.slug === slug || 
        article.slug === encodedSlug
      );
      
      if (matchedArticle) {
        console.log("대체 검색으로 일치하는 글 찾음:", matchedArticle.slug);
        
        // 해당 ID로 다시 조회
        const { data: foundArticle, error: secondError } = await serverClient
          .from("articles")
          .select("*")
          .eq("id", matchedArticle.id)
          .limit(1);
          
        if (secondError || !foundArticle || foundArticle.length === 0) {
          console.error("두 번째 조회 실패:", secondError?.message);
          notFound();
        }
        
        const article = foundArticle[0];
        
        return (
          <div className="container max-w-4xl px-4 py-12 md:py-16">
            <Button variant="ghost" className="mb-6" asChild>
              <Link href="/articles" className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                목록으로 돌아가기
              </Link>
            </Button>
            
            <div className="mb-4">
              {article.category && (
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {article.category}
                </span>
              )}
            </div>
            
            <h1 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            
            <div className="mb-8 text-sm text-muted-foreground">
              {formatDate(article.created_at)}
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {article.content && <ReactMarkdown>{article.content}</ReactMarkdown>}
            </div>
          </div>
        );
      }
      
      notFound();
    }
    
    const article = data[0];
    
    return (
      <div className="container max-w-4xl px-4 py-12 md:py-16">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/articles" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            목록으로 돌아가기
          </Link>
        </Button>
        
        <div className="mb-4">
          {article.category && (
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {article.category}
            </span>
          )}
        </div>
        
        <h1 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
          {article.title}
        </h1>
        
        <div className="mb-8 text-sm text-muted-foreground">
          {formatDate(article.created_at)}
        </div>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {article.content && <ReactMarkdown>{article.content}</ReactMarkdown>}
        </div>
      </div>
    );
  } catch (error) {
    console.error("글 렌더링 에러:", error);
    notFound();
  }
} 