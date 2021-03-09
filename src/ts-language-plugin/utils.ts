import { TSPluginContext } from ".";
import { LineChar, LineOffset } from "./types";
type ExtractMethods<T extends object> = {
	[K in keyof T]: Extract<T[K], (...args: any[]) => any>;
};
type MethodKeys<T extends object> = keyof ExtractMethods<T>;
export function override<T extends object, O extends Required<T>>(
	target: T,
	obj: {
		[K in MethodKeys<O>]?: O[K] extends (...args: infer P) => infer R ? (this: T, fn: O[K], ...args: P) => R : never;
	},
) {
	for (const key in obj) {
		(target as O)[key] = obj[key].bind(target, ((target as O)[key] as any)?.bind(target)) as any;
	}
	return target;
}
export function addSideEffects<T extends object, O extends Required<T>>(
	target: T,
	obj: {
		[K in MethodKeys<O>]?: O[K] extends (...args: infer P) => infer R ? (this: T, result: R, ...args: P) => void : never;
	},
) {
	const o = {};
	for (const key in obj) {
		const fn = obj[key].bind(target); // @ts-ignore
		o[key] = function (_, ...args) {
			const result = _(...args);
			fn(result, ...args);
			return result;
		};
	}
	override(target, o);
}
export function testForExtension(extension: string) {
	const re = new RegExp(`\\.${extension.replace(/^\./, "")}$`);
	return re.test.bind(re);
}
export function getText(script: ts.IScriptSnapshot) {
	return script.getText(0, script.getLength());
}
export function getExtensionFromScriptKind({ ts }: TSPluginContext, kind: ts.ScriptKind): ts.Extension | undefined {
	switch (kind) {
		case ts.ScriptKind.JS:
			return ts.Extension.Js;
		case ts.ScriptKind.JSON:
			return ts.Extension.Json;
		case ts.ScriptKind.JSX:
			return ts.Extension.Jsx;
		case ts.ScriptKind.TS:
			return ts.Extension.Ts;
		case ts.ScriptKind.TSX:
			return ts.Extension.Tsx;
		case ts.ScriptKind.Deferred:
		case ts.ScriptKind.External:
		case ts.ScriptKind.Unknown:
			return undefined;
	}
}
export function quote(str: string) {
	return `"${str}"`;
}
export function toPosition(lineStarts: number[], o: LineChar | LineOffset) {
	if ("offset" in o) return lineStarts[o.line - 1] + o.offset - 1;
	else return lineStarts[o.line] + o.character;
}
export function toLineChar(pos: LineOffset): LineChar {
	return { line: pos.line - 1, character: pos.offset - 1 };
}
export function positionToLineChar(lineStarts: number[], position: number): LineChar {
	const line = binarySearch(lineStarts, position);
	return { line, character: position - lineStarts[line] };
}
export function toLineOffset(pos: LineChar): LineOffset {
	return { line: pos.line + 1, offset: pos.character + 1 };
}
export function extensionFromFileName(fileName: string) {
	return fileName.slice(fileName.lastIndexOf(".") + 1);
}
const enum CharCode {
    /** RegExp/ECMAScript/Typescript Line terminator characters */
    LineFeed = 0x0a, // "\n" <LF>
    CarriageReturn = 0x0d, // "\r" <CR>
    LineSeparator = 0x2028, // System specific <LS>
    ParagraphSeparator = 0x2029 // 8232 (PS)
}
export function computeLineStarts(text: string) {
    const result: number[] = [0];
    let lineStart = 0;
    let pos = 0;
    let i = 0;
    while (pos < text.length)
        switch (text.charCodeAt(pos++)) {
            case CharCode.CarriageReturn:
                if (text.charCodeAt(pos) === CharCode.LineFeed) pos++;
            case CharCode.LineFeed:
            case CharCode.LineSeparator:
            case CharCode.ParagraphSeparator:
                result[i++] = lineStart;
                lineStart = pos;
        }
    result[i] = pos;
    return result;
}
export function binaryInsert(array: number[], value: number): void;
export function binaryInsert<T extends Record<any, number> | number[]>(array: T[], value: T, key: keyof T): void;
export function binaryInsert<A extends Record<any, number>[] | number[]>(array: A, value: A[any], key?: keyof (A[any] & object)) {
	if (0 === key) key = "0" as keyof A[any];
	const index = 1 + binarySearch(array, (key ? value[key] : value) as number, key);
	let i = array.length;
	while (index !== i--) array[1 + i] = array[i];
	array[index] = value;
}
export function binarySearch<T extends object | number>(array: T[], target: number, key?: keyof (T & object)) {
	if (!array || 0 === array.length) return -1;
	if (0 === key) key = "0" as keyof T;
	let low = 0;
	let high = array.length - 1;
	while (low <= high) {
		const i = low + ((high - low) >> 1);
		const item = undefined === key ? array[i] : array[i][key];
		if (item === target) return i;
		if (item < target) low = i + 1;
		else high = i - 1;
	}
	if ((low = ~low) < 0) low = ~low - 1;
	return low;
}
