<script lang="ts">
	import type { ChatCompletionRequestMessage } from 'openai';

	import {
		type SystemChatMessage,
		chatMessages,
		modelTemperature,
		systemMessages,
		addSystemMessage,
		userQuery
	} from '$lib/nanostores/messagesStores';

	let fileVar: FileList | null = null;
	export let disableUpload: Boolean = false;
	export let disableSave: Boolean = false;

	const handleFileUpload = (event: Event) => {
		const inputElement = event.target as HTMLInputElement;
		if (inputElement.files) {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (typeof e.target?.result === 'string') {
					try {
						const data: {
							modelTemperature: number;
							chatMessages: ChatCompletionRequestMessage[];
							systemMessages: SystemChatMessage[];
						} | null = JSON.parse(e.target.result);
						console.log('file uploaded:', data);
						// You can do anything you want with the parsed JSON data here.
						if (!!data?.modelTemperature) $modelTemperature = data?.modelTemperature;
						if (!!data?.chatMessages) $userQuery = data?.chatMessages[0].content || '';
						if (!!data?.systemMessages) {
							data?.systemMessages.forEach((systemMsg) => {
								addSystemMessage(systemMsg);
							});
						}
						alert('File has been uploaded and parsed successfully!');
					} catch (err) {
						console.error('Invalid JSON file', err);
					}
				}
			};
			reader.readAsText(inputElement.files[0]);
		}
	};

	const handleDownload = () => {
		const element = document.createElement('a');
		let submitChatMessage = [];
		let submitSystemMessage = [];

		for (const [key, value] of Object.entries($systemMessages)) {
			submitSystemMessage.push({ id: key, message: value?.message });
		}

		for (const [key, value] of Object.entries($chatMessages)) {
			submitChatMessage.push(value?.message);
		}

		const file = new Blob(
			[
				JSON.stringify({
					modelTemperature: $modelTemperature,
					systemMessages: submitSystemMessage,
					chatMessages: submitChatMessage
				})
			],
			{
				type: 'text/plain'
			}
		);
		element.href = URL.createObjectURL(file);
		element.download = 'conversation.json';
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	};
</script>

{#if !disableUpload}
	<!-- UPLOAD CONVERSATIONS -->
	<div class="card w-80 bg-neutral text-neutral-content">
		<div class="card-body items-center text-center">
			<h2 class="card-title">Upload previous Conversation</h2>
			<p>upload previous system prompts and conversations.</p>
			<div class="card-actions justify-end">
				<input
					class="file-input file-input-bordered file-input-primary w-full max-w-xs text-black"
					type="file"
					bind:files={fileVar}
					on:change={handleFileUpload}
					accept=".json"
				/>
			</div>
		</div>
	</div>
{/if}
{#if !disableSave}
	<!-- SAVE CONVERSATIONS  -->
	<div class="card w-64 bg-neutral text-neutral-content">
		<div class="card-body items-center text-center">
			<h2 class="card-title">Save Conversation</h2>
			<p>Download current system prompts and conversations.</p>
			<div class="card-actions justify-end">
				<button class="btn btn-primary" on:click={handleDownload}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
						/></svg
					>
					Download
				</button>
			</div>
		</div>
	</div>
{/if}
