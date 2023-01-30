import {GraphQLList, GraphQLString} from "graphql";
import {FastifyInstance} from "fastify";
import { memberTypeType, postType, profileType, userType } from "../types";

type userCreateType = {
  firstName: string,
  lastName: string,
  email: string,
}

const userQuery = {
  type: userType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    return await fastify.db.users.findOne({key: 'id', equals: args.id});
  }
};

const usersQuery = {
    type: new GraphQLList(userType),
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      return await fastify.db.users.findMany();
    }
};

const profileQuery = {
    type: profileType,
    args: {
      id: { type: GraphQLString }
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      return await fastify.db.profiles.findOne({ key: 'id', equals: args.id });
    }
};

const profilesQuery = {
    type: new GraphQLList(profileType),
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      return await fastify.db.profiles.findMany();
    }
};


const postQuery = {
  type: postType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    return await fastify.db.posts.findOne({ key: 'id', equals: args.id });
  }
};

const postsQuery = {
  type: new GraphQLList(postType),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    return await fastify.db.posts.findMany();
  }
};

const memberTypeQuery = {
  type: memberTypeType,
  args: {
    id: { type: GraphQLString }
  },
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    return await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });
  }
};

const memberTypesQuery = {
  type: new GraphQLList(memberTypeType),
  resolve: async (_: any, args: any, fastify: FastifyInstance) => {
    return await fastify.db.memberTypes.findMany();
  }
};

const createUserQuery = (firstName: string, lastName: string, email: string): void => {
    resolve: async (_: any, args: userCreateType, fastify: FastifyInstance) => {
    return await fastify.db.users.create(args);
  }
};



export { createUserQuery, memberTypeQuery, memberTypesQuery, postQuery, postsQuery, profileQuery, profilesQuery, userQuery, usersQuery };