import { gql } from "graphql-modules";

export default gql`
  extend type Query {
    packageByTrackingId(trackingId: ID!): Package
  }
`;
