<!-- Sits clear over the hero photo, turns to frosted glass once you scroll, hides while you scroll down. -->
<script>
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { crossfade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import List from 'phosphor-svelte/lib/List';
	import X from 'phosphor-svelte/lib/X';
	import { site } from '#lib/site.svelte.js';
	import { onScroll, wipe } from '#lib/motion.js';
	import { MAIN, MORE } from '#lib/data/content.js';
	import Logo from './Logo.svelte';
	import Btn from './Btn.svelte';

	let { hidden = false } = $props();
	let solid = $state(false);
	let away = $state(false);
	let open = $state(false);
	let more = $state(false);
	const path = $derived(page.url.pathname);
	const moreActive = $derived(MORE.some(([to]) => path === to));
	const shown = $derived(!(hidden || (away && !open && !more)));
	const [send, receive] = crossfade({ duration: 450, easing: cubicOut });

	$effect(() => {
		let last = 0;
		return onScroll((_, info) => {
			const y = info.y.current;
			solid = y > 40;
			away = y > 420 && y > last;
			last = y;
		});
	});

	// Close the menus whenever a navigation lands.
	afterNavigate(() => {
		open = false;
		more = false;
	});
	const close = () => {
		open = false;
		more = false;
	};

	// The layout owns Lenis and the scroll lock; it reads this flag.
	$effect(() => {
		site.menuOpen = open;
	});
</script>

<header class="hdr" class:is-solid={solid && !open} class:is-open={open} style:transform={shown ? 'translateY(0%)' : 'translateY(-110%)'}>
	<div class="wrap hdr-in">
		<Logo />
		<nav aria-label="Main" class="hdr-nav-wrap">
			<ul class="hdr-nav">
				{#each MAIN as [to, label] (to)}
					<li>
						<a href={to} class="hdr-link" class:active={path === to} aria-current={path === to ? 'page' : undefined}>
							{label}
							{#if path === to}<span class="hdr-active" in:receive={{ key: 'nav' }} out:send={{ key: 'nav' }}></span>{/if}
						</a>
					</li>
				{/each}
				<li class="hdr-more" onmouseenter={() => (more = true)} onmouseleave={() => (more = false)}>
					<button type="button" class="hdr-link" aria-expanded={more} aria-controls="more-menu" onclick={() => (more = !more)}>
						More <CaretDown weight="bold" class={more ? 'flip' : ''} aria-hidden="true" />
						{#if moreActive}<span class="hdr-active" in:receive={{ key: 'nav' }} out:send={{ key: 'nav' }}></span>{/if}
					</button>
					{#if more}
						<div id="more-menu" class="hdr-drop" transition:fly={{ y: -10, duration: 250, easing: cubicOut }}>
							{#each MORE as [to, label] (to)}
								<a href={to} class="hdr-drop-link" class:active={path === to} onclick={close}>{label}</a>
							{/each}
						</div>
					{/if}
				</li>
			</ul>
		</nav>
		<div class="hdr-cta">
			<a href="/signin" class="hdr-link hide-md" class:active={path === '/signin'}>Sign in</a>
			<span class="hide-sm"><Btn to="/signup" small>Get started</Btn></span>
			<button type="button" class="hdr-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onclick={() => (open = !open)}>
				{#if open}<X weight="bold" aria-hidden="true" />{:else}<List weight="bold" aria-hidden="true" />{/if}
			</button>
		</div>
	</div>
</header>

{#if open}
	<div id="mobile-menu" class="mmenu" transition:wipe>
		<ul class="mmenu-list">
			{#each [...MAIN, ...MORE, ['/signin', 'Sign in']] as [to, label], i (to)}
				<li class="word-mask">
					<span in:fly={{ y: 48, duration: 700, delay: 250 + i * 50, easing: cubicOut }}>
						<a href={to} class="mmenu-link" class:active={path === to} onclick={close}>{label}</a>
					</span>
				</li>
			{/each}
		</ul>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div in:fly={{ y: 20, duration: 600, delay: 700 }} onclick={close}><Btn to="/signup">Get started</Btn></div>
	</div>
{/if}
