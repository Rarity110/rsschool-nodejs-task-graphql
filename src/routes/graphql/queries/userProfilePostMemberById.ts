import { FastifyInstance } from "fastify";
import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
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

  const idInputType = new GraphQLInputObjectType({
    name: 'idInput',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });
  
  
  const userProfilePostMemberByIdQuery = {
    type: userProfilePostMemberByIdType,
    args: {
        input: { type: idInputType }
      },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const id = args.input.id;
      const user = await fastify.db.users.findOne({key: 'id', equals: id});
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      const profile = (await fastify.db.profiles.findMany()).filter(profile => profile.id === id);;
      const post = (await fastify.db.posts.findMany()).filter(post => post.id === id);;
      const memberTypes = (await fastify.db.memberTypes.findMany()).filter(memberType => memberType.id === id);
      return {user: user, profile: profile, posts: post, memberTypes: memberTypes}
    }
  };

  export default userProfilePostMemberByIdQuery;