function MainLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen bg-bg-base flex flex-col w-full text-text-primary">
          {children}
      </div>
  );
}

export default MainLayout;