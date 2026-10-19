import Link from "next/link";

const pages = [
  {
    href: "/login",
    title: "User Login",
    description: "Family-name login with a Google option.",
  },
  {
    href: "/admin/login",
    title: "Admin Login",
    description: "Family name and password, with a Google option.",
  },
  {
    href: "/verify",
    title: "Verification",
    description: "Five-digit one-time password with a resend countdown.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 p-8">
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-black">IMENA Family Times</h1>
        <p className="text-muted text-sm">
          Auth pages are ready — pick one to preview.
        </p>
      </div>

      <nav className="grid w-full max-w-md gap-3">
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="hover:border-brand group border-field-border rounded-[15px] border px-5 py-4 transition-colors"
          >
            <span className="group-hover:text-brand block font-medium transition-colors">
              {page.title}
            </span>
            <span className="text-muted block text-sm">{page.description}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
