/**
 * AI chat contract checklist
 *
 * This file is not loaded by apps/ai/index.html. Chat behavior belongs in the
 * declarative HTML and server contract, so this file intentionally contains no
 * runtime handlers, connection timers, request IDs, submit hooks, or credential
 * continuation logic.
 *
 * Confirmed server behavior:
 * - ai.user_message_id is the per-message lifecycle key; the server generates
 *   it when the request does not provide one and uses it for stop/cancel.
 * - Responses are routed to the requesting socket and identify both the
 *   conversation and user message; a separate stream_id is unnecessary.
 * - A conversation is created when ai.conversation_id is absent.
 * - The server persists and updates the user message through CRUD.
 * - The composer saves the textarea as ai-messages.content and sends it as
 *   ai.prompt. The visible send button runs save, send, reset.
 * - The selected conversation ID is saved and sent declaratively. Processing
 *   and credential responses populate the ID for a newly created conversation.
 * - Credential fields save the API record through CRUD, then send
 *   ai.credentials.complete with the waiting message and conversation IDs.
 *   Server AI rechecks the saved profile and resumes that message in its FIFO.
 *
 * Remaining contract gaps found during review:
 * - Stream and new-conversation ID listeners match by status only. Responses
 *   for concurrent conversations on this socket can cross the selected view
 *   or replace its composer conversation ID; socket-on-matches cannot currently
 *   read the selected conversation value declaratively.
 */
