// pinia type definitions
declare module 'pinia' {
    import { App } from 'vue';

    export interface StateTree {
        [key: string]: any;
    }

    export interface PiniaCustomProperties {
        [key: string]: any;
    }

    export interface PiniaCustomStateProperties {
        [key: string]: any;
    }

    export type Store<Id extends string = string, S extends StateTree = {}, G = {}, A = {}> = {
        id: Id;
        state: S;
    } & G & A;

    export interface StoreDefinition<Id extends string = string, S extends StateTree = StateTree, G = {}, A = {}> {
        (): Store<Id, S, G, A>;
        id: Id;
    }

    export interface DefineStoreOptions<Id extends string, S extends StateTree, G, A> {
        id: Id;
        state?: () => S;
        getters?: G & ThisType<S & G>;
        actions?: A & ThisType<S & G & A>;
    }

    export function defineStore<Id extends string, S extends StateTree = {}, G = {}, A = {}>(
        id: Id,
        options: DefineStoreOptions<Id, S, G, A>
    ): StoreDefinition<Id, S, G, A>;

    export function defineStore<Id extends string, SS>(
        id: Id,
        storeSetup: () => SS
    ): StoreDefinition<Id, {}, {}, {}>;

    export function createPinia(): {
        install(app: App): void;
    };

    export function getActivePinia(): any;
    export function setActivePinia(pinia: any): void;
}
