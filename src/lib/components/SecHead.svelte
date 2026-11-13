<script>
	import RevealWords from './RevealWords.svelte';
	import { reveal } from '#lib/motion.js';
	let { title, text, accent = [], class: cls = '' } = $props();
</script>

<div class="sec-head {cls}">
	<RevealWords text={title} {accent} />
	{#if text}<p class="lead" use:reveal={{ delay: 3 }}>{text}</p>{/if}
</div>
