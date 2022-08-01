# ServiceService

[![npm (scoped)](https://img.shields.io/npm/v/service-service?style=flat-square)](https://www.npmjs.com/package/service-service)
[![Github actions Build](https://github.com/bemit/service-service/actions/workflows/blank.yml/badge.svg)](https://github.com/bemit/service-service/actions)
[![MIT license](https://img.shields.io/npm/l/service-service?style=flat-square)](https://github.com/bemit/service-service/blob/main/LICENSE)
[![Coverage Status](https://img.shields.io/codecov/c/github/bemit/service-service/main.svg?style=flat-square)](https://codecov.io/gh/bemit/service-service/branch/main)
![Typed](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

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
container.define(ExampleService, () => [
    'the-name',
    {
        a: 'a-value',
    },
])

// use the service:
const service = container.use(ExampleService)
service.getName() // will return `the-name`
```

> ESM only package

## License

[MIT License](https://github.com/bemit/service-service/blob/main/LICENSE)

© 2022 [bemit](https://bemit.codes)
