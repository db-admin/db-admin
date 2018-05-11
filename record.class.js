module.exports = class Record {
    /**
     * @param {{id:number, name:string}}} record 
     */
    constructor(record, schema, table) {
        this.id = record.id;
        this.name = record.name;
        this.table = table;
        this.schema = schema;
        this.values = Object.values(record);
        this.original = record;
    }

    /**
     * Updates the attribute at the given index
     * @param {number} attributeIndex the index of the column to update
     * @param {Record} newRecord
     */
    updateValue(attributeIndex, newRecord) {
        this.values[attributeIndex] = newRecord;
    }
}
