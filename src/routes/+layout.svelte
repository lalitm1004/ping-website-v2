<script lang="ts">
    // Style imports
    import '../styles/globals.css'
    import '../styles/fonts.css'

    import { onMount } from 'svelte';
    import { invalidate } from '$app/navigation';

    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';

    export let data;
    $: ({ session, supabase} = data);


    let showNavbar = false;

    
    const checkTime = () => {
        const targetDate = new Date('2024-10-22T18:55:00'); // 6 PM on 23/10/2024
        showNavbar = new Date() > targetDate;
    };
    onMount(() =>    {
        const {
            data
        } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        })
        checkTime()
        let interval:NodeJS.Timeout;
        if (!showNavbar){
            interval = setInterval(checkTime, 1000);
        }
        

        return () => {
            data.subscription.unsubscribe()
            clearInterval(interval)
        };
    })

    
</script>
{#if showNavbar}
<Navbar />
{/if}
<slot />
<!-- TODO: -->
<!-- <Footer /> -->