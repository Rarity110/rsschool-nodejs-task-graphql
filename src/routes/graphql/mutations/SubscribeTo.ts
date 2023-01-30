import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { userType } from "../types";

const subscribeToInputType = new GraphQLInputObjectType({
  name: 'subscribeToInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    userIdSubscribeTo: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const subscribeToMutation =  {
    type: userType,
    args: {
      input: {type: subscribeToInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const userIdSubscribeTo = args.input.userIdSubscribeTo;
      const userID = args.input.userId;
      const user = await fastify.db.users.findOne({ key: 'id', equals: userIdSubscribeTo });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      const userIDSubscribes = await fastify.db.users.findOne({ key: 'id', equals: userID });
      if (!userIDSubscribes) {
        throw fastify.httpErrors.badRequest();
      }
      
      userIDSubscribes.subscribedToUserIds.push(userIdSubscribeTo);
      await fastify.db.users.change(userID, userIDSubscribes)
      return user;
    }
};

export { subscribeToMutation };