import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { memberTypeType, postType, profileType, userType } from "../types";

const usersProfilesPostsMembersTypes = new GraphQLObjectType({
    name: 'UsersProfilesPostsMembers',
    fields: () => ({
      users: { type: new GraphQLList(userType) },
      profiles: { type: new GraphQLList(profileType)},
      posts: { type: new GraphQLList(postType) },
      memberTypes: { type: new GraphQLList(memberTypeType) }
    })
  });
  
  
  const usersProfilesPostsMembersQuery = {
    type: usersProfilesPostsMembersTypes,
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const users = await fastify.db.users.findMany();
      const profiles = await fastify.db.profiles.findMany();
      const posts = await fastify.db.posts.findMany();
      const memberTypes = await fastify.db.memberTypes.findMany();
      return {users: users, profiles: profiles, posts: posts, memberTypes: memberTypes}
    }
  };

  export default usersProfilesPostsMembersQuery;