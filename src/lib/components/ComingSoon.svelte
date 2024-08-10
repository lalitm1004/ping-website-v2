<script lang="ts">
    import StreamText from "./StreamText.svelte";
    import trophySvg from '$lib/assets/trophy.svg';
    import RedDot from "./RedDot.svelte";
    import { onMount } from "svelte";
    import { fly, slide } from "svelte/transition";

    let show: Boolean = false;
    onMount(() => {
        show = true;
    })
</script>

{#if (show)}
    <div class={`relative h-full w-full px-2 py-2`}>
        <div class={`h-full w-full flex flex-col items-center gap-4 jetbrains-regular md:mt-20 md:pr-[75vh]`}>
            <StreamText charDelayMs={40} text={`@ping`} class={`md:h-[150px] h-[80px] md:text-9xl text-7xl mt-20 bg-gradient-to-r from-ping-red to-ping-orange-primary bg-clip-text text-transparent`}/>
            <StreamText delayMs={200} prevNumChars={5} text={`build, have fun.`} class={`md:text-5xl text-3xl tracking-tighter`}/>
            <StreamText delayMs={400} prevNumChars={21} text={`Coming Soon`} class={`md:text-3xl text-2xl`}/>
        </div>

        <img in:fly={{ delay: 800, y: '100%', duration: 1000}} class={`absolute -bottom-[10%] md:ml-0 left-1/2 md:-translate-x-0 -translate-x-1/2 md:w-[700px] w-[1400px] aspect-square`} src={trophySvg} alt={`Trophy`}/>
        <RedDot y={'1000%'} duration={1000} class={`absolute h-[100px] aspect-square md:top-[30%] top-[43%] md:left-[50%] left-2`}/>
        <RedDot y={'1000%'} duration={1000} class={`absolute h-[80px] aspect-ssquare md:top-[54%] top-[58%] md:right-40 right-2`}/>
        <RedDot y={'1000%'} duration={1000} class={`absolute h-[80px] aspect-square bottom-4 md:left-40 left-6`}/>

        <!-- Desktop -->
        <RedDot y={'1000%'} duration={1000} class={`md:flex hidden absolute h-[100px] aspect-square bottom-2 left-1/2`}/>
        <RedDot y={'1000%'} duration={1000} class={`md:flex hidden absolute h-[80px] aspect-square bottom-4 right-6`}/>
        <RedDot y={'1000%'} duration={1000} class={`md:flex hidden absolute h-[120px] aspect-square bottom-[34%] left-10`}/>
    </div>
{/if}