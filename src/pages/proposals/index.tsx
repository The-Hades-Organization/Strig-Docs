import { Header } from '../../ds/Header';
import { DIRECTIONS } from '../../proposals/samples';

export default function ProposalsPage() {
  return (
    <div className="shell">
      <Header />
      <main id="content" className="proposals-index">
        <h1>Three directions</h1>
        <p className="prose-lead">
          Same tokens, same components, three ways to meet the reader. Each has a home and a doc page.
        </p>
        <ol className="direction-list">
          {DIRECTIONS.map((d) => (
            <li key={d.id}>
              <h2>
                {d.id.toUpperCase()} · {d.name}
              </h2>
              <p>{d.thesis}</p>
              <p className="direction-audience">For: {d.audience}</p>
              <p className="direction-links">
                <a href={`/proposals/${d.id}`}>Home</a>
                <a href={`/proposals/${d.id}/doc`}>Doc page</a>
              </p>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
