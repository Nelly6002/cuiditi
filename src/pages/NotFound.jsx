import { usePageTitle } from '../lib/site.js';
import { photos } from '../data/photos.js';
import { Btn, Page, PageHero } from '../components/Blocks.jsx';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <Page>
      <PageHero photo={photos.eko} tall eyebrow="404" title="This land has not been built yet." accent={['built']} lead="The link may be old or mistyped. Head back home, or check a title while you are here.">
        <Btn to="/">Back to home</Btn>
        <Btn to="/verify" variant="ghost">
          Verify a title
        </Btn>
      </PageHero>
    </Page>
  );
}
