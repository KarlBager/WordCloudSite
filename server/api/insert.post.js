// server/api/insert.post.js
import mysql from 'mysql2/promise'
import { readBody, createError, setResponseStatus } from 'h3'

// Whitelist: resource -> tabel, kolonner, primærnøgle
const RESOURCES = {
  users:          { table: 'us_users',           cols: ['name','email','password_hash','role'], pk: 'user-id' },
  subjects:       { table: 'us_subjects',        cols: ['display-name','points','current-summarization-id'],           pk: 'subject-id' },
  posts:          { table: 'us_posts',           cols: ['subject-id', 'user-id', 'text', 'points', 'headline'],  pk: 'post-id' },
  comments:       { table: 'us_comments',        cols: ['post-id', 'user_id', 'text'],             pk: 'comment-id' },
  petitions:      { table: 'us_petitions',       cols: ['user_id','title','body'],               pk: 'id' },
  summarizations: { table: 'us_summarizations',  cols: ['post_id','model','summary','meta_json'],pk: 'id' },
  words:          { table: 'us_words',           cols: ['word','count','post_id','subject_id'],  pk: 'id' },
}

async function getConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unges_ordsky',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  })
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.resource || !body.data || typeof body.data !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Body skal indeholde { resource, data }' })
  }

  const spec = RESOURCES[body.resource]
  if (!spec) {
    throw createError({ statusCode: 400, statusMessage: `Resource ${String(body.resource)} er ikke tilladt` })
  }

  // Filtrér kun tilladte kolonner (undgå hasOwnProperty pitfalls)
  const cols = spec.cols.filter((c) => Object.prototype.hasOwnProperty.call(body.data, c))
  if (cols.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Ingen gyldige kolonner i data' })
  }

  const placeholders = cols.map(() => '?').join(', ')
  const values = cols.map((c) => body.data[c])

  const conn = await getConnection()
  try {
    const sql = `INSERT INTO \`${spec.table}\` (${cols.map((c) => `\`${c}\``).join(', ')}) VALUES (${placeholders})`
    const [result] = await conn.execute(sql, values)

    const insertId = result && result.insertId
    setResponseStatus(event, 201)

    if (body.returnRow && insertId) {
      const [rows] = await conn.execute(
        `SELECT * FROM \`${spec.table}\` WHERE \`${spec.pk}\` = ?`,
        [insertId]
      )
      const row = Array.isArray(rows) && rows.length ? rows[0] : null
      return { ok: true, resource: body.resource, id: insertId, row }
    }

    return { ok: true, resource: body.resource, id: insertId }
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: `DB-fejl ved insert i ${spec.table}: ${err && (err.code || err.message)}`,
    })
  } finally {
    await conn.end()
  }
})
