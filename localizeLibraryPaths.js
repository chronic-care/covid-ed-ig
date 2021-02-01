const jsonfile = require('jsonfile')

const libraryPaths = process.argv.slice(2)

console.log('Localizing CQL library paths')

libraryPaths.forEach((libraryPath) => {
    console.log('Updating ', libraryPath)

    const library = jsonfile.readFileSync(libraryPath);

    if (library.library && library.library.includes && library.library.includes.def) {
        library.library.includes.def = library.library.includes.def.map((def) => {
            def.path = def.path.replace(/^.*\//, '')
            return def
        })
    }

    jsonfile.writeFileSync(libraryPath, library, { spaces: 2 })
})