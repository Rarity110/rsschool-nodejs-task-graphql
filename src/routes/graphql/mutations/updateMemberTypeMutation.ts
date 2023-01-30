import { GraphQLInputObjectType, GraphQLInt, GraphQLNonNull, GraphQLString } from "graphql";
import { FastifyInstance } from "fastify";
import { memberTypeType } from "../types";

const updateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'updateMemberTypeInput',
  fields: () => ({
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updateMemberTypeMutation = {
    type: memberTypeType,
    args: {
      input: {type: updateMemberTypeInputType },
    },
    resolve: async (_: any, args: any, fastify: FastifyInstance) => {
        const memberTypeData = args.input;
        const id = memberTypeData.memberTypeId;
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });
        if (!memberType) {
          throw fastify.httpErrors.badRequest();
        }
        return await fastify.db.memberTypes.change(id, memberTypeData);


       
    }
};

export default updateMemberTypeMutation;