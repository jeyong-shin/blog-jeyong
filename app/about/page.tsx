export default function AboutPage() {
  return (
    <div className="container max-w-3xl px-4 py-12 md:py-16">
      <h1 className="mb-6 text-3xl font-bold tracking-tighter md:text-4xl">소개</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="lead">안녕하세요, 개발 강사 신제용입니다. 웹 개발과 프로그래밍 교육에 열정을 가지고 있습니다.</p>

        <h2>경력</h2>
        <p>
          10년 이상의 웹 개발 경험과 5년 이상의 교육 경험을 바탕으로, 복잡한 프로그래밍 개념을 쉽고 명확하게 전달하는 데
          중점을 두고 있습니다. 주로 JavaScript, React, Next.js, TypeScript 등의 최신 웹 기술을 다루고 있습니다.
        </p>

        <h2>교육 철학</h2>
        <p>
          저는 단순히 코드를 가르치는 것이 아니라, 문제 해결 능력과 비판적 사고를 키우는 교육을 지향합니다. 학생들이
          스스로 생각하고 해결책을 찾을 수 있도록 돕는 것이 제 목표입니다.
        </p>

        <h2>블로그 소개</h2>
        <p>
          이 블로그는 제가 개발과 교육 과정에서 얻은 인사이트와 경험을 공유하는 공간입니다. 초보자부터 경험 있는
          개발자까지 모두에게 유용한 정보를 제공하고자 합니다.
        </p>

        <h2>연락처</h2>
        <p>
          강의 문의나 기타 질문이 있으시면 언제든지 연락해 주세요.
          <br />
          이메일: abel@even-my-dogs.com
        </p>
      </div>
    </div>
  )
}

