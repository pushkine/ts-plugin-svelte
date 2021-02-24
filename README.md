# ts-plugin-svelte



## Get Started

Clone the repository, run yarn install, yarn build and yarn link

Open another repository (preferrably a new, empty one) and run `yarn link "svelte-ts-plugin"`

Create a `tsconfig.json` file with `"plugins" : [{"name": "svelte-ts-plugin"}]` in `compilerOptions`

Run the "reload window" command (`F1 > "Developer: Reload Window"`), the plugin should be enabled.

You can see TS Server logs by using the `Typescript: Open TS Server Logs` command while viewing a .ts file
