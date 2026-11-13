<script>
	import { fade, fly, scale } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import HourglassMedium from 'phosphor-svelte/lib/HourglassMedium';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import Polygon from 'phosphor-svelte/lib/Polygon';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import UserCheck from 'phosphor-svelte/lib/UserCheck';
	import Warning from 'phosphor-svelte/lib/Warning';
	import { animate } from 'motion';
	import { EASE, pageTitle } from '#lib/site.svelte.js';
	import { once, prefersReduced, reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from '#lib/components/Btn.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import RevealWords from '#lib/components/RevealWords.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	// Placeholder records for the prototype. Swap for the real registry lookup.
	const SAMPLES = {
		'LA-2231-0457': { s: 'ok', label: 'Verified', title: 'Plot 14, Ajah Phase 2', owner: 'Adeyemi Holdings Ltd', area: '648 m²', where: 'Eti-Osa, Lagos', note: 'Title matches the survey plan. No encumbrances on record.', pos: [6.4698, 3.5852] },
		'OG-8810-0092': { s: 'wait', label: 'Pending', title: 'Block C, Lufasi Layout', owner: 'Transfer in progress', area: '450 m²', where: 'Abeokuta South, Ogun', note: 'Consent application filed. Wait for approval before you pay.', pos: [7.1475, 3.3619] },
		'FC-0045-1187': { s: 'bad', label: 'Disputed', title: 'Plot 902, Karsana', owner: 'Two claimants on record', area: '1,200 m²', where: 'Abuja Municipal, FCT', note: 'Competing certificates found. Do not send money.', pos: [9.0765, 7.3986] }
	};
	const ICON = { ok: SealCheck, wait: HourglassMedium, bad: Warning };
	const mapUrl = ([la, lo]) =>
		`https://www.openstreetmap.org/export/embed.html?bbox=${lo - 0.012},${la - 0.008},${lo + 0.012},${la + 0.008}&layer=mapnik&marker=${la},${lo}`;

	const STATES = [
		{ key: 'ok', label: 'Verified', what: 'The title matches the registry and the survey plan, and nothing is pending against it.', todo: 'You can pay, ideally through Cuid Cecure escrow.' },
		{ key: 'wait', label: 'Pending', what: 'A transfer, consent or registration is still being processed.', todo: 'Wait for approval. Do not release money until it clears.' },
		{ key: 'bad', label: 'Disputed', what: 'More than one claim, a court case or a mismatch with the survey was found.', todo: 'Do not send money. Ask the seller to resolve the dispute first.' }
	];
	const CHECKS = [
		[UserCheck, 'Who owns it', 'The registered holder and any gaps in the ownership chain.'],
		[Polygon, 'Where it sits', 'The parcel drawn on a live map, with streets around it.'],
		[Warning, 'What is wrong with it', 'Competing certificates, pending transfers and disputes.']
	];

	let value = $state('');
	let status = $state('idle'); // idle | loading | found | missing
	let error = $state('');
	let key = $state('');
	let pos = $state([6.4698, 3.5852]);
	const r = $derived(SAMPLES[key]);
	const Icon = $derived(r ? ICON[r.s] : null);

	function run(raw) {
		const k = raw.trim().toUpperCase();
		if (!k) return (error = 'Enter a Certificate of Occupancy or file number.');
		if (!/^[A-Z]{2}-\d{3,5}-\d{3,5}$/.test(k)) return (error = 'Use the format on your certificate, for example LA-2231-0457.');
		error = '';
		status = 'loading';
		key = k;
		setTimeout(() => {
			status = SAMPLES[k] ? 'found' : 'missing';
			if (SAMPLES[k]) pos = SAMPLES[k].pos;
		}, 900);
	}

	let active = $state('ok');
	const current = $derived(STATES.find((x) => x.key === active));
	const [send, receive] = crossfade({ duration: 400, easing: cubicOut });

	// The map opens from a smaller crop as it scrolls in.
	let map;
	$effect(() => {
		if (prefersReduced()) return void (map.style.clipPath = 'none');
		return once(map, () => animate(map, { clipPath: ['inset(10% 8% 10% 8% round 18px)', 'inset(0% 0% 0% 0% round 18px)'], opacity: [0, 1] }, { duration: 1.2, ease: EASE }));
	});
</script>

<svelte:head><title>{pageTitle('Verify a title')}</title></svelte:head>

<PageHero
	photo={photos.skyline}
	eyebrow="Cuid Verify"
	title="See the land before you pay."
	accent={['land']}
	lead="Property fraud wins when buyers skip checks. Look up any Certificate of Occupancy or file number and catch fake titles before you send money."
/>

<section class="section">
	<div class="wrap tool">
		<div class="card tool-panel" use:reveal>
			<form
				novalidate
				onsubmit={(e) => {
					e.preventDefault();
					run(value);
				}}
			>
				<div class="field" class:invalid={error}>
					<label for="co">C of O or file number</label>
					<input id="co" autocomplete="off" placeholder="LA-2231-0457" bind:value aria-describedby="co-help co-err" aria-invalid={!!error} />
					<span class="help" id="co-help">Found on the certificate or the registry receipt.</span>
					{#if error}<span id="co-err" class="err" role="alert" in:fly={{ y: -6, duration: 250 }}>{error}</span>{/if}
				</div>
				<Btn type="submit">{status === 'loading' ? 'Checking' : 'Check title'}</Btn>
				<div class="samples">
					<span>Try a sample:</span>
					{#each Object.entries(SAMPLES) as [k, v] (k)}
						<button
							type="button"
							onclick={() => {
								value = k;
								run(k);
							}}>{v.label}</button
						>
					{/each}
				</div>
			</form>

			<div class="result" aria-live="polite">
				{#key status + key}
					<div in:fly={{ y: 16, duration: 500, easing: cubicOut }}>
						{#if status === 'idle'}
							<p class="muted">Results appear here. The three samples are placeholder records for this prototype.</p>
						{:else if status === 'loading'}
							<div class="skel" style="width: 32%"></div>
							<div class="skel" style="width: 74%; height: 22px"></div>
							<div class="skel" style="width: 58%"></div>
							<div class="skel" style="width: 66%"></div>
						{:else if status === 'found' && r}
							<span class="chip chip-{r.s}" in:scale={{ start: 0.6, duration: 450, easing: backOut }}><Icon weight="fill" /> {r.label}</span>
							<h3 class="result-title">{r.title}</h3>
							<dl class="result-dl">
								{#each [['Reference', key], ['Owner', r.owner], ['Area', r.area], ['Location', r.where]] as [a, b], i (a)}
									<div in:fly={{ x: -10, duration: 400, delay: 80 + i * 60 }}><dt>{a}</dt><dd>{b}</dd></div>
								{/each}
							</dl>
							<p class="result-note">{r.note}</p>
						{:else if status === 'missing'}
							<span class="chip chip-wait">No record</span>
							<h3 class="result-title">We could not find {key}</h3>
							<p class="result-note">Check the number against your certificate. If it is right, ask the seller for the registry receipt before you pay anything.</p>
						{/if}
					</div>
				{/key}
			</div>
		</div>

		<div class="tool-map" bind:this={map} style="clip-path: inset(10% 8% 10% 8% round 18px)">
			{#key pos.join(',')}
				<iframe title="Parcel map" loading="lazy" src={mapUrl(pos)} in:fade={{ duration: 800 }}></iframe>
			{/key}
			<div class="tool-legend">
				<span class="chip chip-ok">Verified</span>
				<span class="chip chip-wait">Pending</span>
				<span class="chip chip-bad">Disputed</span>
			</div>
			<span class="tool-scan" aria-hidden="true"><MagnifyingGlass weight="bold" /></span>
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="Three results, three next moves." />
		<div class="card states" use:reveal>
			<div class="seg" role="tablist" aria-label="Check results">
				{#each STATES as x (x.key)}
					<button type="button" role="tab" aria-selected={active === x.key} class="seg-btn" onclick={() => (active = x.key)}>
						{#if active === x.key}<span class="seg-pill seg-{x.key}" in:receive={{ key: 'seg' }} out:send={{ key: 'seg' }}></span>{/if}
						<span class="seg-label">{x.label}</span>
					</button>
				{/each}
			</div>
			{#key current.key}
				<div class="states-body" role="tabpanel" in:fly={{ y: 14, duration: 400, easing: cubicOut }}>
					<div><h3>What it means</h3><p>{current.what}</p></div>
					<div><h3>What to do</h3><p>{current.todo}</p></div>
				</div>
			{/key}
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap sticky-split">
		<div class="sticky-col"><RevealWords text="What a check tells you." /></div>
		<ul class="rows big-rows">
			{#each CHECKS as [I, t, d], i (t)}
				<li class="row" use:reveal={{ delay: i }}>
					<span class="ic"><I weight="duotone" /></span>
					<span><b>{t}</b><span>{d}</span></span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<CtaBand photo={photos.lagoon} title="Checked it? Now pay safely." text="Hold the money in escrow until the title transfers." to="/secure" label="Secure a payment" />
