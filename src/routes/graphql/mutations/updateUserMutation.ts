import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { userType } from "../types";

const updateUserInputType = new GraphQLInputObjectType({
  name: 'updateUserInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updateUserMutation =  {
    type: userType,
    args: {
      input: {type: updateUserInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const userData = args.input;
        const id = userData.userId;

        const user = await fastify.db.users.findOne({ key: 'id', equals: id });
        if (!user) {
          throw fastify.httpErrors.badRequest();
        }
        return await fastify.db.users.change(id, userData);
    }
};

export { updateUserMutation };