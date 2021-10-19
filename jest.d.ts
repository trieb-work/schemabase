declare namespace jest {
  interface Matchers<R> {
    toMatchStrapiAddress(order: any, strapiAddresses: any[]): R;
  }
}
