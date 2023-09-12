<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import SystemPanel from '$lib/components/SystemPanel.svelte';
	import MockWindow from '$lib/components/MockWindow.svelte';
</script>

<Head title="Chatbot Playground" />

<div class="grid grid-rows-2 gap-8">
	<SystemPanel />
	<MockWindow chatEndPoint="/api/chat" />
</div>
