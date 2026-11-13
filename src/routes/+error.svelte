<script>
	import { page } from '$app/state';
	import { pageTitle } from '#lib/site.svelte.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from '#lib/components/Btn.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	const missing = $derived(page.status === 404);
</script>

<svelte:head><title>{pageTitle(missing ? 'Page not found' : 'Something went wrong')}</title></svelte:head>

<PageHero
	photo={photos.eko}
	tall
	eyebrow={String(page.status)}
	title={missing ? 'This land has not been built yet.' : 'Something went wrong on our side.'}
	accent={['built']}
	lead={missing ? 'The link may be old or mistyped. Head back home, or check a title while you are here.' : 'Please try again in a moment.'}
>
	<Btn to="/">Back to home</Btn>
	<Btn to="/verify" variant="ghost">Verify a title</Btn>
</PageHero>
