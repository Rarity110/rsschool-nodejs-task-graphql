import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { profileType } from "../types";

const createProfileInputType = new GraphQLInputObjectType({
  name: 'createProfileInput',
  fields: () => ({
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const createProfileMutation = {
    type: profileType,
    args: {
      input: {type: createProfileInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const profileData = args.input;
      const userId = profileData.userId;
      const memberTypeId = profileData.memberTypeId;

      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

      const profileById = await fastify.db.profiles.findOne({ key: 'userId', equals: userId });

      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

      if (!memberType || !user || profileById) {
        throw fastify.httpErrors.badRequest();
      }

      return await fastify.db.profiles.create(profileData);
    }
};

export default createProfileMutation;