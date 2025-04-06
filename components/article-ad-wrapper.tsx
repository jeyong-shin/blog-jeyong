"use client";

import dynamic from "next/dynamic";

// 클라이언트 사이드에서만 렌더링되는 광고 컴포넌트
const ArticleTopAd = dynamic(() => import("@/components/article-ad"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function ArticleAdWrapper() {
  return <ArticleTopAd />;
} 