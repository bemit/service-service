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

    test('instance-configured', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        const service = ServiceService.use(ExampleService)
        expect(service.getName()).toBe('the-name')
        // this test is testing that an already initialized service is returned correctly
        const service2 = ServiceService.use(ExampleService)
        expect(service2.getName()).toBe('the-name')
    })

    test('instance-overwrite', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        expect(() => ServiceService.define(ExampleService, ['the-name'])).toThrow(Error)
    })

    test('instance-not-found', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.define(ExampleService, ['the-name'])
        // @ts-ignore
        expect(() => ServiceService.get('ExampleServicesss')).toThrow(Error)
    })

    test('var-config', () => {
        const ServiceService = new ServiceContainer()
        ServiceService.configure('some-key', 'some-value')
        expect(ServiceService.config('some-key')).toBe('some-value')
    })
})
