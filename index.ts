import { override_languageServiceHost } from "./transform/languageServiceHost";
import { override_typescript } from "./transform/typescript";
import { is_svelte_file } from "./transform/utils";
export type ts = Parameters<ts.server.PluginModuleFactory>[0]["typescript"];
interface SvelteTsPluginOptions {
	name: string;
}

module.exports = function init(modules) {
	const ts = modules.typescript;

	override_typescript(ts);

	return {
		create(info: ts.server.PluginCreateInfo & { config: SvelteTsPluginOptions }): ts.LanguageService {
			const { languageService, languageServiceHost } = info;
			override_languageServiceHost(ts, languageServiceHost);
			return languageService;
		},
		getExternalFiles(project: ts.server.ConfiguredProject) {
			return project.getFileNames().filter(is_svelte_file);
		},
	};
} as ts.server.PluginModuleFactory;
