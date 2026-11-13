<script>
	import { fly, scale } from 'svelte/transition';
	import { backOut, cubicOut } from 'svelte/easing';
	import { animate } from 'motion';
	import LockKey from 'phosphor-svelte/lib/LockKey';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import ShieldCheck from 'phosphor-svelte/lib/ShieldCheck';
	import UserCheck from 'phosphor-svelte/lib/UserCheck';
	import { pageTitle } from '#lib/site.svelte.js';
	import { mix, onScroll, prefersReduced, range, reveal } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from '#lib/components/Btn.svelte';
	import Counter from '#lib/components/Counter.svelte';
	import CtaBand from '#lib/components/CtaBand.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import SecHead from '#lib/components/SecHead.svelte';

	const EMPTY = { role: 'send', purpose: 'Land purchase', amount: '', cond: 'The title transfer is registered' };
	let step = $state(0);
	let dir = $state(1);
	let form = $state({ ...EMPTY });
	let err = $state('');
	let done = $state(false);
	let amountField = $state();
	const amount = $derived(Number(String(form.amount).replace(/,/g, '') || 0).toLocaleString('en-NG'));

	const go = (n) => {
		dir = n > step ? 1 : -1;
		step = n;
	};
	function next() {
		if (step === 1) {
			const n = Number(String(form.amount).replace(/,/g, ''));
			if (!form.amount || Number.isNaN(n) || n < 1000) {
				err = 'Enter an amount of ₦1,000 or more.';
				if (!prefersReduced()) animate(amountField, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.45 });
				return;
			}
			err = '';
		}
		go(step + 1);
	}
	function restart() {
		done = false;
		form = { ...EMPTY };
		go(0);
	}

	const RELEASE = [
		[LockKey, 'Lock', 'Your money is held by Cuiditi, never by the other party.'],
		[UserCheck, 'Verify', "We confirm the beneficiary's details so accounts cannot be switched mid deal."],
		[ShieldCheck, 'Release', 'Funds move only when the conditions you set are met.']
	];

	// The line between the three stages fills as you scroll, and each stage lights up as the line reaches it.
	let timeline, fill;
	let lits = [];
	$effect(() => {
		const apply = (p) => {
			fill.style.transform = innerWidth <= 760 ? `scaleY(${p})` : `scaleX(${p})`;
			lits.forEach((el, i) => {
				const at = i / (RELEASE.length - 1);
				const t = range(p, Math.max(at - 0.05, 0), at + 0.001);
				el.style.opacity = String(t);
				el.parentElement.style.transform = `scale(${mix(0.85, 1, t)})`;
			});
		};
		if (prefersReduced()) return apply(1);
		return onScroll(apply, timeline, ['start 75%', 'end 55%']);
	});
</script>

<svelte:head><title>{pageTitle('Secure a payment')}</title></svelte:head>

<PageHero
	photo={photos.bridge}
	eyebrow="Cuid Cecure"
	title="Pay into escrow, not a stranger's account."
	accent={['escrow,']}
	lead="Cuid Cecure locks your money with Cuiditi until the beneficiary is verified and your release conditions are met."
/>

<section class="section">
	<div class="wrap split split-top">
		<div>
			<div class="big-stat" use:reveal><Counter to={100} prefix="₦" suffix="B+" /></div>
			<p class="lead" use:reveal={{ delay: 1 }}>
				The EFCC reports over ₦100 billion lost to property fraud in Nigeria each year. Most of it leaves through a bank account that was switched mid deal.
			</p>
		</div>

		<div class="card stepper" use:reveal={{ delay: 1 }}>
			<div class="stepper-bar" aria-hidden="true">
				{#each [0, 1, 2] as i (i)}<span><span style="transform: scaleX({done || step >= i ? 1 : 0})"></span></span>{/each}
			</div>
			<p class="eyebrow">{done ? 'Done' : `Step ${step + 1} of 3`}</p>
			<div class="stepper-body">
				{#key done ? 'done' : step}
					<div in:fly={{ x: dir * 60, duration: 400, easing: cubicOut }}>
						{#if done}
							<div class="stepper-done">
								<span class="done-ic" in:scale={{ start: 0, duration: 600, delay: 100, easing: backOut }}><SealCheck weight="fill" /></span>
								<h3>Your payment is ready to lock.</h3>
								<p class="muted">In the live product the other party now gets a link to verify their details and accept your terms.</p>
								<Btn variant="quiet" onclick={restart}>Start another</Btn>
							</div>
						{:else if step === 0}
							<h3 class="stepper-q">Are you sending money or expecting to receive it?</h3>
							<div class="choice" role="radiogroup" aria-label="Your role">
								{#each [['send', 'I am sending money', 'Protect a payment for land, rent or a build.'], ['receive', 'I will receive funds', 'Share terms and let the other party deposit safely.']] as [v, t, d] (v)}
									<label class:on={form.role === v}>
										<input type="radio" name="role" value={v} bind:group={form.role} />
										<span><b>{t}</b><span>{d}</span></span>
									</label>
								{/each}
							</div>
						{:else if step === 1}
							<h3 class="stepper-q">Describe the payment</h3>
							<div class="field">
								<label for="purpose">What is it for?</label>
								<select id="purpose" bind:value={form.purpose}>
									<option>Land purchase</option>
									<option>Rent</option>
									<option>Building work</option>
								</select>
							</div>
							<div class="field" class:invalid={err} bind:this={amountField}>
								<label for="amount">Amount (₦)</label>
								<input id="amount" inputmode="numeric" placeholder="2,500,000" bind:value={form.amount} aria-invalid={!!err} aria-describedby="amount-err" />
								{#if err}<span class="err" id="amount-err" role="alert">{err}</span>{/if}
							</div>
							<div class="field">
								<label for="cond">Release the funds when</label>
								<select id="cond" bind:value={form.cond}>
									<option>The title transfer is registered</option>
									<option>The keys are handed over</option>
									<option>The work is signed off</option>
								</select>
							</div>
						{:else}
							<h3 class="stepper-q">Review and lock</h3>
							<dl class="review">
								<dt>Role</dt><dd>{form.role === 'send' ? 'You are sending' : 'You are receiving'}</dd>
								<dt>Purpose</dt><dd>{form.purpose}</dd>
								<dt>Amount</dt><dd class="tnum">₦{amount}</dd>
								<dt>Release</dt><dd>{form.cond}</dd>
							</dl>
						{/if}
					</div>
				{/key}
			</div>
			{#if !done}
				<div class="stepper-actions">
					{#if step > 0}<button type="button" class="btn btn-quiet" onclick={() => go(step - 1)}>Back</button>{/if}
					{#if step < 2}<Btn onclick={next}>Continue</Btn>{:else}<Btn onclick={() => (done = true)}>Lock payment</Btn>{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

<section class="section section-tight">
	<div class="wrap">
		<SecHead title="How release works." />
		<div bind:this={timeline} class="timeline">
			<div class="timeline-line" aria-hidden="true"><span bind:this={fill} style="transform: scaleX(0)"></span></div>
			{#each RELEASE as [I, t, d], i (t)}
				<div class="tl-step">
					<span class="tl-node" style="transform: scale(0.85)">
						<I weight="duotone" />
						<span class="tl-node-lit" bind:this={lits[i]} style="opacity: 0"><I weight="fill" /></span>
					</span>
					<h3>{t}</h3>
					<p>{d}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<CtaBand photo={photos.island} title="Protect your next payment." text="Free to start. You only pay when you lock funds." />
