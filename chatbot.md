# Chatbot

- Call `POST ${NEXT_PUBLIC_FASTAPI_URL}/chat/stream`.
- Show the chat button only when the user has an active signed-in Cognito session.
- This feature is for logged-in users only; never send an unauthenticated chat request.
- Send the Cognito access token as a bearer token and the user's message in the request body.
- The endpoint streams its response as server-sent events (SSE); read and process the response stream incrementally.
- Refer to the chatbot endpoint in the `sf-web-api` repo for request and event details.
