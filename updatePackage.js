const jsonfile = require('jsonfile')

const packageJsonPath = 'output/package/package.json'
const libraryPackageJsonPath = 'library-package.json'

console.log(`Loading ${packageJsonPath}`)
const config = jsonfile.readFileSync(packageJsonPath)
console.log(`Updating ${packageJsonPath}`)

console.log(`Loading ${libraryPackageJsonPath}`)
const libraryConfig = jsonfile.readFileSync(libraryPackageJsonPath)
console.log(`Updating ${libraryPackageJsonPath}`)

config.name = libraryConfig.name
config.version = libraryConfig.version
config.dependencies = {}

jsonfile.writeFileSync(packageJsonPath, config, { spaces: 2 })
