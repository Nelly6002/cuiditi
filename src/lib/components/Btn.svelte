<!-- Button with an arrow that slides out and a fresh one that slides in on hover. -->
<script>
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	let { to, href, variant = 'primary', small = false, type = 'button', onclick, children } = $props();
	const cls = $derived(`btn btn-${variant}${small ? ' btn-sm' : ''}`);
</script>

{#snippet inner()}
	<span>{@render children()}</span>
	<span class="btn-arrow" aria-hidden="true"><ArrowRight weight="bold" /><ArrowRight weight="bold" /></span>
{/snippet}

{#if to || href}
	<a href={to ?? href} class={cls}>{@render inner()}</a>
{:else}
	<button {type} class={cls} {onclick}>{@render inner()}</button>
{/if}
