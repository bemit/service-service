# ServiceService

Dead simple service and config container, with lazy initialization and strong typings.

```typescript
import { ServiceContainer } from 'service-service'

class ExampleService {
    private readonly name: string

    constructor(name: string, options: { a: string }) {
        this.name = name
    }

    getName() {
        return this.name
    }
}

export interface AppConfig {
    name: string
}

export const container = new ServiceContainer<AppConfig>()

// specify configuration values:
container.configure('name', 'Example App')
// get configuration values:
container.config('name')

// define services, pass `constructor` params as array:
container.define(ExampleService, [
    'the-name',
    {
        a: 'a-value',
    },
])

// provide params as function, for lazy execution (on first `use`)
container.define(ExampleService, [
    'the-name',
    {
        a: 'a-value',
    },
])

// use the service:
const service = container.use(ExampleService)
service.getName() // will return `the-name`
```

## License

[MIT License](https://github.com/bemit/service-service/blob/main/LICENSE)

© 2022 [Michael Becker](https://i-am-digital.eu)

