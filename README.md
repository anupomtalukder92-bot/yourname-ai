# YourName AI — Free starter project

A responsive, multilingual AI-chat interface starter. It includes a chat UI, local chat history, language switching, and a demo response mode.

## Important: demo vs real AI
The default **Demo mode** does not call a real AI model. It is safe to run locally and demonstrates the user interface only. To produce real AI answers, connect a model through a server-side backend. Do not place secret API keys in `app.js` or any browser code.

## Files
- `index.html` — page structure
- `style.css` — responsive dark interface
- `app.js` — chat UI, local storage, translations, demo mode
- `worker/` — optional Cloudflare Workers AI backend example

## Run on your computer (Windows)
1. Download and extract the ZIP file.
2. Open the extracted folder.
3. Double-click `index.html` to open it in Firefox or Chrome.

For a local web server (optional):
1. Install Python from https://www.python.org/downloads/ if it is not installed.
2. Open Command Prompt in this folder.
3. Run: `py -m http.server 8000`
4. Open `http://localhost:8000`.

## Publish free (static demo)
1. Create a GitHub account.
2. Create a new repository and upload `index.html`, `style.css`, and `app.js`.
3. In repository Settings → Pages, enable deployment from the main branch/root.
4. GitHub Pages publishes the static demo. It does not run the optional backend by itself.

Cloudflare Pages is another static-hosting option. Free-plan limits and product availability can change.

## Add real AI (optional)
An example backend is in `worker/`. It is intended for Cloudflare Workers AI, and requires a Cloudflare account and setup. Review current model availability, free quota, and pricing before relying on it.

1. Create a Cloudflare Worker.
2. Bind a Workers AI binding named `AI` in the Worker settings/configuration.
3. Deploy the contents of `worker/worker.js` as the Worker.
4. In `app.js`, set `WORKER_API_URL` to your deployed Worker URL, then switch the model selector to Cloudflare mode. The endpoint is empty by default.
5. For a public launch, add authentication, rate limiting, abuse prevention, privacy controls, and server-side usage limits before sharing widely.

## Before launch
- Replace every `YourName AI` / `YourName` label with your chosen brand.
- Add a privacy policy and terms.
- Do not promise unlimited free AI.
- Chat history is stored in this browser's local storage. It is not synced between devices and can be cleared by the user.
- This starter is not an official OpenAI, xAI, or Google product.
