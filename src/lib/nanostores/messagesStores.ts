import { atom, map } from 'nanostores';

import type { ChatCompletionRequestMessage } from 'openai';

export const modelTemperature = atom(70);
export const userQuery = atom('');

/**
 *  SYSTEM MESSAGES STORE
 */

export type SystemChatMessage = {
	id: string;
	message: ChatCompletionRequestMessage;
};

export const systemMessages = map<Record<string, SystemChatMessage | undefined>>({});

export function addSystemMessage(message: SystemChatMessage) {
	systemMessages.setKey(message.id, message);
}

export function removeSystemMessage(id: string) {
	const existingEntry = systemMessages.get()[id];
	if (existingEntry) {
		systemMessages.setKey(id, undefined);
	}
}

/**
 *  CHAT MESSAGES STORE
 */

export type ChatMessage = {
	id: string;
	message: ChatCompletionRequestMessage;
};

export const chatMessages = map<Record<string, ChatMessage | undefined>>({});

export function addMessage(message: ChatMessage) {
	chatMessages.setKey(message.id, message);
}

export function removeMessage(id: string) {
	const existingEntry = chatMessages.get()[id];
	if (existingEntry) {
		chatMessages.setKey(id, undefined);
	}
}

export function clearMessages() {
	chatMessages.set({});
}
