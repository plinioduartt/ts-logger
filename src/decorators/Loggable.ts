export function Loggable(level: 'debug' | 'info'): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // Initialization
    console[level](
      `[${
        target.constructor.name as string
      }][${propertyKey.toString()}] is being intercepted by ts-logger...`
    )

    // Execution
    const originalMethod: any = descriptor.value
    descriptor.value = async function (...args: any) {
      console[level](`[${
        target.constructor.name as string
      }][${propertyKey.toString()}] is being called with arguments:\n${JSON.stringify(args, null, 2)} \n`)
      try {
        const result = await originalMethod.apply(this, args)
        console[level](`[${
					target.constructor.name as string
				}][${propertyKey.toString()}] results:\n${JSON.stringify(result, null, 2)} \n`)
        return result
      } catch (error: unknown) {
        console.error(`[${
					target.constructor.name as string
				}][${propertyKey.toString()}] error in execution:\n`, error)
        throw error
      }
    }
    return descriptor
  }
}
