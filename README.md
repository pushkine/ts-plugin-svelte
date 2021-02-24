# ts-plugin-svelte

Don't actually use this yet, it's just a proof of concept for now. Everything breaks 5 seconds in 😁

This solution is based on https://github.com/mrmckeb/typescript-plugin-css-modules

## Get Started

Clone the repository, run yarn install, yarn build and yarn link

Open another repository (preferrably a new, empty one) and run `yarn link "svelte-ts-plugin"`

Create a `tsconfig.json` file with `"plugins" : [{"name": "svelte-ts-plugin"}]` and `"jsx": "preserve"` in `compilerOptions`

Run the "reload window" command (`F1 > "Developer: Reload Window"`), the plugin should be enabled.

You can see TS Server logs by using the `Typescript: Open TS Server Logs` command while viewing a .ts file

If you're going to play with this I recommend installing the "TS Server Debug" extension, it adds a command that restarts the TS server with debugging enabled, then run the `Debug: Attach to Node process` command and type in the port the extension gave you

Note that you cannot use a dev branch of typescript with linked modules, so once in a typescript file make sure to click at the version number at the right of "Typescript" on the bottom right > Select Typescript Version > Use Workspace version

## Todo

* Fix the assertion errors in console

* Renaming a variable inside a ts file will rename the svelte file based on svelte2tsx positions, I was thinking about interceipting refactoring changes to svelte files and instead append them to the file in the form of a command so that the svelte plugin can in turn parse it and execute the refactoring properly
