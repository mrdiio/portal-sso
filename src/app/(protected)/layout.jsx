export default async function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 bg-muted/40 p-4 md:p-6">{children}</main>
    </div>
  )
}
