import { Seal } from '../ds/Seal';
import { Shell } from '../ds/Shell';
import { LINKS } from '../ds/links';

// Waku serves this for any route no page claims, and writes it to 404.html in
// the static build.
export default function NotFound() {
  return (
    <Shell>
      <div className="home">
        <section className="home-hero">
          <h1>Nothing at this address.</h1>
          <p className="home-lead">
            The page may have moved, or the link may have a typo. The docs index lists every page.
          </p>
          <div className="home-actions">
            <a className="button" data-kind="primary" href={LINKS.docs}>
              Open the docs
            </a>
            <a className="button" href="/">
              Back to the home page
            </a>
          </div>
          <div className="home-seals">
            <Seal verdict="deny" reason="404: no page matches this path" />
          </div>
        </section>
      </div>
    </Shell>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
