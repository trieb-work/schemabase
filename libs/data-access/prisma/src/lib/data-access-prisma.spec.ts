import { dataAccessPrisma } from "./data-access-prisma"

describe("dataAccessPrisma", () => {
  it("should work", () => {
    expect(dataAccessPrisma()).toEqual("data-access-prisma")
  })
})
