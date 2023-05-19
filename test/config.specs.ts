import {Columns} from "../src/config"
import {expect} from "chai"

describe(' class Columns', () => {

    it('should generate proper column string', () => {

        const tCols = {
            col1: "text",
            col2: '',
            col3: "int",
            col4: "text"
        }

        const columns = new Columns(tCols)

        expect(columns.toString).to.eq('col1, col2, col3, col4')
    })

    it('should generate proper query params', () => {

        const tCols = {
            col1: "text",
            col2: '',
            col3: "int",
            col4: "text"
        }

        const columns = new Columns(tCols)

        expect(columns.toParams).to.eq('$1::text, $2, $3::int, $4::text')
    })

})