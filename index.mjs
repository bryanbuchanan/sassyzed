import fs from 'fs'
import os from 'os'
import path from 'path'

import functions from './functions/index.mjs'

// Get input file
const inputDir = "./src"
const inputFile = await functions.getScssFile(inputDir)

// Define output files
const fileName = path.basename(inputFile, '.scss')
const outputFiles = [
	`./dist/${fileName}.json`,
	path.join(os.homedir(), '.config', 'zed', 'themes', `${fileName}.json`),
]

const processFile = async () => {

	// Convert SCSS to CSS
	const css = await functions.compileSCSS(inputFile)

	// Convert CSS to JS Object
	let js = await functions.cssToObject(css)

	// Transformations
	js = functions.nest(js)
	js = functions.replacements(js)
	js = functions.structure(js)

	// Convert to JSON
	let json = JSON.stringify(js, null, 2)

	// Save output
	for (const outputFile of outputFiles) {
		functions.save(json, outputFile)
	}

}

if (process.env.MODE === "dev") {

	// Watch source file for changes
	fs.watch(inputDir, (_) => processFile())

	console.log(`Watching '${inputDir}' for changes...`)
	console.log(`Press ^c to stop`)

}

processFile()
