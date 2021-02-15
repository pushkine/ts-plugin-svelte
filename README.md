# ts-plugin-svelte

Don't actually use this yet, it's just a proof of concept for now. Everything breaks past the 5 seconds demo 😁

## Get Started

Clone the repository, run yarn install, yarn build and yarn link

Open another repository (preferrably a new, empty one) and run `yarn link "svelte-ts-plugin"`

Create a `tsconfig.json` file with `"plugins" : [{"name": "svelte-ts-plugin"}]` and `"jsx": "preserve"` in `compilerOptions`

Run the "reload window" command (`F1 > "Developer: Reload Window"`), the plugin should be enabled.

You can see TS Server logs by using the `Typescript: Open TS Server Logs` command while viewing a .ts file

If you're going to play with this I recommend installing the "TS Server Debug" extension, it adds a command that restarts the TS server with debugging enabled, then run the `Debug: Attach to Node process` command and type in the port the extension gave you

Note that you cannot use a dev branch of typescript with linked modules, so once in a typescript file make sure to click at the version number at the right of "Typescript" on the bottom right > Select Typescript Version > Use Workspace version
