import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { postType } from "../types";

const createPostInputType = new GraphQLInputObjectType({
  name: 'createPostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const createPostMutation = {
    type: postType,
    args: {
      input: {type: createPostInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const userData = args.input;
        return await fastify.db.posts.create(userData);
    }
};

export default createPostMutation;