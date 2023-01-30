import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { userType } from "../types";

const usersWithPostsProfileMemberTypeType = new GraphQLObjectType({
    name: 'usersWithPostsProfileMemberType',
    fields: () => ({
        users: { type: new GraphQLList(userType) },
      })
  });
  
  
  const usersWithPostsProfileMemberTypeQuery = {
    type: usersWithPostsProfileMemberTypeType,
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const users =  await fastify.db.users.findMany();
        return { users: users};
    }
  };

  export default usersWithPostsProfileMemberTypeQuery;