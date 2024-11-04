import path from "node:path";
import { readdir } from "node:fs/promises";
/**
 * Lists files in the specified directory that match the given validation function.
 *
 * @param {Function} validPath - A function that takes a file name as an argument and returns a boolean indicating whether the file is valid. Defaults to checking if the file ends with ".json".
 * @returns {Promise<string[]>} A promise that resolves to an array of valid file names.
 * @throws Will throw an error if there is an issue reading the directory.
 */
export default async function listFiles(pathFile="") {
    try {
		const modulePath = getPath();
		const directoryPath = path.join(modulePath, pathFile);
		const files = await readdir(directoryPath);
		return files;
	} catch (error) {
		console.error("Error reading directory:", error.message);
		throw error;
	}
}

function getPath() {
    const originalFunc = Error.prepareStackTrace;
    let callerFile;
	const err = new Error();
	let currentFile;
	// biome-ignore lint/complexity/useArrowFunction: <explanation>
	Error.prepareStackTrace = function (_, stack) { return stack; };
	currentFile = err.stack.shift().getFileName();
	while (err.stack.length) {
		callerFile = err.stack.shift().getFileName();
		if (currentFile !== callerFile) break;
	}
    Error.prepareStackTrace = originalFunc;
	if (callerFile.startsWith('file://')) {
        callerFile = callerFile.substring(8);
    }
    return path.dirname(callerFile);
}