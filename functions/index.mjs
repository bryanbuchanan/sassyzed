import fs from 'fs'
import path from 'path'
import * as sass from 'sass'
import postcss from 'postcss'
import postcssJs from 'postcss-js'

const functions = {

	getScssFile: async inputDir => {
		// Get first SCSS file found in input directory
		const files = fs.readdirSync(inputDir)
		for (let file of files) {
			if (path.extname(file) === ".scss") {
				return `${inputDir}/${file}`
			}
		}
	},

	compileSCSS: async file => {
		try {
			const result = sass.compile(file)
			return result.css.toString()
		} catch (error) {
			console.error(error)
		}
	},

	cssToObject: async css => {
		const root = postcss.parse(css, { parser: postcssJs })
		return postcssJs.objectify(root)
	},

	processSCSS: async scssFilePath => {
		const css = await compileSCSS(scssFilePath)
		const jsObject = await cssToJsObject(css)
		return jsObject
	},

	nest: data => {
		const nestedObject = {}
		Object.keys(data).forEach(key => {
			const path = key.split(' ')
			path.reduce((acc, value, index) => {
				if (index === path.length - 1) {
					acc[value] = data[key]
					return acc[value]
				}
				acc[value] = acc[value] || {}
				return acc[value]
			}, nestedObject)
		})
		return nestedObject
	},

	removeDashes: obj => {
		const newObj = {}
		Object.keys(obj).forEach(key => {
			const newKey = key.startsWith('--') ? key.slice(2) : key
			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
				newObj[newKey] = removeDashes(obj[key])
			} else {
				newObj[newKey] = obj[key]
			}
		})
		return newObj
	},

	replacements: obj => {
		const newObj = {};
		Object.keys(obj).forEach(key => {

			// Remove CSS var prefix
			let newKey = key.startsWith('--') ? key.slice(2) : key

			// Schema
			newKey = newKey.replace('schema', '$schema')

			// Replace '--' with '_'
			newKey = newKey.replace(/--/g, '_')

			// Replace '-' with '.'
			newKey = newKey.replace(/-/g, '.')

			// Replace 'fontWeight' with 'font_weight'
			newKey = newKey.replace('fontWeight', 'font_weight')

			// Replace 'fontStyle' with 'font_style'
			newKey = newKey.replace('fontStyle', 'font_style')

			// Recursive call if the value is an object (and not an array)
			if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
				newObj[newKey] = functions.replacements(obj[key])
			} else {
				if (typeof obj[key] === "string") {
					// Remove double quotes from values
					let value = obj[key].replace(/\"/g, '')
					// Handle null values
					if (value === "null") value = null
					newObj[newKey] = value
				} else {
					newObj[newKey] = obj[key]
				}
			}
		})
		return newObj
	},

	structure: obj => {

		// Turn themes into an array
		let themes = obj.themes
		obj.themes = []
		for (const theme in themes) {
			obj.themes.push({...themes[theme]})
		}

		// Turn players into an array
		for (const theme of obj.themes) {
			let players = theme.style.players
			theme.style.players = []
			for (const player in players) {
				theme.style.players.push({...players[player]})
			}
		}

		// Unwrap :root object
		for (const [key, value] of Object.entries(obj[':root'])) {
			obj[key] = value
		}
		delete obj[':root']

		// Sort root level properties
		themes = obj.themes
		delete obj.themes
		obj.themes = themes

		return obj
	},

	save: (data, output) => {
		console.log(`Saving ${output}`)
		const dir = path.dirname(output)
		fs.mkdirSync(dir, { recursive: true })
		fs.writeFileSync(output, data)
	},

}

export default functions
