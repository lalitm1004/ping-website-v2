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

    onMount(() =>    {
        const {
            data
        } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
        })

        return () => data.subscription.unsubscribe();
    })
</script>

<!-- <Navbar /> -->
<slot />
<!-- TODO: -->
<!-- <Footer /> -->