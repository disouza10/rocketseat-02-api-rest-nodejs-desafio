// eslint-disable-next-line
import { Knex } from "knex"

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      amount: number
      created_at: string
      updated_at: string
      session_id?: string
    },
    meals: {
      id: string
      name: string
      description: string
      datetime_meal: string
      inside_diet: string
      created_at: string
      updated_at: string
      session_id?: string
    }
  }
}