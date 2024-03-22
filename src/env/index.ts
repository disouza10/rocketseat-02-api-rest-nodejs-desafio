import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test'})
} else {
  config()
}

// Definir o formato dos dados
// Um único schema para todas as variáveis
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

// o _ serve como se fosse uma variável "provisória"
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data