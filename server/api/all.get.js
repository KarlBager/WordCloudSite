import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unges_ordsky',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  })

  const [users]          = await connection.query('SELECT * FROM `us_users`')
  const [subjects]       = await connection.query('SELECT * FROM `us_subjects`')
  const [posts]          = await connection.query('SELECT * FROM `us_posts`')
  const [comments]       = await connection.query('SELECT * FROM `us_comments`')
  const [petitions]      = await connection.query('SELECT * FROM `us_petitions`')
  const [summarizations] = await connection.query('SELECT * FROM `us_summarizations`')
  const [words]          = await connection.query('SELECT * FROM `us_words`')

  await connection.end()

  return { users, subjects, posts, comments, petitions, summarizations, words }
})
