export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat">
      <main className="bg-white/60 min-h-screen">{children}</main>
    </div>
  );
};
