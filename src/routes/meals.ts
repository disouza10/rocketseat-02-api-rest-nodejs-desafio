import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/',
    {
      preHandler: [
        checkSessionIdExists
      ]
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .select()

      return {
        meals,
      }
    }
  )

  app.get('/:id',
    {
      preHandler: [
        checkSessionIdExists
      ]
    }, 
    async (request) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where({
          id,
          session_id: sessionId
        })
        .first()

      return {
        meal
      }
    }
  )

  app.post('/', 
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        datetimeMeal: z.string(),
        insideDiet: z.enum(['true', 'false']),
      })

      const { name, description, datetimeMeal, insideDiet } = createMealBodySchema.parse(request.body)

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
      }

      await knex('meals').insert({
        id: randomUUID(),
        session_id: sessionId,
        name: name,
        description: description,
        datetime_meal: datetimeMeal,
        inside_diet: insideDiet,
      })
    
      return reply.status(201).send()
    }
  )
}