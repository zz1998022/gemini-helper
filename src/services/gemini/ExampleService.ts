class ExampleService {
  public getHelloMessage(): string {
    return 'Hello from gemini service!'
  }

  // 模拟一个复杂的业务逻辑
  public addNumbers(a: number, b: number): number {
    return a + b
  }
}

export default new ExampleService()
