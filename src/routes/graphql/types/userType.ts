import {GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import { memberTypeType, postType, profileType } from "../types";

const userType: any = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { 
      type: GraphQLID,
      description: 'The id of the user.',
    }!,
    firstName: { 
      type: GraphQLString,
      description: 'The name of the user.',
    },
    lastName: {
      type: GraphQLString,
      description: 'The lastname of the user.',
    },
    email: {
      type: GraphQLString,
      description: 'The email of the user.',
    },
    subscribedToUser: { 
      type: new GraphQLList(GraphQLInt),
      description: ' Users who are following the current user.',
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      description: 'Users that the current user is following.',
      resolve: async (user: any, args: any, fastify: any) => {
        return await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id});
      }
    },
    posts: {
      type: new GraphQLList(postType),
      description: 'All posts of the user.',
      resolve: async (user: any, args: any, fastify: any) => {
        return await fastify.db.posts.findMany({key: 'userId', equals: user.id});
      }
    },
    profile: {
      type: profileType,
      description: 'Profile of the user.',
      resolve: async (user: any, args: any, fastify: any) => {
        return await fastify.db.profiles.findOne({key: 'userId', equals: user.id});
      }
    },
    memberType: {
      type: memberTypeType,
      description: 'A memberType of the user.',
      resolve: async (user: any, args: any, fastify: any) => {
        // const profile = await fastify.db.profiles.findOne({key: 'userId', equals: user.id});
        // if (!profile) return Promise.resolve(null);
        return await fastify.db.memberTypes.findOne({key: 'id', equals: user.id});
      }
    },
  })
});

export default userType;