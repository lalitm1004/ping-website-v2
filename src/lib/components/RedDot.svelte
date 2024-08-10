<script lang="ts">
    import redDotSvg from '$lib/assets/redDot.svg';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    export let x: string | number = 0;
    export let y: string | number = 0;
    export let duration: number = 400;
    export let delay: number = 0;

    let show: boolean = false;
    onMount(() => {
        show = true;
    })
</script>

{#if (show)}
    <div in:fly={{ duration: duration, x: x, y: y, delay: delay }} id={`red-dot`} {...$$props}>
        <div class={`h-full aspect-square relative grid place-items-center -z-10`}>
            <div id={`red-dot-grad`} class={`absolute w-full h-full`}/>
            <img src={redDotSvg} alt={`Red Dot`}/>
        </div>
    </div>
{/if}

<style>
    #red-dot-grad {
        background: rgb(255, 52, 56);
        filter: blur(65px);
        border-radius: 200px;
    }
</style>