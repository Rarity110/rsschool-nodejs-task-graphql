import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { profileType } from "../types";

const updateProfileInputType = new GraphQLInputObjectType({
  name: 'updateProfileInput',
  fields: () => ({
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    profileId: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updateProfileMutation = {
    type: profileType,
    args: {
      input: {type: updateProfileInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const profileData = args.input;
        const id = profileData.profileId;
        const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });
        if (!profile) {
          throw fastify.httpErrors.badRequest();
        }
        return await fastify.db.profiles.change(id, profileData);
    }
};

export default updateProfileMutation;