type ExtractMethods<T extends object> = {
	[K in keyof T]: Extract<T[K], () => any>;
};
type MethodKeys<T extends object> = keyof ExtractMethods<T>;
export function override_methods<T extends {}>(
	obj: T,
	augment: {
		[K in MethodKeys<T>]?: T[K] extends (...args: infer P) => infer R ? (this: T, fn: T[K], ...args: P) => R : never;
	},
) {
	for (const key in augment) {
		if (!(key in obj)) throw new Error(`"${key}" does not exist`);
		obj[key] = (augment[key] as any).bind(obj, (obj[key] as any).bind(obj));
	}
	return obj;
}
export function is_svelte_file(fileName: string) {
	return /\.svelte$/.test(fileName);
}
export function is_relative_path(moduleName: string) {
	return /^\.\.?/.test(moduleName);
}
