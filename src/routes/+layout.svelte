<script>
	import '../app.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class=" container mx-auto">
	<div class="py-10">
		<div class="flex flex-col items-center mb-16">
			<h1 class="text-5xl font-bold w-full text-center">ChatGPT Chatbot Playground</h1>
			<p class="text-sm italic">Powered by OpenAI chatGPT - gpt-3.5-turbo</p>
			<!-- <div class="tabs">
				<a class="tab" href="/">Chat</a>
				<a class="tab" href="/validator">Validator</a>
			</div> -->
		</div>
		<slot />
	</div>
</div>
<footer class="footer footer-center p-4 bg-neutral text-neutral-content">
	<div>
		<p class="text-base">
			Copyright © 2023 - All right reserved by <a href="http://martinrojas.dev" target="_blank">
				Martin Rojas
			</a>
		</p>
	</div>
</footer>
