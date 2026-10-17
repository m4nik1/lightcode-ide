# Novus web

The shared Novus React UI lives here. `apps/novus` contains the Electron shell
and builds this same frontend with its Forge renderer configuration.

From the repository root, run these in separate terminals:

```sh
npm run server
npm run web
```

Open http://127.0.0.1:5175. The local server is required for projects, files,
and AI chat. In a browser, **Add project** asks for an absolute folder path on
the server's machine; Electron uses its native folder picker.

```sh
npm run web:build
npm run web:preview
```

Both development and preview proxy `/trpc` to the local server on port 2024.
When serving `dist` elsewhere, configure the same reverse proxy, or set
`VITE_API_URL` at build time to a server URL that permits the site's origin.
Use `npm run novus` to launch the Electron version, which starts its own server.
