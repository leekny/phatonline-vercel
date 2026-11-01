# PHATONLINE - Vercel Container deployment (first attempt)

This folder is a deployment copy. It does not modify the original GitHub repository.

## Vercel settings
- Framework Preset: Other / Container (if shown), or let `vercel.json` select `container`.
- Root Directory: `./`
- Build Command: leave default / override disabled.
- Output Directory: leave default / override disabled.
- Install Command: leave default / override disabled.
- Deploy using the root `Dockerfile.vercel`.

## Important limitations of this first deployment
- Runtime data is written under `/tmp/phatonline-data`; it is temporary and may disappear when the container is recycled.
- Merit state, uploaded music, and TTS cache are not durable. A managed database and object storage are required for durable production use.
- ZeroTTS is installed into the image and downloads its model on first worker startup. Cold start and memory limits may prevent it from becoming ready on Vercel.
- TikTok Live auto-connect runs inside the HTTP container. Vercel may scale the container down after inactivity; this is not a guaranteed always-on worker.
- This is a best-effort first deployment, not a guarantee that every live feature works continuously.

## Environment variables
- `TIKTOK_USER`: optional TikTok username to auto-connect. If unset, existing default behavior is used.
- `NO_BROWSER=1`, `DATA_DIR`, and `PYTHON_BIN` are already set by the container image.
- Do not commit `.env`, access tokens, or secrets.
