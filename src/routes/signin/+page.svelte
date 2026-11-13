<script>
	import { pageTitle } from '#lib/site.svelte.js';
	import AuthForm from '#lib/components/AuthForm.svelte';
</script>

<svelte:head><title>{pageTitle('Sign in')}</title></svelte:head>

<AuthForm mode="signin" />
