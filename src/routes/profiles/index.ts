import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {

    const profiles = await fastify.db.profiles.findMany();
    return profiles;

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

      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });

      if (!profile) {
        throw fastify.httpErrors.notFound();
      }

      return profile;
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

      const profileData = request.body;
      const userId = request.body.userId;
      const memberTypeId = request.body.memberTypeId;

      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });

      const profileById = await fastify.db.profiles.findOne({ key: 'userId', equals: userId });

      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

      if (!memberType || !user || profileById) {
        throw fastify.httpErrors.badRequest();
      }

      const createProfile = await fastify.db.profiles.create(profileData);

      return createProfile;
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
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });

      if (!profile) {
        throw fastify.httpErrors.badRequest();
      }
      const deleteProfile = await fastify.db.profiles.delete(id);
      return deleteProfile;
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
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) {
        throw fastify.httpErrors.badRequest();
      }
      const changeProfile = await fastify.db.profiles.change(id, request.body);
      return changeProfile;
    }
  );
};

export default plugin;
