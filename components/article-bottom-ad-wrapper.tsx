"use client";

import dynamic from "next/dynamic";

// 클라이언트 사이드에서만 렌더링되는 광고 컴포넌트
const ArticleBottomAd = dynamic(() => import("@/components/article-bottom-ad"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function ArticleBottomAdWrapper() {
  return <ArticleBottomAd />;
} 