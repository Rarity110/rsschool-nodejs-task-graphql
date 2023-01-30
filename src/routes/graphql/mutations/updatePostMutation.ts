import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { postType } from "../types";

const updatePostInputType = new GraphQLInputObjectType({
  name: 'updatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updatePostMutation = {
    type: postType,
    args: {
      input: {type: updatePostInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const postData = args.input;
        const id = postData.userId;
        const user = await fastify.db.posts.findOne({ key: 'id', equals: id });
        if (!user) {
            throw fastify.httpErrors.badRequest();
        }
        return await fastify.db.posts.change(id, postData);
    }
};

export default updatePostMutation;