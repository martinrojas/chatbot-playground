import { chatMessages, systemMessages } from './messagesStores';

import { computed } from 'nanostores';
import { getTokens } from '../tokenizer';

export const tokenTotalCount = computed(
	[chatMessages, systemMessages],
	(chatMessages, systemMessages) => {
		let tokenCount: number = 0;

		for (const [key, value] of Object.entries(systemMessages)) {
			// console.log(`systemMessages ${key}: `, value?.message?.content);
			const token = getTokens(value?.message?.content || '');
			tokenCount += token;
		}
		for (const [key, value] of Object.entries(chatMessages)) {
			// console.log(`chatMessages ${key}: `, value?.message?.content);
			const token = getTokens(value?.message?.content || '');
			tokenCount += token;
		}

		return tokenCount;
	}
);
