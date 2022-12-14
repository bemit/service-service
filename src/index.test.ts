import { expect, describe, test } from '@jest/globals'
import { ServiceContainer } from './index.js'

describe('ServiceService', () => {
    class ExampleService {
        private readonly name: string

        constructor(name: string) {
            this.name = name
        }

        getName() {
            return this.name
        }
    }

    test('correct-instance--use', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        const service = ServiceService.use(ExampleService)
        expect(service instanceof ExampleService).toBe(true)
    })

    test('correct-instance--get', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        const service = ServiceService.get<ExampleService>('ExampleService')
        expect(service instanceof ExampleService).toBe(true)
    })

    test('correct-instance--add', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.add<typeof ExampleService>('ExampleService', () => ({
            service: ExampleService,
            init: ['the-name'],
        }))
        const service = ServiceService.get<ExampleService>('ExampleService')
        expect(service instanceof ExampleService).toBe(true)
    })

    test('correct-instance--provide', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.provide(ExampleService, new ExampleService('the-name'))
        const service = ServiceService.get<ExampleService>('ExampleService')
        expect(service instanceof ExampleService).toBe(true)
    })

    test('correct-instance--provide-string', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.provide<typeof ExampleService>('ExampleService', new ExampleService('the-name'))
        const service = ServiceService.get<ExampleService>('ExampleService')
        expect(service instanceof ExampleService).toBe(true)
    })

    test('instance-configured', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        const service = ServiceService.use(ExampleService)
        expect(service.getName()).toBe('the-name')
        // this test is testing that an already initialized service is returned correctly
        const service2 = ServiceService.use(ExampleService)
        expect(service2).toBe(service)
        expect(service2.getName()).toBe('the-name')
    })

    test('instance-configured-lazily', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, (): ConstructorParameters<typeof ExampleService> => ['the-name'])
        const service = ServiceService.use(ExampleService)
        expect(service.getName()).toBe('the-name')
    })

    test('instance-overwrite-define', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        expect(() => ServiceService.define(ExampleService, ['the-name'])).toThrow(Error)
    })

    test('instance-overwrite-add', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        expect(() => ServiceService.add<typeof ExampleService>('ExampleService', () => ({
            service: ExampleService,
            init: ['the-name'],
        }))).toThrow(Error)
    })

    test('instance-overwrite-define-provide', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.provide(ExampleService, new ExampleService('the-name'))
        expect(() => ServiceService.define(ExampleService, ['the-name'])).toThrow(Error)
    })

    test('instance-not-found', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        // @ts-ignore
        expect(() => ServiceService.get('ExampleServicesss')).toThrow(Error)
    })

    test('var-config', () => {
        const ServiceService = new ServiceContainer<{ name: string }>()
        ServiceService.configure('name', 'some-value')
        expect(ServiceService.config('name')).toBe('some-value')
    })
})
