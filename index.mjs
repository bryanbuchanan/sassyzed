import fs from 'fs'
import os from 'os'
import path from 'path'

import functions from './functions/index.mjs'

// File destinations
const input = "./src/theme.scss"
const output = "./dist/theme.json"
const devOutput = path.join(os.homedir(), '.config', 'zed', 'themes', 'theme.json')
let outputs = [output]

const processFile = async outputs => {

	// Convert SCSS to CSS
	const css = await functions.compileSCSS(input)

	// Convert CSS to JS Object
	let js = await functions.cssToObject(css)

	// Transformations
	js = functions.nest(js)
	js = functions.replacements(js)
	js = functions.structure(js)

	// Convert to JSON
	let json = JSON.stringify(js, null, 2)

	// Save output
	for (const output of outputs) {
		functions.save(json, output)
	}

}

if (process.env.MODE === "dev") {

	// Add local config to outputs list
	outputs.push(devOutput)

	// Watch source file for changes
	fs.watch(path.dirname(input), (_) => {
		processFile(outputs)
		console.log('---')
	})

	console.log(`Watching '${input}' for changes...`)
	console.log(`Press ^c to stop`)

}

processFile(outputs)
