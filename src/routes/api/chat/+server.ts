import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';

import { OPENAI_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { getTokens } from '$lib/tokenizer';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!OPENAI_KEY) throw new Error('No OpenAI key found. Set OPENAI_KEY environment variable.');

		const requestData = await request.json();

		if (!requestData)
			throw new Error('No request data found. Request data: ' + JSON.stringify(request));

		const reqSystemPrompts: ChatCompletionRequestMessage[] = requestData.system;
		const reqMessage: ChatCompletionRequestMessage[] = requestData.messages;

		if (!reqSystemPrompts) throw new Error('No system prompts found in the request data.');
		if (!reqMessage) throw new Error('No request message found in the request data.');

		let tokenCount = 0;

		reqSystemPrompts.forEach((prompt) => {
			const tokens = getTokens(prompt.content || '');
			tokenCount += tokens;
		});

		reqMessage.forEach((message) => {
			const tokens = getTokens(message.content || '');
			tokenCount += tokens;
		});

		const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${OPENAI_KEY}`
			},
			method: 'POST',
			body: JSON.stringify({
				input: reqMessage[reqMessage.length - 1].content
			})
		});
		const moderationData = await moderationRes.json();
		const [moderationResults] = moderationData.results;

		if (moderationResults.flagged) throw new Error('Message flagged by OpenAI');

		if (tokenCount >= 4000) throw new Error('Query too large. Token count: ' + tokenCount);

		const messages: ChatCompletionRequestMessage[] = [...reqSystemPrompts, ...reqMessage];

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: 'gpt-3.5-turbo-16k',
			messages,
			temperature: requestData.temperature / 100 || 0.9,
			stream: true
		};

		const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				'content-type': 'application/json',
				Authorization: `Bearer ${OPENAI_KEY}`
			},
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		});

		if (!chatResponse.ok) {
			const err = await chatResponse.json();
			throw new Error('Chat completion request error. Error: ' + JSON.stringify(err));
		}

		return new Response(chatResponse.body, {
			headers: {
				'content-type': 'text/event-stream'
			}
		});
	} catch (error) {
		let message = 'Unknown Error';
		if (error instanceof Error) message = error.message;
		console.error(message);
		return json(
			{
				error: 'There was an error processing your request',
				errorId: Date.now(),
				errorDetails: error
			},
			{ status: 500 }
		);
	}
};
