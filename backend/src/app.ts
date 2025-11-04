import express, { json } from 'express'
import teamsRouter from './routers/teams'
import meetingsRouter from './routers/meetings'
import config from 'config'
import { sequelize } from './db/sequelize';
import cors from 'cors'

const app = express()


const port = config.get<number>('app.port')
const appName = config.get<string>('app.name')
const secret = config.get<string>('app.secret')

console.log(`app secret is ${secret}`)

app.use(cors())

// post decypher middlewares
app.use(json())

// load routers
app.use('/teams', teamsRouter)
app.use('/meetings', meetingsRouter) // temporary



// synchronize database schema (not data) changes to the database
// i.e syncs our TypeScript models folder into the actual SQL Schema
// sequelize.sync({ force: true })
sequelize.sync({ force: process.argv[2] === 'sync' })

console.log(process.argv)

app.listen(port, () => console.log(`${appName} started on port ${port}`))