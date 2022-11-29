import dotenv from "dotenv"
import { Pool } from "pg"
import { ProcessedRows } from "./index"

dotenv.config()

const pool = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT!),
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1000
})


const selectFromPendingData =  async(): Promise<ProcessedRows> => {
  const res = await pool.query("SELECT id, priority, int_k, str_d FROM pending_data ORDER BY priority DESC, timestamp ASC")
  return res.rows as ProcessedRows
}

const partialSelectFromPendingData = async(): Promise<ProcessedRows> => {
  const res = await pool.query("SELECT id, int_k, str_d FROM pending_data ORDER BY priority DESC, timestamp ASC LIMIT 15")
  return res.rows as ProcessedRows
}

const deleteFromPendingData = async(id: number): Promise<void> => {
  await pool.query("DELETE FROM pending_data WHERE id = $1", [id])
}

const insertIntoPendingData = async(priority: number, int_k: number, str_d: string, timestamp: Date): Promise<void> => {
  await pool.query("INSERT INTO pending_data (priority, int_k, str_d, timestamp) VALUES ($1, $2, $3, $4) RETURNING id, int_k, str_d", [priority, int_k, str_d, timestamp])
}

const selectFromProcessedData =  async(input: { timestamp?: Date, limit?: number}): Promise<ProcessedRows | string> => {
  if (!input.timestamp && !input.limit) {
    const res = await pool.query("SELECT id, int_k, str_d, timestamp FROM processed_data ORDER BY timestamp ASC, id ASC")
    return res.rows as ProcessedRows
  } else if (input.timestamp && !input.limit) {
    const res = await pool.query("SELECT id, int_k, str_d, timestamp FROM processed_data WHERE timestamp >=  $1 ORDER BY timestamp ASC, id ASC", [input.timestamp])
    return res.rows as ProcessedRows
  } else if (!input.timestamp && input.limit) {
    const res = await pool.query("SELECT id, int_k, str_d, timestamp FROM processed_data ORDER BY timestamp ASC, id ASC LIMIT $1", [input.limit])
    return res.rows as ProcessedRows
  } else if (input.timestamp && input.limit) {
    const res = await pool.query("SELECT id, int_k, str_d, timestamp FROM processed_data WHERE timestamp >= $1 ORDER BY timestamp ASC, id ASC LIMIT $2", [input.timestamp, input.limit])
    return res.rows as ProcessedRows
  } return "error in selectFromProcessedData"
}

const insertIntoProcessedData = async(int_k: number, str_d: string, timestamp: Date): Promise<void> => {
  await pool.query("INSERT INTO processed_data (int_k, str_d, timestamp) VALUES ($1, $2, $3) RETURNING id, int_k, str_d", [int_k, str_d, timestamp])
}

export {
  deleteFromPendingData,
  partialSelectFromPendingData,
  insertIntoPendingData,
  selectFromPendingData,
  selectFromProcessedData,
  insertIntoProcessedData
}
