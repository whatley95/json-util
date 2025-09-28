declare module 'json5' {
    import parse = require('json5/lib/parse')
    import stringify = require('json5/lib/stringify')

    export { parse, stringify }

    const JSON5: {
        parse: typeof parse
        stringify: typeof stringify
    }

    export default JSON5
}
