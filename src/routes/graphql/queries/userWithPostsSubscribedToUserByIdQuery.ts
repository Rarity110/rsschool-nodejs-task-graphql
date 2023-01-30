import { FastifyInstance } from "fastify";
import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
// import { postType, userType } from "../types";

const userWithPostsSubscribedToUserByIdType: any = new GraphQLObjectType({
  name: 'userWithPostsSubscribedToUserByIdType',
  fields: () => ({
    id: { 
      type: GraphQLID,
      description: 'The id of the user.',
    }!,
    firstName: { 
      type: GraphQLString,
      description: 'The name of the user.',
    }!,
    lastName: {
      type: GraphQLString,
      description: 'The lastname of the user.',
    }!,
    email: {
      type: GraphQLString,
      description: 'The email of the user.',
    }!,
    // posts: {
    //   type: new GraphQLList(postType),
    //   description: 'All posts of the user.',
    //   resolve: async (user: any, args: any, fastify: any) => {
    //     return await fastify.db.posts.findMany({key: 'userId', equals: user.id});
    //   }
    // }!,
    // userSubscribedTo: {
    //   type: new GraphQLList(userType),
    //   description: 'Users that the current user is following.',
    //   resolve: async (user: any, args: any, fastify: any) => {
    //     return await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id});
    //   }
    // }!,
  })
});

const userWithPostsSubscribedToUserByIdQueryType = new GraphQLObjectType({
    name: 'userWithPostsSubscribedToUserById',
    fields: () => ({
      user: { type: userWithPostsSubscribedToUserByIdType }!,
    })
  });
  
  
  const userWithPostsSubscribedToUserByIdQuery = {
    type: userWithPostsSubscribedToUserByIdQueryType,
    args: {
        id: { type: GraphQLString }
      },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const user = await fastify.db.users.findOne({key: 'id', equals: args.id});
      return {user: user}
    }
  };

  export default userWithPostsSubscribedToUserByIdQuery;