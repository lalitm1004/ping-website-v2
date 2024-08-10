<script lang="ts">
    import { onMount } from "svelte";

    let display: string = '';
    export let prevNumChars: number = 0;
    export let delayMs: number = 0;
    export let text: string;
    export let charDelayMs: number = 30;

    onMount(async () => {

        // Delay functions
        if (prevNumChars === 0) await new Promise(r => setTimeout(r, delayMs));
        else await new Promise(r => setTimeout(r, prevNumChars * charDelayMs + delayMs))

        let index = 0;
        const addChar = () => {
            if (index < text.length) {
                display += text[index];
                index++;
                setTimeout(addChar, charDelayMs);
            }
        }
        addChar();
    })

</script>

<p {...$$props}>{display}</p>