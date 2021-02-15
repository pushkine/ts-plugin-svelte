import fs from "fs";
import path from "path";
import { ts } from "..";
import { is_relative_path, is_svelte_file, override_methods } from "./utils";

export function override_languageServiceHost(typescript: ts, languageServiceHost: ts.LanguageServiceHost) {
	if (!("resolveModuleNames" in languageServiceHost)) return;
	/**
	 * Typescript does not expose ways to resolve non ts extension files
	 * https://github.com/microsoft/TypeScript/issues/28770
	 *
	 * # Hack using internals:
	 * Input = "something/Component.svelte"
	 * let ts fail at resolving the module path as if it were a directory
	 * 		"baseUrl/node_modules/something/Component.svelte/index.ts"
	 * 		"baseUrl/packages/something/Component.svelte/index.ts"
	 * then try those instead
	 */
	function attempt_hacky_resolution(path_name: string, importing_file: string): string | undefined {
		const failed = languageServiceHost.getResolvedModuleWithFailedLookupLocationsFromCache?.(path_name, importing_file);
		// @ts-expect-error this is an internal property
		const failedLookupLocations = failed.failedLookupLocations as string[];
		const index_ts = "/index.ts";
		for (const url of failedLookupLocations) {
			if (url.endsWith(index_ts)) {
				// (todo) error if several solutions are possible
				const file_url = url.slice(0, index_ts.length);
				if (fs.existsSync(file_url)) return path.resolve(file_url);
			}
		}
	}

	function resolve_path(path_name: string, importing_file: string): string | undefined {
		if (is_svelte_file(path_name)) {
			// debugger;
			if (is_relative_path(path_name)) {
				return path.resolve(path.dirname(importing_file), path_name);
			}
			try {
				return attempt_hacky_resolution(path_name, importing_file);
			} catch {}
		}
		return undefined;
	}

	return override_methods(languageServiceHost as Required<ts.LanguageServiceHost>, {
		resolveModuleNames(_, moduleNames, containingFile, ...rest): (ts.ResolvedModule | ts.ResolvedModuleFull | undefined)[] {
			return _(moduleNames, containingFile, ...rest).map((fallback, index) => {
				const resolvedFileName = resolve_path(moduleNames[index], containingFile);
				if (resolvedFileName) {
					return {
						extension: typescript.Extension.Tsx,
						isExternalLibraryImport: /\/node_modules\//.test(resolvedFileName),
						resolvedFileName,
					};
				}
				return fallback;
			});
		},
	});
}
