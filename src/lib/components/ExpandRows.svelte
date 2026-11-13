<!-- Rows whose photo opens from a pill to a full panel when you hover or focus them. -->
<script>
	import ArrowUpRight from 'phosphor-svelte/lib/ArrowUpRight';
	import { reveal } from '#lib/motion.js';
	let { rows } = $props();
	let open = $state(0);
</script>

<ul class="xrows">
	{#each rows as r, i (r.name)}
		<li class="xrow" class:is-open={open === i} use:reveal={{ delay: i }} onpointerenter={() => (open = i)} onfocusin={() => (open = i)}>
			<a href={r.to} class="xrow-link">
				<span class="xrow-name">{r.name}</span>
				<span class="xrow-text">{r.text}</span>
				<span class="xrow-img graded"><img src={r.photo.src(960)} alt={r.photo.alt} loading="lazy" /></span>
				<span class="xrow-go" aria-hidden="true"><ArrowUpRight weight="bold" /></span>
			</a>
		</li>
	{/each}
</ul>
