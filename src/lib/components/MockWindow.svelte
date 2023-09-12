<script lang="ts">
	import { SSE } from 'sse.js';
	import {
		addMessage,
		chatMessages,
		modelTemperature,
		systemMessages,
		userQuery
	} from '$lib/nanostores/messagesStores';
	import ChatMessage from './ChatMessage.svelte';

	export let chatEndPoint: string = '/api/chat';

	let answer: string = '';
	let loading: boolean = false;

	const handleSubmit = async () => {
		loading = true;
		let submitSystemMessage = [];
		let submitChatMessage = [];

		addMessage({
			id: Math.random().toString(16).slice(2),
			message: { role: 'user', content: $userQuery }
		});

		for (const [key, value] of Object.entries($systemMessages)) {
			submitSystemMessage.push(value?.message);
		}
		for (const [key, value] of Object.entries($chatMessages)) {
			submitChatMessage.push(value?.message);
		}

		//log submitSystemMessage and submitChatMessage to console
		console.log('submitSystemMessage:', submitSystemMessage);
		console.log('submitChatMessage:', submitChatMessage);

		$userQuery = '';

		const eventSource = new SSE(chatEndPoint, {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({
				system: submitSystemMessage,
				messages: submitChatMessage,
				temperature: $modelTemperature
			})
		});

		eventSource.addEventListener('error', handleError);

		eventSource.addEventListener('message', (event) => {
			try {
				loading = false;
				if (event.data === '[DONE]') {
					addMessage({
						id: Math.random().toString(16).slice(2),
						message: { role: 'assistant', content: answer }
					});
					answer = '';
					return;
				}

				const completionResponse = JSON.parse(event.data);
				const [{ delta }] = completionResponse.choices;

				if (delta.content) {
					answer = (answer ?? '') + delta.content;
				}
			} catch (error) {
				handleError(error);
			}
		});

		eventSource.stream();
	};

	function handleError<T>(error: T) {
		loading = false;
		$userQuery = '';
		answer = '';
		console.log(error);
	}
</script>

<div class="mockup-window border border-base-300">
	<div class="flex justify-center px-4 py-10 border-t border-base-300">
		<div class="flex flex-col w-full items-center gap-2">
			<div
				class="min-h-[500px] h-full w-full bg-neutral rounded-md p-4 overflow-y-auto flex flex-col gap-4"
			>
				<div class="flex flex-col gap-2">
					{#if Object.values($chatMessages).length}
						{#each Object.values($chatMessages) as chatMessage}
							<ChatMessage
								type={chatMessage?.message?.role || 'user'}
								message={chatMessage?.message?.content || ''}
							/>
						{/each}
					{/if}
					{#if answer}
						<ChatMessage type="assistant" message={answer} />
					{/if}
					{#if loading}
						<ChatMessage type="assistant" message="Loading.." />
					{/if}
				</div>
			</div>
			<form
				class="flex w-full rounded-md gap-4 bg-neutral p-4"
				on:submit|preventDefault={() => handleSubmit()}
			>
				<textarea class="input input-bordered w-full h-20" bind:value={$userQuery} />
				<button type="submit" class="btn btn-accent"> Send </button>
			</form>
		</div>
	</div>
</div>
