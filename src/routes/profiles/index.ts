import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    const users = await fastify.db.profiles.findMany();
    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      const user = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.body.userId;
      if (!id) {
        throw fastify.httpErrors.notFound();
      }
      const user = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      const user = await fastify.db.profiles.findOne({ key: 'id', equals: id });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const deleteUser = await fastify.db.profiles.delete(id);
      return deleteUser;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const id = request.params.id;
      const user = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const changeUser = await fastify.db.profiles.change(id, request.body);
      return changeUser;
    }
  );
};

export default plugin;
