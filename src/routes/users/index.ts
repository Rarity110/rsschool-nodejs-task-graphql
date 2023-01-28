import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    const users = await fastify.db.users.findMany();
    return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
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
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = request.body;
      const newUser = await fastify.db.users.create(user);
      return newUser;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      
      if (!uuidValidate(id) || uuidVersion(id) !== 4) {
        throw fastify.httpErrors.badRequest();
      }
      

      const user = await fastify.db.users.findOne({ key: 'id', equals: id });

      if (!user) {
        throw fastify.httpErrors.notFound();
      }

      const userSubscribers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: id })

      for (const userSubscriber of userSubscribers) {

        const followers = userSubscriber.subscribedToUserIds;
        const index = followers.indexOf(id);

        if (index !== -1) {
          followers.splice(index, 1);
        }

        await fastify.db.users.change(userSubscriber.id, userSubscriber);

      };

      const userPosts = await fastify.db.posts.findMany({ key: 'userId', equals: id });

      for (const userPost of userPosts) {
        await fastify.db.posts.delete(userPost.id);
      }

      const userProfiles = await fastify.db.profiles.findMany({ key: 'userId', equals: id });

      for (const userProfile of userProfiles) {
        await fastify.db.profiles.delete(userProfile.id);
      }

      const deleteUser = await fastify.db.users.delete(id);

      return deleteUser;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;
      const userID = request.body.userId;
      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }
      const userIDSubscribes = await fastify.db.users.findOne({ key: 'id', equals: userID });
      if (!userIDSubscribes) {
        throw fastify.httpErrors.badRequest();
      }
      
      userIDSubscribes.subscribedToUserIds.push(id);
      await fastify.db.users.change(userID, userIDSubscribes)
      return user;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userIdToUnsubscribe = request.params.id;
      const userId = request.body.userId;
      const userToUnsubscribe = await fastify.db.users.findOne({ key: 'id', equals: userIdToUnsubscribe });
      if (!userToUnsubscribe) {
        throw fastify.httpErrors.notFound();
      }

      const user = await fastify.db.users.findOne({ key: 'id', equals: userId });
      if (!user) {
        throw fastify.httpErrors.notFound();
      }

      const userIdSubscribers = user.subscribedToUserIds;

      if (!userIdSubscribers.includes(userIdToUnsubscribe)) {
        throw fastify.httpErrors.badRequest();
      }
      
      const index = userIdSubscribers.indexOf(userIdToUnsubscribe);
      if (index !== -1) {
        userIdSubscribers.splice(index, 1);
      }

      await fastify.db.users.change(userId, user);

      return user;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const id = request.params.id;

      const user = await fastify.db.users.findOne({ key: 'id', equals: id });
      if (!user) {
        throw fastify.httpErrors.badRequest();
      }
      const changeUser = await fastify.db.users.change(id, request.body);
      
      return changeUser;
    }
  );
};

export default plugin;
