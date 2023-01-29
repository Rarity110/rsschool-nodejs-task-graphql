import { FastifyInstance } from "fastify";
import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { profileType, userType } from "../types";

const userWithProfileUserSubscribedToType: any = new GraphQLObjectType({
    name: 'userWithProfileUserSubscribedTo',
    fields: () => ({
      id: { 
        type: GraphQLID,
        description: 'The id of the user.',
      },
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
      userSubscribedTo: {
        type: new GraphQLList(userType),
        description: 'Users that the current user is following.',
        resolve: async (user: any, args: any, fastify: any) => {
          return await fastify.db.users.findMany({key: 'subscribedToUserIds', inArray: user.id});
        }
      }!,
      profile: {
        type: profileType,
        description: 'Profile of the user.',
        resolve: async (user: any, args: any, fastify: any) => {
          return await fastify.db.profiles.findOne({key: 'userId', equals: user.id});
        }
      }!,
    })
  });

const usersWithProfileUserSubscribedToType = new GraphQLObjectType({
    name: 'usersWithProfileUserSubscribedTo',
    fields: () => ({
        users: { type: new GraphQLList(userWithProfileUserSubscribedToType) },
      })
  });
  
  
  const usersWithProfileUserSubscribedToQuery = {
    type: usersWithProfileUserSubscribedToType,
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const users =  await fastify.db.users.findMany();
        return { users: users};
    }
  };

  export default usersWithProfileUserSubscribedToQuery;