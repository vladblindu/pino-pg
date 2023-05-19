import {Client} from 'pg'
import {database, host, idCol, password, port, table, user} from "../src/config"
import {dbReset, execute} from "./__fixtures__/setup"
import {expect} from "chai"

describe('method transport', () => {

    const client = new Client({
        host,
        port,
        user,
        password,
        database
    })


    it('should store a simple log', async () => {

        await client.connect()

        const logEntry = {
            severity: 'INFO',
            category: 'DEV',
            message: 'test message',
            vars: '{}',
            notify: 'CLIENT'
        }
        await dbReset(table, client)
        await execute(JSON.stringify(logEntry))
        const result = await client.query(
            `SELECT *
             FROM ${table}
             ORDER BY ${idCol} DESC
             LIMIT 1`)
        if (result.rows && result.rows.length && result.rows[0]['created_at'])
            delete result.rows[0]['created_at']
        delete result.rows[0]['id']
        expect(result.rows[0]).to.deep.eq(logEntry)
    })
})