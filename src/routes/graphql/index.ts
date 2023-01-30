import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import { userProfilePostMemberByIdQuery, usersProfilesPostsMembersQuery, usersWithPostsProfileMemberTypeQuery, usersWithProfileUserSubscribedToQuery, userWithPostsProfileMemberTypeQuery, userWithPostsSubscribedToUserByIdQuery } from './queries';
import { createPostMutation, createProfileMutation, createUserMutation, subscribeToMutation, unsubscribeFromMutation, updateMemberTypeMutation, updatePostMutation, updateProfileMutation, updateUserMutation } from './mutations';


const queries = new GraphQLObjectType({
  name: 'Query',
  fields: {
    usersProfilesPostsMembers: usersProfilesPostsMembersQuery,
    userProfilePostMemberById: userProfilePostMemberByIdQuery,
    usersWithPostsProfileMemberType: usersWithPostsProfileMemberTypeQuery,
    userWithPostsProfileMemberType: userWithPostsProfileMemberTypeQuery,
    usersWithProfileUserSubscribedTo: usersWithProfileUserSubscribedToQuery,
    userWithPostsSubscribedToUserById: userWithPostsSubscribedToUserByIdQuery,
    unsubscribeFrom: unsubscribeFromMutation
  }
});

const mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserMutation,
    createProfile: createProfileMutation,
    createPost: createPostMutation,
    updateUser: updateUserMutation,
    updateProfile: updateProfileMutation,
    updatePost: updatePostMutation,
    updateMemberType: updateMemberTypeMutation,
    subscribeTo: subscribeToMutation,
    unsubscribeFrom: unsubscribeFromMutation
  }
});

const schema = new GraphQLSchema ({
  
  query: queries,
  mutation: mutations,
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, variables } = request.body;

      const res = await graphql({
        schema,
        source: String(query),
        variableValues: variables,
        contextValue: fastify,
      })
      return res;
    }
  );
};

export default plugin;
