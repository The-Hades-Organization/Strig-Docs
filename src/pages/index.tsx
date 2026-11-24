import { ThemeToggle } from '../ds/ThemeToggle';

export default function HomePage() {
  return (
    <main>
      <h1>Themis</h1>
      <ThemeToggle />
    </main>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
