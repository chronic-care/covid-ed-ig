const jsonfile = require('jsonfile')
const argv = require('minimist')(process.argv.slice(2))

const releaseTag = argv['release-tag']

if (!releaseTag) {
    console.log('Missing argument: --release-tag <tag>')
    process.exit(1)
}

const tagMatch = releaseTag.match(/v(\d+\.\d+\.\d+)$/)

if (!tagMatch) {
    console.log(`Invalid release tag format.\nReceived "${releaseTag} but expected it to end with "vX.Y.Z" where X.Y.Z is the semver of the release, e.g. v0.0.1`)
    process.exit(1)
}

const packageTag = tagMatch[1]
console.log(`Packaging and publishing release ${packageTag}`)

const packageJsonPath = 'output/package/package.json'
const libraryPackageJsonPath = 'library-package.json'

console.log(`Loading ${packageJsonPath}`)
const config = jsonfile.readFileSync(packageJsonPath)
console.log(`Updating ${packageJsonPath}`)

console.log(`Loading ${libraryPackageJsonPath}`)
const libraryConfig = jsonfile.readFileSync(libraryPackageJsonPath)
console.log(`Updating ${libraryPackageJsonPath}`)

config.name = libraryConfig.name
config.version = packageTag
config.dependencies = {}

jsonfile.writeFileSync(packageJsonPath, config, { spaces: 2 })
