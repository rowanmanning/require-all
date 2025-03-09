export type Options = {
	extensions?: string[] | undefined;
};

export type ModuleInfo = {
	name: string;
	fullPath: string;
	extension: string;
	moduleExports: unknown;
};

export function requireAll(directoryPath: string, options?: Options): ModuleInfo[];
