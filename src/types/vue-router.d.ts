// vue-router type definitions
declare module 'vue-router' {
    import { DefineComponent, App } from 'vue';

    export interface RouteLocationRaw {
        path?: string;
        name?: string;
        params?: Record<string, any>;
        query?: Record<string, any>;
        hash?: string;
    }

    export interface RouteLocationNormalized {
        path: string;
        fullPath: string;
        hash: string;
        query: Record<string, string>;
        params: Record<string, string>;
        name: string | null | undefined;
        meta: Record<string, any>;
    }

    export interface RouterOptions {
        history: RouterHistory;
        routes: RouteRecordRaw[];
    }

    export interface RouterHistory {
        readonly location: string;
        push(to: string): Promise<void>;
        replace(to: string): Promise<void>;
        go(delta: number): void;
    }

    export interface RouteRecordRaw {
        path: string;
        name?: string;
        component?: any;
        components?: Record<string, any>;
        redirect?: string | RouteLocationRaw;
        children?: RouteRecordRaw[];
        meta?: Record<string, any>;
    }

    export interface Router {
        push(to: RouteLocationRaw): Promise<void>;
        replace(to: RouteLocationRaw): Promise<void>;
        back(): void;
        forward(): void;
        go(delta: number): void;
        currentRoute: RouteLocationNormalized;
    }

    export function createRouter(options: RouterOptions): Router;
    export function createWebHistory(base?: string): RouterHistory;

    export function useRouter(): Router;
    export function useRoute(): RouteLocationNormalized;
}
