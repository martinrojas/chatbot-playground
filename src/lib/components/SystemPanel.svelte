<script lang="ts">
	import {
		addSystemMessage,
		systemMessages,
		modelTemperature
	} from '$lib/nanostores/messagesStores';
	import IoPanel from './IOPanel.svelte';
	import SystemPrompts from './SystemPrompts.svelte';
	import TokenCalculator from './TokenCalculator.svelte';

	let queryPrompt: string = '';

	const handleAddPrompt = () => {
		addSystemMessage({
			id: Math.random().toString(16).slice(2),
			message: { role: 'system', content: queryPrompt }
		});
		queryPrompt = '';
	};
</script>

<div class="bg-base-300 rounded-md p-4 space-y-4">
	<div class="flex flex-col gap-2 text-neutral-content">
		{#if Object.values($systemMessages).length}
			{#each Object.values($systemMessages) as prompt}
				<SystemPrompts systemChat={prompt} />
			{/each}
		{/if}
	</div>
	<form
		class="flex flex-col w-full rounded-md gap-4 border-2 p-2"
		on:submit|preventDefault={() => handleAddPrompt()}
	>
		<textarea
			class="textarea text-gray-900"
			placeholder="System Prompts"
			bind:value={queryPrompt}
		/>
		<button type="submit" class="btn btn-accent"> Add </button>
	</form>
	<div class="flex flex-wrap gap-4">
		<TokenCalculator />
		<div class="card w-96 bg-base-100 shadow-xl">
			<div class="card-body">
				<p>
					Model temperature: <span class="font-medium text-lg">{$modelTemperature}</span>
				</p>
				<input
					type="range"
					min="0"
					max="100"
					bind:value={$modelTemperature}
					class="range range-accent"
				/>
			</div>
		</div>
		<IoPanel disableSave />
	</div>
</div>
