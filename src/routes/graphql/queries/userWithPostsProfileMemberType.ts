import { FastifyInstance } from "fastify";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../types";

const userWithPostsProfileMemberTypeType = new GraphQLObjectType({
    name: 'userWithPostsProfileMemberType',
    fields: () => ({
      user: { type: userType },
    })
  });
  
  
  const userWithPostsProfileMemberTypeQuery = {
    type: userWithPostsProfileMemberTypeType,
    args: {
        id: { type: GraphQLString }
      },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const user = await fastify.db.users.findOne({key: 'id', equals: args.id});
      return {user: user}
    }
  };

  export default userWithPostsProfileMemberTypeQuery;