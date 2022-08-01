export type ServiceDefinition<CC extends (new (...args: any[]) => any) = (new (...args: any[]) => any)> = () => {
    service: CC
    init: ConstructorParameters<CC> | (() => ConstructorParameters<CC>)
}

export class ServiceContainer<C extends {} = { [k: string]: any }> {
    protected readonly configData: C = {} as C
    protected services: { [key: string]: ServiceDefinition<any> } = {}
    protected loadedServices: { [key: string]: InstanceType<any> } = {}

    configure<K extends keyof C = keyof C>(key: K, value: C[K]) {
        this.configData[key] = value
    }

    config<K extends keyof C = keyof C>(key: K): C[K] {
        return this.configData[key]
    }

    add<C extends (new (...args: any[]) => any), SD extends ServiceDefinition<C> = ServiceDefinition<C>>(
        name: string,
        def: SD,
    ) {
        if(this.services[name]) throw new Error('ServiceContainer.add detected overwrite for: ' + name)
        this.services[name] = def
    }

    define<C extends (new (...args: any[]) => any)>(
        classRef: C,
        init: ConstructorParameters<C> | (() => ConstructorParameters<C>),
    ) {
        if(this.services[classRef.name]) throw new Error('ServiceContainer.define detected overwrite for: ' + classRef.name)
        this.services[classRef.name] = () => ({
            service: classRef,
            init: init,
        })
    }

    use<A extends (new (...args: any[]) => any)>(classRef: A): InstanceType<A> {
        return this.getService<InstanceType<A>>(classRef.name)
    }

    get<A = InstanceType<any>>(name: string): A {
        return this.getService<A>(name)
    }

    private getService<A>(name: string): A {
        if(!this.services[name]) {
            throw new Error('ServiceContainer not found: ' + name)
        }
        if(!this.loadedServices[name]) {
            const serviceDef = this.services[name]()
            const service = serviceDef.service
            const initParams = typeof serviceDef.init === 'function' ? serviceDef.init() : serviceDef.init
            this.loadedServices[name] = new service(...(initParams || []))
        }
        return this.loadedServices[name]
    }
}
