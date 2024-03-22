import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function userRoutes(app: FastifyInstance) {
  app.get('/',
    async () => {
      const users = await knex('users')
        .select()

      return {
        users,
      }
    }
  )

  app.get('/:id',
    async (request) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamsSchema.parse(request.params)

      const transaction = await knex('users')
        .where('id', id)
        .first()

      return {
        transaction
      }
    }
  )

  app.post('/',
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
      })

      const { name } = createUserBodySchema.parse(request.body)

      await knex('users').insert({
        id: randomUUID(),
        name,
      })

      return reply.status(201).send()
    }
  )
}