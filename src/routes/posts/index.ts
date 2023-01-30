import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    const users = await fastify.db.posts.findMany();
    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      const user = await fastify.db.posts.findOne({ key: 'id', equals: id });
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
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const userData = request.body;
      const postUser = await fastify.db.posts.create(userData);
      return postUser;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      const user = await fastify.db.posts.findOne({ key: 'id', equals: id });

      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const deleteUser = await fastify.db.posts.delete(id);
      return deleteUser;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const id = request.params.id;
      const user = await fastify.db.posts.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const changeUser = await fastify.db.posts.change(id, request.body);
      return changeUser;
    }
  );
};

export default plugin;
