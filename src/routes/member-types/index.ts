import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<MemberTypeEntity[]> {
    const users = await fastify.db.memberTypes.findMany();
    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const id = request.params.id;
      const user = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const id = request.params.id;
      const user = await fastify.db.memberTypes.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const changeUser = await fastify.db.memberTypes.change(id, request.body);
      return changeUser;
    }
  );
};

export default plugin;
