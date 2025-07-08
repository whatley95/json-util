declare module 'diff2html' {
    export function parse(diffInput: string, options?: any): any;
    export function html(diffJson: any, options?: any): string;
    export const Diff2Html: {
        parse: typeof parse;
        html: typeof html;
    };
}
