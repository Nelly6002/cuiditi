<script>
	import Drop from 'phosphor-svelte/lib/Drop';
	let { light = false } = $props();
</script>

<a href="/" class="logo" class:logo-light={light} aria-label="Cuiditi home">
	<span class="logo-mark"><Drop weight="fill" aria-hidden="true" /></span>
	Cuiditi
</a>
