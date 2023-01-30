import { FastifyInstance } from "fastify";
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../types";

const userWithPostsProfileMemberTypeType = new GraphQLObjectType({
    name: 'userWithPostsProfileMemberType',
    fields: () => ({
      user: { type: userType },
    })
  });

  const idInputType = new GraphQLInputObjectType({
    name: 'idInputUser2',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });
  
  
  const userWithPostsProfileMemberTypeQuery = {
    type: userWithPostsProfileMemberTypeType,
    args: {
      input: { type: idInputType }
      },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
      const id = args.input.id;
      const user = await fastify.db.users.findOne({key: 'id', equals: id});
      return {user: user}
    }
  };

  export default userWithPostsProfileMemberTypeQuery;