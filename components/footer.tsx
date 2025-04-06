import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 개발 강사 신제용의 블로그. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="https://www.github.com/jeyong-shin" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}

