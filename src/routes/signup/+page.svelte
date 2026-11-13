<script>
	import { pageTitle } from '#lib/site.svelte.js';
	import AuthForm from '#lib/components/AuthForm.svelte';
</script>

<svelte:head><title>{pageTitle('Create account')}</title></svelte:head>

<AuthForm mode="signup" />
