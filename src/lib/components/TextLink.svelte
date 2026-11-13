<script>
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	let { to, children } = $props();
</script>

<a href={to} class="tlink">{@render children()} <ArrowUpRight weight="bold" aria-hidden="true" /></a>
