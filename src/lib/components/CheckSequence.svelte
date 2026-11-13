<!-- A small live demo of a title check: each step spins, then ticks, then the result lands. Loops while visible. -->
<script>
	import { inView } from 'motion';
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import Check from 'phosphor-svelte/lib/Check';
	import CircleNotch from 'phosphor-svelte/lib/CircleNotch';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';

	let { class: cls = '' } = $props();
	const STEPS = ['Title found in the registry', 'Parcel matched on the map', 'No disputes on record'];
	let el;
	let visible = $state(false);
	let step = $state(0);
	const done = $derived(step >= STEPS.length);
	const stateOf = (i) => (step > i ? 'done' : step === i ? 'run' : 'wait');

	$effect(() =>
		inView(
			el,
			() => {
				visible = true;
				return () => (visible = false);
			},
			{ margin: '0px 0px -10% 0px' }
		)
	);

	$effect(() => {
		if (!visible) return;
		const s = step;
		const id = setTimeout(() => (step = s >= STEPS.length + 2 ? 0 : s + 1), s === STEPS.length ? 2400 : 900);
		return () => clearTimeout(id);
	});
</script>

<div bind:this={el} class="glass checkseq {cls}">
	<div class="checkseq-head">
		<span class="chip chip-glass">Example check</span>
		{#key done}
			{#if done}
				<span class="checkseq-ok" in:scale={{ start: 0.6, duration: 400, easing: backOut }}><SealCheck weight="fill" /> Verified</span>
			{:else}
				<span class="checkseq-run" in:fade>Checking</span>
			{/if}
		{/key}
	</div>
	<ul>
		{#each STEPS as s, i (s)}
			{@const st = stateOf(i)}
			<li class="checkseq-row is-{st}">
				<span class="checkseq-ic">
					{#key st}
						{#if st === 'done'}
							<span in:scale={{ start: 0, duration: 450, easing: backOut }} style="display: inline-grid"><Check weight="bold" /></span>
						{:else if st === 'run'}
							<span class="spin" in:fade><CircleNotch weight="bold" /></span>
						{:else}
							<span class="dot" in:fade></span>
						{/if}
					{/key}
				</span>
				<span>{s}</span>
				<span class="checkseq-bar"></span>
			</li>
		{/each}
	</ul>
</div>
