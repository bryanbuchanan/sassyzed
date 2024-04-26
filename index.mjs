import fs from 'fs'
import os from 'os'
import path from 'path'

import functions from './functions/index.mjs'

// Get input file
const inputDir = "./src"
const inputFile = functions.getScssFile(inputDir)

// Define output files
const fileName = path.basename(inputFile, '.scss')
const outputFiles = [
	`./dist/${fileName}.json`,
	path.join(os.homedir(), '.config', 'zed', 'themes', `${fileName}.json`),
]

functions.processFile(inputFile, outputFiles)

if (process.env.MODE === "dev") {

	// Watch source file for changes
	fs.watch(inputDir, () => functions.processFile(inputFile, outputFiles))

	console.log(`Watching '${inputDir}' for changes...`)
	console.log(`Press ^c to stop`)

}
