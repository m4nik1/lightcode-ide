# Novus web

The shared Novus React UI lives here. `apps/novus` contains the Electron shell
and builds this same frontend with its Forge renderer configuration.

From the repository root:

```sh
npm run web
```

This starts the local server (port 2024) alongside Vite. Open
http://127.0.0.1:5175. The server is required for projects, files, and AI
chat. Set `NOVUS_WEB_NO_SERVER=1` to reuse a server you started yourself with
`npm run server`. In a browser, **Add project** opens a folder browser for the
server's machine; Electron uses its native folder picker.

```sh
npm run web:build
npm run web:preview
```

Both development and preview proxy `/trpc` to the local server on port 2024.
When serving `dist` elsewhere, configure the same reverse proxy, or set
`VITE_API_URL` at build time to a server URL that permits the site's origin.
Use `npm run novus` to launch the Electron version, which starts its own server.
