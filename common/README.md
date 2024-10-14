steps to convert to npm modules!

-> npmjs is website to deploy your project

-> rename package.json name to something that are unique to npm!

-> again in package.json change main to dist/index.js (entry point of package)
(file that will be loaded when someone imports or require your package in their projects)

-> npm login (they send otp on gmail)

-> compile and generate dist folder using (tsc -b)
(it will create index.js and index.d.ts for type of javascript)

-> create root file .npmignore (write src to it)

-> npm publish --access public 