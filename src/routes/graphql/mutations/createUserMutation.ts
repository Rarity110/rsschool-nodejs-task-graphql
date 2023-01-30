import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { userType } from "../types";

const createUserInputType = new GraphQLInputObjectType({
  name: 'createUserInput',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const createUserMutation =  {
    type: userType,
    args: {
      input: {type: createUserInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      return await fastify.db.users.create(args.input);
    }
};

export { createUserMutation };