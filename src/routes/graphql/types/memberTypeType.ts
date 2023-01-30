import { GraphQLID, GraphQLInt, GraphQLObjectType } from 'graphql';

const memberTypeType: any = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  })
});

export default memberTypeType;