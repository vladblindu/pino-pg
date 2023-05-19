import {spawn} from "child_process"
import concat from "concat-stream"
import {Client} from "pg"

const createProcess = (processPath: string, args: string[] = [], env: any = {}) => {
    args = [processPath].concat(args);

    return spawn('node', args, {
        env: {
            ...env,
            NODE_END: 'test',
            PATH: process.env.PATH
        }
    })
}
export const execute = (pipedContent: string = '') => {
    const childProcess = createProcess('index.js')
    childProcess.stdin.setDefaultEncoding('utf-8')
    return new Promise((resolve: (out: string) => void, reject) => {
        childProcess.stderr.once('data', err => reject(new Error(err.toString())))
        childProcess.on('error', (err: string) => reject(new Error(err)))
        childProcess.stdout.pipe(concat(buffer => resolve(buffer.toString())))
        childProcess.stdin.write(`${pipedContent}\n`)
        childProcess.stdin.end()
    })
}

export const dbReset = async (table: string, client: Client) => {
    try {
        await client.query(`TRUNCATE ${table};`)
    } catch (e) {
        console.warn(`Unable to cleanup ${table} table.`)
    }
}