<!--
	Opening animation on every full page load.
	rise (letters rise out of masks as outlines) → fill (green liquid rises inside the letters,
	"trade real estate like water") → exit (the whole sheet lifts away to reveal the hero photo).
	Quicker on reloads in the same visit. A click, tap or any key skips ahead.
-->
<script>
	import { onMount, tick } from 'svelte';
	import { animate, stagger } from 'motion';
	import { EASE, EASE_IN_OUT } from '#lib/site.svelte.js';

	let { onreveal, ondone } = $props();
	const WORD = 'Cuiditi';
	const KEY = 'cuiditi-intro-seen';
	const TIMINGS = {
		full: { rise: 0.95, stagger: 0.06, fill: 1.5, hold: 260, exit: 1.05 },
		quick: { rise: 0.55, stagger: 0.03, fill: 0.7, hold: 80, exit: 0.8 }
	};
	let T = TIMINGS.full;
	let root, word, letters, fill, tag, line;
	let ready = $state(false);
	let exiting = false;

	async function exit() {
		if (exiting) return;
		exiting = true;
		try {
			sessionStorage.setItem(KEY, '1');
		} catch {}
		onreveal?.();
		animate(word, { y: -80, opacity: 0 }, { duration: T.exit * 0.8, ease: EASE_IN_OUT });
		animate(tag, { opacity: 0 }, { duration: 0.4 });
		await animate(root, { clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] }, { duration: T.exit, ease: EASE_IN_OUT }).finished;
		ondone?.();
	}

	onMount(() => {
		try {
			if (sessionStorage.getItem(KEY) === '1') T = TIMINGS.quick;
		} catch {}
		const onKey = () => exit();
		addEventListener('keydown', onKey);
		(async () => {
			// Wait for the webfont so the word doesn't jump mid-animation (never longer than 1.5s)
			await Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);
			ready = true;
			await tick();
			animate(line.firstElementChild, { scaleX: [0, 1] }, { duration: T.fill + T.rise + 0.4, ease: [0.4, 0, 0.2, 1] });
			animate(tag, { opacity: [0, 1], y: [10, 0] }, { duration: 0.6, delay: 0.5 });
			await animate(letters.querySelectorAll('.word-mask > span'), { y: ['115%', '0%'] }, { duration: T.rise, ease: EASE, delay: stagger(T.stagger) }).finished;
			if (exiting) return;
			await animate(fill, { clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] }, { duration: T.fill, ease: [0.65, 0, 0.35, 1] }).finished;
			if (exiting) return;
			await new Promise((r) => setTimeout(r, T.hold));
			exit();
		})();
		return () => removeEventListener('keydown', onKey);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<div class="intro" role="status" bind:this={root} onclick={exit}>
	<span class="sr-only">Loading Cuiditi</span>
	<div class="intro-word" aria-hidden="true" bind:this={word} style:visibility={ready ? 'visible' : 'hidden'}>
		<div class="intro-letters" bind:this={letters}>
			{#each WORD.split('') as c}<span class="word-mask"><span style="transform: translateY(115%)">{c}</span></span>{/each}
		</div>
		<div class="intro-fill" bind:this={fill} style="clip-path: inset(100% 0% 0% 0%)">{WORD}</div>
	</div>
	<p class="intro-tag" bind:this={tag} style="opacity: 0">Trade real estate like water</p>
	<span class="intro-line" aria-hidden="true" bind:this={line}><span style="transform: scaleX(0)"></span></span>
	<button
		type="button"
		class="intro-skip"
		onclick={(e) => {
			e.stopPropagation();
			exit();
		}}>Skip intro</button
	>
</div>
