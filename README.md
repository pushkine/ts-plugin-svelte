# ts-plugin-svelte

This TSPlugin injects arbitrary languages to the list of files the real TS Language Server supports, when a file of that language is requested it simply transforms its cached contents into another language that TS natively understands (TSX in this case), and maps LanguageService requests back to the source when returning results.

This implementation edits the cached files content back and forth between languages on the fly, svelte essentially becomes tsx in the eyes of the ts language server. Benefits include refactoring, rename, codelens, references, imports, autocomplete and so on...

## Get Started

Clone the repository, open in VScode and hit F5 to launch a window with this plugin enabled

You can see TS Server logs by using the `Typescript: Open TS Server Logs` command while viewing a .ts file
