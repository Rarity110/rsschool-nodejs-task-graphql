import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { userType } from "../types";

const unsubscribeFromInputType = new GraphQLInputObjectType({
  name: 'unsubscribeFromInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    userIdunsubscribeFrom: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const unsubscribeFromMutation =  {
    type: userType,
    args: {
      input: {type: unsubscribeFromInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const userIdToUnsubscribe = args.input.userIdunsubscribeFrom;
      const userId = args.input.userId;
      const userToUnsubscribe = await fastify.db.users.findOne({ key: 'id', equals: userIdToUnsubscribe });
      if (!userToUnsubscribe) {
        throw fastify.httpErrors.notFound();
      }

      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }

      const userIdSubscribers = user.subscribedToUserIds;

      if (!userIdSubscribers.includes(userIdToUnsubscribe)) {
        throw fastify.httpErrors.badRequest();
      }
      
      const index = userIdSubscribers.indexOf(userIdToUnsubscribe);
      if (index !== -1) {
        userIdSubscribers.splice(index, 1);
      }

      await fastify.db.users.change(userId, user);

      return user;
    }
};

export { unsubscribeFromMutation };