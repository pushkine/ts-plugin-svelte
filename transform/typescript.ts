import svelte2tsx from "svelte2tsx";
import { ts } from "../index";
import { is_svelte_file, override_methods } from "./utils";

export function override_typescript(typescript: ts) {
	function transform(snapshot: ts.IScriptSnapshot) {
		const text = snapshot.getText(0, snapshot.getLength());
		return typescript.ScriptSnapshot.fromString(svelte2tsx(text).code);
	}
	return override_methods(typescript, {
		createLanguageServiceSourceFile(_, fileName, scriptSnapshot, ...rest) {
			if (is_svelte_file(fileName)) {
				rest[3] = typescript.ScriptKind.TSX;
				const file = _(fileName, transform(scriptSnapshot), ...rest);
				return file;
			}
			return _(fileName, scriptSnapshot, ...rest);
		},
		updateLanguageServiceSourceFile(_, sourceFile, scriptSnapshot, ...rest) {
			if (is_svelte_file(sourceFile.fileName)) {
				return _(sourceFile, transform(scriptSnapshot), ...rest);
			}
			return _(sourceFile, scriptSnapshot, ...rest);
		},
	});
}
