declare module 'jsonpath-plus' {
    export interface JSONPathOptions {
        path: string
        json: unknown
        resultType?: 'value' | 'pointer' | 'path' | 'parent' | 'property'
        wrap?: boolean
    }

    export function JSONPath(options: JSONPathOptions): any
}
