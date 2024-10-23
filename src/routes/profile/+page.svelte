<svelte:head>
    <title>@ping --profile</title>
</svelte:head>

<script lang="ts">
    import { PUBLIC_URL } from '$env/static/public';
    import { browser } from '$app/environment';
    import type { Tables } from '$lib/types/supabase'
    import { majors, batches } from '$lib/data/onboardingData';
    import { slide } from 'svelte/transition';

    export let data;
    $: ({ supabase, user } = data)

    interface IUserData {
        user: Tables<'user'>,
        submission: Tables<'submission'>[]
    }

    let userData: IUserData | null = null;
    let onboard: boolean = true;

    // user inputs;
    let inputRollNumber: string = '';
    let inputMajor: string = '';
    let inputBatch: number = 0;
    let validRollNumber: boolean;
    let validMajor: boolean;
    let validBatch: boolean;

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `https://ping-gdsc.vercel.app/profile`,
                scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'
            }
        })
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }

    const getUserData = async () => {
        if (!user) return;
        console.log(user)

        const response = await fetch(`/api/user?userId=${user.id}`, {
            method: 'GET',

        })
        const json = await response.json();
        if (response.status === 200) {
            userData = json;
        } else {
            userData = null;
            onboard = false;
        }
    }

    $: if (browser && user) {
        user, getUserData();
        console.log("user",user)
    }

    const postUserData = async () => {
        if (!user) return;

        validRollNumber = inputRollNumber !== '';
        validMajor = inputMajor !== '';
        validBatch = inputBatch !== 0

        if (!validRollNumber || !validMajor || !validBatch) return;

        const insertUserData = {
            id: user.id,
            name: user.user_metadata.name,
            email: user.email,
            roll_number: inputRollNumber,
            major: inputMajor,
            batch: inputBatch,
        }

        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insertUserData),
        })
        const json = await response.json();
        console.log(json)
        console.log(response)
        if (response.status === 201) {
            userData = json
            onboard = true;
        }
    }
</script>

{#if (user)}

    <!-- Onboarding -->
    {#if (!onboard)}
        <div class={`absolute top-0 left-0 h-screen w-screen bg-neutral-900/60 grid place-items-center z-50`}>
            <div transition:slide class={`jetbrains-regular bg-neutral-950 flex flex-col px-6 py-6 rounded-xl`}>
                <div class={`flex flex-col`}>
                    <p class={`text-2xl md:text-5xl`}>@ping --onboarding</p>
                    <p class={`text-neutral-500 mt-1 md:text-md text-sm`}>Almost there!</p>
                </div>

                <div class={`flex flex-col gap-4 text-lg mt-4 md:mx-0 mx-2`}>
                    <div class={`flex flex-row items-center gap-2`}>
                        <p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
                            --roll-number
                            {#if (validRollNumber === false)}
                                <span class={`text-red-600`}>*</span>
                            {/if}
                        </p>
                        <input bind:value={inputRollNumber} class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm`}/>
                    </div>

                    <div class={`flex flex-row items-center gap-2`}>
                        <p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
                            --major
                            {#if (validMajor === false)}
                                <span class={`text-red-600`}>*</span>
                            {/if}
                        </p>
                        <select bind:value={inputMajor} class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm`}>
                            {#each majors as major (major.key)}
                                <option value={major.name}>{major.name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class={`flex flex-row items-center gap-2`}>
                        <p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
                            --batch
                            {#if (validBatch === false)}
                                <span class={`text-red-600`}>*</span>
                            {/if}
                        </p>
                        <select bind:value={inputBatch} class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm`}>
                            {#each batches as batch (batch.key)}
                                <option value={batch.key}>{batch.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class={`grid place-items-center mt-5`}>
                    <button on:click={postUserData} class={`w-fit bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1px] rounded-2xl`}>
                        <p class={`ubuntu-bol/d jetbrains-regular text-xl bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-3 py-2 rounded-2xl`}>
                            Submit
                        </p>
                    </button>
                </div>

                <div class="text-sm text-zinc-600">
                    <div>Not {user.user_metadata.email.split("@")[0]}?</div>
                    <button on:click={handleSignOut} class="hover:underline hover:text-zinc-300">sign out</button>
                </div>
            </div>
        </div>
        {:else}
        <div class="h-screen w-screen grid place-items-center">
            <div class="bg-black/30 rounded-2xl border border-black/95 pt-8 px-8 pb-4">
                <div>
                    Logged in as: {user.user_metadata.full_name}
                </div>
                <div>
                    Net-ID: {user.user_metadata.email.split("@")[0]}
                </div>

                <button on:click={handleSignOut} class="bg-black py-2 px-4 rounded-lg mt-9">sign out</button>
            </div>
        </div>
    {/if}



    <!-- Main content -->


    <!-- Test button -->
    <!-- <button on:click={() => onboard = !onboard} class={`absolute bottom-4 right-0 z-50`}>onboard</button> -->
{:else}
    <div class={`min-h-screen min-w-screen flex flex-col justify-center items-center`}>
        <p class={`ubuntu-bold text-7xl mb-4`}>You up?</p>

        <button on:click={handleSignIn} class={`bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1.5px] rounded-2xl`}>
            <p class={`ubuntu-bol/d jetbrains-regular text-5xl bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-6 py-4 rounded-2xl`}>
                Sign in
            </p>
        </button>

        <p class={`text-md text-neutral-500`}>using your SNU email</p>
    </div>
{/if}
