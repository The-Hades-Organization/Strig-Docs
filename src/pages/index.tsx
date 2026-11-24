export default function HomePage() {
  return (
    <main>
      <h1>Themis</h1>
    </main>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
