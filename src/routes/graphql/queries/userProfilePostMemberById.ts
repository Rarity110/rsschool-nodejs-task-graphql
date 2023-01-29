import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { memberTypeType, postType, profileType, userType } from "../types";

const userProfilePostMemberByIdType = new GraphQLObjectType({
    name: 'userProfilePostMemberById',
    fields: () => ({
      user: { type: userType },
      profile: { type: profileType },
      post: { type: postType },
      memberTypes: { type: new GraphQLList(memberTypeType) }
    })
  });
  
  
  const userProfilePostMemberByIdQuery = {
    type: userProfilePostMemberByIdType,
    args: {
        id: { type: GraphQLString }
      },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const user = await fastify.db.users.findOne({key: 'id', equals: args.id});
      const profile = (await fastify.db.profiles.findMany()).filter(profile => profile.id === args.id);;
      const post = (await fastify.db.posts.findMany()).filter(post => post.id === args.id);;
      const memberTypes = (await fastify.db.memberTypes.findMany()).filter(memberType => memberType.id === args.id);
      return {user: user, profile: profile, posts: post, memberTypes: memberTypes}
    }
  };

  export default userProfilePostMemberByIdQuery;