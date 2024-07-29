<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { slide } from 'svelte/transition';

    let isMobile: boolean = false;
    onMount(() => {
        isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
    })

    const rotateArrow = () => {
        let currentRotation: any = menuButton.style.transform.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
        if (currentRotation === '') currentRotation = '0';
        currentRotation = parseFloat(currentRotation);
        currentRotation = currentRotation % 360;
        menuButton.animate([
            { transform: `rotate(${currentRotation}deg)` },
            { transform: `rotate(${currentRotation + 180}deg)` },
        ], {
            duration: 100
        });
        menuButton.style.transform = `rotate(${currentRotation + 180}deg)`;
    }
    $: if (menuButton) {
        isSheetOpen, rotateArrow();
    }

    let isSheetOpen: boolean = false;
    let menuButton: HTMLButtonElement;
</script>

{#if (isMobile)}
    <nav class={`fixed -translate-y-[0.2rem] top-2 left-1/2 -translate-x-1/2 flex flex-col w-[90%] bg-neutral-950/80 backdrop-blur-sm px-2 pt-2 pb-3 rounded-3xl z-40`}>
        <div class={`w-full flex justify-between`}>
            <a class={`jetbrains-regular h-[50px] text-5xl bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent`} href="/" on:click={() => isSheetOpen = false}>@</a>

            <button on:click={() => isSheetOpen = !isSheetOpen} bind:this={menuButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up">
                    <path d="m18 15-6-6-6 6"/>
                </svg>
            </button>
        </div>

        {#if (isSheetOpen)}
            <div transition:slide class={`w-full flex flex-col justify-center items-center ubuntu-light text-xl mt-10`}>
                <a class={`h-[50px] ${$page.url.pathname === '/profile' && 'bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent ubuntu-bold'}`} href="/profile" on:click={() => isSheetOpen = !isSheetOpen}>Profile</a>
                <a class={`h-[50px] ${$page.url.pathname === '/leaderboards' && 'bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent ubuntu-bold'}`} href="/leaderboards" on:click={() => isSheetOpen = !isSheetOpen}>Leaderboards</a>
                <a class={`h-[50px] ${$page.url.pathname === '/history' && 'bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent ubuntu-bold'}`} href="/history" on:click={() => isSheetOpen = !isSheetOpen}>History</a>
                <a class={`h-[50px] ${$page.url.pathname === '/about' && 'bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent ubuntu-bold'}`} href="/about" on:click={() => isSheetOpen = !isSheetOpen}>About</a>
            </div>
        {/if}
    </nav>
{:else}
    <nav class={`fixed h-[60px] top-4 left-1/2 -translate-x-1/2 flex justify-between items-center gap-4 bg-neutral-950/95 px-4 rounded-3xl z-40`}>
        <a class={`jetbrains-regular h-[50px] -translate-y-[0.2rem] text-5xl bg-gradient-to-r from-ping-orange-primary to-ping-red bg-clip-text text-transparent`} href="/">@</a>

        <div class={`h-[40px] flex gap-2 ubuntu-light text-sm`}>
            <a class={`h-full px-6 rounded-full grid place-items-center backdrop-blur-sm transition-all duration-300 border-2 ${$page.url.pathname === '/profile' ? 'border-neutral-400' : 'border-neutral-800 hover:border-neutral-600'}`} href="/profile">Profile</a>
            <a class={`h-full px-6 rounded-full grid place-items-center backdrop-blur-sm transition-all duration-300 border-2 ${$page.url.pathname === '/leaderboards' ? 'border-neutral-400' : 'border-neutral-800 hover:border-neutral-600'}`} href="/leaderboards">Leaderboards</a>
            <a class={`h-full px-6 rounded-full grid place-items-center backdrop-blur-sm transition-all duration-300 border-2 ${$page.url.pathname === '/history' ? 'border-neutral-400' : 'border-neutral-800 hover:border-neutral-600'}`} href="/history">History</a>
            <a class={`h-full px-6 rounded-full grid place-items-center backdrop-blur-sm transition-all duration-300 border-2 ${$page.url.pathname === '/about' ? 'border-neutral-400' : 'border-neutral-800 hover:border-neutral-600'}`} href="/about">About</a>
        </div>
    </nav>
{/if}