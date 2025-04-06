"use client";

import { useEffect, useRef } from 'react';

export default function ArticleTopAd() {
  // 광고 초기화 여부를 추적하기 위한 ref
  const adInitialized = useRef(false);
  const adElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 이미 초기화된 경우 건너뛰기
    if (adInitialized.current) {
      return;
    }

    // 광고 초기화
    try {
      // adsbygoogle가 정의되어 있는지 확인
      if (typeof window.adsbygoogle !== 'undefined') {
        // 현재 요소가 이미 광고를 포함하고 있는지 확인
        const adElement = adElementRef.current?.querySelector('ins.adsbygoogle');
        if (adElement && (adElement as any).dataset.adsbygoogleStatus === 'done') {
          console.log('광고가 이미 초기화되었습니다.');
          return;
        }

        window.adsbygoogle.push({});
        adInitialized.current = true;
      } else {
        console.log('AdSense가 아직 로드되지 않았습니다.');
        
        // 1초 후 다시 시도
        const timer = setTimeout(() => {
          if (typeof window.adsbygoogle !== 'undefined' && !adInitialized.current) {
            window.adsbygoogle.push({});
            adInitialized.current = true;
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('AdSense 광고 로드 실패:', error);
    }
  }, []);

  return (
    <div className="my-6 w-full overflow-hidden" ref={adElementRef}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3761481337992291"
        data-ad-slot="5727375910"
        data-ad-format="auto"
        data-full-width-responsive="true"
        id="article-top-ad"
      />
    </div>
  );
}

// 전역 Window 타입에 adsbygoogle 추가
declare global {
  interface Window {
    adsbygoogle: any[];
  }
} 