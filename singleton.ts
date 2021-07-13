class ApolloServer {
  private static instance: ApolloServer

  private constructor() {}

  public static new(): ApolloServer {
    if (!ApolloServer.instance) {
      ApolloServer.instance = new ApolloServer()
    }
    return ApolloServer.instance
  }
}

const s1 = ApolloServer.new()
const s2 = ApolloServer.new()

s1 === s2 // -> true

const hello = { a: 1 }
function x() {
  const copy = hello
  copy.a = 2
  console.log({ copy })
}

x()
console.log({ hello })
