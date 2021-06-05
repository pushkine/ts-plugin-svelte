Archived. 

TSPlugin denied by Svelte Language Server maintainer(s) for being too ambitious. Instead, maintainers merged a frail and passive opt-in TSPlugin, it most notably breaks for any unsaved files in the workspace, I don't know who this helps but people who don't write code. 

My plugin works, yet for some reason it had issues mapping the end of some identifiers. It turns out that the svelte2tsx library used by the Svelte language server needs rewriting, as the entirety of the codebase uses RichHarris/MagicString which doesn't provide a way to map identifiers properly. Not to mention, SourceMapping wasn't even tested in svelte2tsx, and maintainers preffered integrating massive monkey patching in the language server rather than doing the dirty work.

Monkey Patching wasn't an option in the TSPlugin, so I contributed hundreds of hours building a complete and robust infrastructure around SourceMapping. Then carried on rewriting svelte2tsx from the ground up. We discussed the matter at length, yet once I got around halfway done rewriting the entire thing, I was told a maintainer was building a TSPlugin on his own. A few days later, he merged his prototype.

When enquiring about the merged plugin, I was told any contribution would be denied if it used Typescript internals. I asked if they would consider allowing me to still do it as an opt-in "experimental" option. I was ghosted. I was told that my plugin helped greatly in writing the merged plugin, yet my name wasn't mentionned anywhere. I discovered later that parts of my work was straight up copy pasted in there. Ask me how I feel about Open Source. 🙂

Svelte is the framework I use at work every day, and the lack of integration with typescript causes me trouble and wastes me hours every week. I believe that Svelte's core maintainers legitimately never refactored anything in their life, they therefore don't see the need for a strong integration with Typescript. The only way for it to happen now would be for Typescript to design a public API with Vue, Angular and Svelte in mind. I'm not sure but I think the TSPlugin API hasn't changed in over half a decade.

# ts-plugin-svelte

This TSPlugin injects arbitrary languages to the list of files the real TS Language Server supports, when a file of that language is requested it simply transforms its cached contents into another language that TS natively understands (TSX in this case), and maps LanguageService requests back to the source when returning results.

This implementation edits the cached files content back and forth between languages on the fly, svelte essentially becomes tsx in the eyes of the ts language server. Benefits include refactoring, rename, codelens, references, imports, autocomplete and so on...

## Get Started

Clone the repository, open in VScode and hit F5 to launch a window with this plugin enabled

You can see TS Server logs by using the `Typescript: Open TS Server Logs` command while viewing a .ts file
