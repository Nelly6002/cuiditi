<!-- Sign in and sign up share this screen: a photo that zooms in, and a form whose fields arrive one by one. -->
<script>
	import { animate, stagger } from 'motion';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Eye from 'phosphor-svelte/lib/Eye';
	import EyeSlash from 'phosphor-svelte/lib/EyeSlash';
	import SealCheck from 'phosphor-svelte/lib/SealCheck';
	import { EASE, site } from '#lib/site.svelte.js';
	import { prefersReduced } from '#lib/motion.js';
	import { photos } from '#lib/data/photos.js';
	import Btn from './Btn.svelte';
	import RevealWords from './RevealWords.svelte';

	let { mode } = $props();
	const up = $derived(mode === 'signup');
	const photo = $derived(up ? photos.lagoon : photos.skyline);
	let vals = $state({ name: '', email: '', password: '' });
	let errs = $state({});
	let show = $state(false);
	let ok = $state(false);
	let card, img, sideText;
	let arrived = false;

	const fields = $derived([
		...(up ? [['name', 'Full name', 'text', 'name']] : []),
		['email', 'Email', 'email', 'email'],
		['password', 'Password', show ? 'text' : 'password', up ? 'new-password' : 'current-password']
	]);

	$effect(() => {
		if (!site.introDone || arrived) return;
		arrived = true;
		const items = card.querySelectorAll('[data-item]');
		if (prefersReduced()) {
			img.style.transform = 'none';
			[sideText, ...items].forEach((el) => (el.style.opacity = '1'));
			return;
		}
		animate(img, { scale: [1.25, 1] }, { duration: 2.4, ease: EASE });
		animate(sideText, { opacity: [0, 1], y: [14, 0] }, { duration: 0.8, ease: EASE, delay: 0.7 });
		animate(items, { opacity: [0, 1], y: [18, 0] }, { duration: 0.7, ease: EASE, delay: stagger(0.07, { startDelay: 0.3 }) });
	});

	function submit(e) {
		e.preventDefault();
		const next = {};
		if (up && vals.name.trim().length < 2) next.name = 'Enter your full name.';
		if (!/^\S+@\S+\.\S+$/.test(vals.email)) next.email = 'Enter a valid email address.';
		if (up ? vals.password.length < 8 : !vals.password) next.password = up ? 'Use at least 8 characters.' : 'Enter your password.';
		errs = next;
		ok = Object.keys(next).length === 0;
		if (!ok && !prefersReduced()) animate(card, { x: [0, -12, 12, -7, 7, 0] }, { duration: 0.45 });
	}
</script>

<section class="auth">
	<div class="auth-side graded">
		<img bind:this={img} src={photo.src(1600)} alt={photo.alt} style="transform: scale(1.25)" />
		<span class="auth-shade" aria-hidden="true"></span>
		<div class="auth-side-in">
			<RevealWords as="h2" text={up ? 'Start with ₦1,000.' : 'Welcome back.'} show={site.introDone} delay={2} />
			<p bind:this={sideText} style="opacity: 0">{up ? 'Verify, buy and trade property from one wallet.' : 'Your wallet and portfolio are where you left them.'}</p>
		</div>
	</div>
	<div class="auth-main">
		<div class="auth-card" bind:this={card}>
			<h1 data-item style="opacity: 0">{up ? 'Create your account' : 'Sign in'}</h1>
			<p class="muted auth-sub" data-item style="opacity: 0">{up ? 'It takes a couple of minutes.' : 'Pick up where you left off.'}</p>
			<form novalidate onsubmit={submit}>
				{#each fields as [k, label, type, ac] (k)}
					<div class="field" class:invalid={errs[k]} data-item style="opacity: 0">
						<label for={k}>{label}</label>
						<div class="input-wrap">
							<input id={k} {type} autocomplete={ac} bind:value={vals[k]} aria-invalid={!!errs[k]} aria-describedby={errs[k] ? `${k}-err` : k === 'password' && up ? 'pw-help' : undefined} />
							{#if k === 'password'}
								<button type="button" class="input-eye" aria-label={show ? 'Hide password' : 'Show password'} onclick={() => (show = !show)}>
									{#if show}<EyeSlash />{:else}<Eye />{/if}
								</button>
							{/if}
						</div>
						{#if k === 'password' && up && !errs.password}<span class="help" id="pw-help">At least 8 characters.</span>{/if}
						{#if errs[k]}<span class="err" id="{k}-err" role="alert" in:fly={{ y: -6, duration: 250 }}>{errs[k]}</span>{/if}
					</div>
				{/each}
				<div class="auth-submit" data-item style="opacity: 0"><Btn type="submit">{up ? 'Create account' : 'Sign in'}</Btn></div>
			</form>
			{#if ok}
				<div class="ok-box" in:fly={{ y: 12, duration: 400, easing: cubicOut }}><SealCheck weight="fill" /> The form is valid. Connect it to the real sign-in endpoint.</div>
			{/if}
			<p class="auth-switch" data-item style="opacity: 0">
				{up ? 'Already have an account? ' : 'New to Cuiditi? '}<a href={up ? '/signin' : '/signup'}>{up ? 'Sign in' : 'Create an account'}</a>
			</p>
		</div>
	</div>
</section>
