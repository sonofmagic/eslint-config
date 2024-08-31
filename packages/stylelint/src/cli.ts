import process from 'node:process'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { setVscodeSettingsJson } from './shared'

const cwd = process.cwd()

fs.mkdirSync(resolve(cwd, '.vscode'), {
  recursive: true,
})
const vscodeSettingsFilename = resolve(cwd, '.vscode/settings.json')

let json = {}
if (fs.existsSync(vscodeSettingsFilename)) {
  json = JSON.parse(fs.readFileSync(vscodeSettingsFilename, 'utf8'))
}
setVscodeSettingsJson(json)
fs.writeFileSync(vscodeSettingsFilename, JSON.stringify(json, undefined, 2), 'utf8')
