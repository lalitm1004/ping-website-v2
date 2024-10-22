<script lang="ts">
  import { PUBLIC_URL } from "$env/static/public";
  import { browser } from "$app/environment";
  import type { Tables } from "$lib/types/database.types";
  import { majors, batches } from "$lib/data/onboardingData";
  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  $: ({ supabase, user } = data);

  interface IUserData {
    user: Tables<"fixuser">;
    submission: Tables<"submission">[];
  }

  let userData: IUserData | null = null;
  // user inputs;
  let fileText: string;
  let inputRollNumber: string = "";
  let inputName: string = "";
  let inputMajor: string = "";
  let inputBatch: number = 0;
  let validRollNumber: boolean;
  let validMajor: boolean;
  let validBatch: boolean;
  let submitted: boolean = false;

  let boarded: boolean;

  let fileContent = "";
  let fileInput: HTMLInputElement;

  const getUserData = async () => {
    if (!user) return;

    const response = await fetch(`/api/user?userId=${user.id}`, {
      method: "GET",
    });

    const json = await response.json();
    if (response.status === 200) {
      userData = json;
      inputBatch = userData?.user.batch || 0;
      inputMajor = userData?.user.major || "";
      inputRollNumber = userData?.user.roll_number || "";
    } else {
      goto("/profile");
      userData = null;
    }
  };

  $: if (browser && user) {
    user, getUserData();
  }

  let netid: string = "";
  let netiderror = false;
  const postFormData = async () => {
    if (!user) return;

    validRollNumber = inputRollNumber !== "";
    validMajor = inputMajor !== "";
    validBatch = inputBatch !== 0;

    if (!validRollNumber || !validMajor || !validBatch||!(fileInput.files && fileInput.files.length > 0) ) return;

    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const { data, error } = await supabase.storage
        .from("test") // Replace with your bucket name
        .upload(
          `uploads/${user?.user_metadata.email.toString().split("@")[0]}/${file.name}`,
          file
        );

      if (error) {
        console.error("Error uploading file:", error);
        return; // Exit if there's an error
      } else {
        console.log("File uploaded successfully:", data);
        fileContent = data.path; // Store the file path for submission
      }
    }

    const insertUserData = {
      id: user.id,
      name: user.user_metadata.name,
      email: user.email,
      roll_number: inputRollNumber,
      major: inputMajor,
      batch: inputBatch,
      submission: fileContent,
      submission_time: new Date().toISOString(),
    };

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(insertUserData),
    });
    const json = await response.json();
    userData = json;
    if (response.status === 201) {
      submitted = true;
    }
  };

  onMount(() => {
    if (!user) {
      goto("/profile");
    }
  });

  async function handleFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
    }
  }

  let showModal: boolean = false; // State to control modal visibility

  const handleSubmit = () => {
    showModal = true; // Show the modal on submit button click
  };
  let isSubmitting: boolean = false;
  const confirmSubmit = async () => {
    if (netid == userData!.user.email?.split("@")[0]) {
      isSubmitting = true;
      await postFormData(); // Call the original submit function
      showModal = false; // Hide the modal after submission
      netiderror = false;
      isSubmitting = false;  
    } else {
      netiderror = true;
    }

  };

  const cancelSubmit = () => {
    showModal = false; // Hide the modal if cancelled
  };
</script>

<!-- Form UI -->
{#if userData && !userData.user.submission}
  <div class="h-full w-full grid place-items-center">
    <div
      class={`absolute top-0 left-0 h-screen w-screen grid place-items-center z-30`}
    >
      <div
        transition:slide
        class={`jetbrains-regular bg-neutral-950 flex flex-col px-6 py-6 rounded-xl`}
      >
        <div class={`flex flex-col`}>
          <p class={`text-2xl md:text-5xl`}>@ping --submission</p>
          <p class={`text-neutral-500 mt-1 md:text-md text-sm`}>
            Ready to submit?
          </p>
        </div>

        <div class={`flex flex-col gap-4 text-lg mt-4 md:mx-0 mx-2`}>
          <div class={`flex flex-row items-center gap-2`}>
            <p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>--name</p>
            <input
              value={user?.user_metadata.name}
              class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm disabled:opacity-50`}
              disabled
            />
          </div>
          <div class={`flex flex-row items-center gap-2`}>
            <p class={`md:w-[165ps] w-[130px] md:text-md text-sm`}>--Net-ID</p>
            <input
              value={user?.user_metadata.email}
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
            </p>

            <input
              type="file"
              id="algorithm"
              name="algorithm"
              accept=".py"
              class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm`}
              on:change={handleFileUpload}
              bind:this={fileInput}
            />
          </div>
        </div>

        <div class={`grid place-items-center mt-5`}>
          <button
            on:click={handleSubmit}
            class={`w-fit bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1px] rounded-2xl`}
          >
            <p
              class={`ubuntu-bol/d jetbrains-regular text-xl bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-3 py-2 rounded-2xl`}
            >
              Submit
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
{:else if userData && !!userData.user.submission}
  <div class="h-full w-full grid place-items-center">
    <div
      class={`absolute top-0 left-0 h-screen w-screen grid place-items-center z-30`}
    >
      <div
        transition:slide
        class={`jetbrains-regular bg-neutral-950 flex flex-col px-6 py-6 rounded-xl`}
      >
        thank you for your submission!
      </div>
    </div>
  </div>
{/if}

{#if showModal}
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
  >
    <div
      class="bg-black p-6 rounded-lg border border-ping-orange-primary jetbrains-regular"
    >
      <h2 class="text-lg font-bold">confirm submission</h2>
      <p>are you sure you want to submit the form?</p>
      <p class="mb-4">enter your net-id and click confirm</p>
      <input
        type="text"
        bind:value={netid}
        class={`md:w-[300px] w-[150px] bg-neutral-900 rounded-lg px-2 py-2 text-sm focus:outline-none`}
      />
      {#if netiderror}
        <p class="mt-1 mb-4 text-sm text-red-600">net-id incorrect</p>
      {/if}
      <div class="mt-4">
        <button
          on:click={confirmSubmit}
          disabled={isSubmitting}
          class={`w-fit bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1px] rounded-2xl`}
        >
          <p
            class={`ubuntu-bold bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-3 py-2 rounded-2xl`}
          >
            Confirm
          </p>
        </button>
        <button
          on:click={cancelSubmit}
          class={`w-fit bg-gradient-to-r from-ping-pink to-ping-orange-primary py-[1px] px-[1px] rounded-2xl`}
        >
          <p
            class={`ubuntu-bold bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-900/95 px-3 py-2 rounded-2xl`}
          >
            Cancel
          </p>
        </button>
      </div>
    </div>
  </div>
{/if}
