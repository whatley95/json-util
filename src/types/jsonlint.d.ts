declare module 'jsonlint-mod' {
    export function parse(json: string): any;
    export function parseError(error: any): string;
}
