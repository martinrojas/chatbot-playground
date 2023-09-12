<script lang="ts">
	import type { ChatCompletionRequestMessage } from "openai";
	import SvelteMarkdown from "svelte-markdown";
	import { removeSystemMessage } from "$lib/nanostores/messagesStores";

	interface SystemChatMessage {
		id: string;
		message: ChatCompletionRequestMessage;
	}

	export let systemChat: SystemChatMessage | undefined;
</script>

<div
	class="p-4 bg-base-200 text-base-content rounded-md flex justify-between items-center gap-4 prose"
>
	<div>
		<span class="font-semibold capitalize">{systemChat?.message.role}:</span>
		<SvelteMarkdown source={systemChat?.message.content} />
	</div>
	<button
		class="btn btn-square btn-outline"
		on:click={() => removeSystemMessage(systemChat?.id || "")}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/></svg
		>
	</button>
</div>
