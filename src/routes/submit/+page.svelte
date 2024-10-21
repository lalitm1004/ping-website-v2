<script lang="ts">
    import { PUBLIC_URL } from '$env/static/public';
    import { browser } from '$app/environment';
    import type { Tables } from '$lib/types/supabase'
    import { majors, batches } from '$lib/data/onboardingData';
    import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import {onMount} from "svelte";

    export let data;
    $: ({ supabase, user } = data)

    interface IUserData {
        user: Tables<'user'>,
        submission: Tables<'submission'>[]
    }

    let userData: IUserData | null = null;

    // user inputs;
    let inputRollNumber: string = '';
    let inputName: string = '';
    let inputMajor: string = '';
    let inputBatch: number = 0;
    let validRollNumber: boolean;
    let validMajor: boolean;
    let validBatch: boolean;


    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }

    const getUserData = async () => {
        if (!user) return;

        const response = await fetch(`/api/user?userId=${user.id}`, {
            method: 'GET',

        })
        const json = await response.json();

        if (response.status === 200) {
            userData = json;
			console.log(userData?.user);
			inputRollNumber = userData?.user.roll_number || '';
			inputBatch = userData?.user.batch || 0;
			inputMajor = userData?.user.major || '';

        } else {
            userData = null;
            
        }
    }

    $: if (browser && user) {
        user, getUserData();
    }

    const postFormData = async () => {
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
			submission: fileContent,
			submission_time: new Date().toISOString()
        }

        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insertUserData),
        })
        const json = await response.json();

        if (response.status === 201) {
            userData = json
            
        }
    }

	onMount(() => {
		if (!user) {
			goto('/profile');
		}
		console.log(user);
	});

	let fileContent = '';
	let fileInput;

	async function handleFileUpload(event: any) {
		const file = event.target.files[0];
		if (file) {
			const text = await file.text();
			fileContent = text;
			console.log(fileContent);
		}
	}


</script>


<!-- Form UI -->
<div class="h-full w-full grid place-items-center">
	<div
		class={`absolute top-0 left-0 h-screen w-screen bg-neutral-900/60 grid place-items-center z-50`}
	>
		<div
			transition:slide
			class={`jetbrains-regular bg-neutral-950 flex flex-col px-6 py-6 rounded-xl`}
		>
			<div class={`flex flex-col`}>
				<p class={`text-2xl md:text-5xl`}>@ping --submission</p>
				<p class={`text-neutral-500 mt-1 md:text-md text-sm`}>Ready to submit?</p>
			</div>

			<div class={`flex flex-col gap-4 text-lg mt-4 md:mx-0 mx-2`}>
                <div class={`flex flex-row items-center gap-2`}>
					<p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
						--name
						
					</p>
					<input
						value={user?.user_metadata.name}
						class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm disabled:opacity-50`}
						disabled
					/>
				</div>
				<div class={`flex flex-row items-center gap-2`}>
					<p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
						--roll-number
						{#if validRollNumber === false}
							<span class={`text-red-600`}>*</span>
						{/if}
					</p>
					<input
						bind:value={inputRollNumber}
						class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm disabled:opacity-50`}
						disabled
					/>
				</div>

				<div class={`flex flex-row items-center gap-2`}>
					<p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
						--major
						{#if validMajor === false}
							<span class={`text-red-600`}>*</span>
						{/if}
					</p>
					<select
						bind:value={inputMajor}
						class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm disabled:opacity-50`}
						disabled
					>
						{#each majors as major (major.key)}
							<option value={major.name}>{major.name}</option>
						{/each}
					</select>
				</div>

				<div class={`flex flex-row items-center gap-2`}>
					<p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
						--batch
						{#if validBatch === false}
							<span class={`text-red-600`}>*</span>
						{/if}
					</p>
					<select
						bind:value={inputBatch}
						class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm disabled:opacity-50`}
						disabled
					>
						{#each batches as batch (batch.key)}
							<option value={batch.key}>{batch.name}</option>
						{/each}
					</select>
				</div>
                <div class={`flex flex-row items-center gap-2`}>
					<p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>
						--algorithm
						{#if validBatch === false}
							<span class={`text-red-600`}>*</span>
						{/if}
					</p>
					<input type="file" id="algorithm" name="algorithm" accept=".py" class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm`}
						   on:change={handleFileUpload}
						   bind:this={fileInput}
					/>
				</div>
			</div>

			<div class={`grid place-items-center mt-5`}>
				<button
					on:click={postFormData}
					class={`w-fit bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1px] rounded-2xl`}
				>
					<p
						class={`ubuntu-bol/d jetbrains-regular text-xl bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-3 py-2 rounded-2xl`}
						on:click={postFormData}
					>
						Submit
					</p>
				</button>
			</div>
		</div>
	</div>
</div>
