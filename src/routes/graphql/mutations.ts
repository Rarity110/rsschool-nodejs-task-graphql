import { GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { userType } from "./types";

const createUserMutation = {
  
    type: userType,
    args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        return await fastify.db.users.create(args);
      }
};

export { createUserMutation };