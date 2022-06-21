const { faker } = require('@faker-js/faker');
const uuid = require('uuid');

class Message{
    constructor(){
        this.id = uuid.v4(),
        this.from = faker.internet.email(),
        this.subject = `Hello from ${faker.name.firstName()}`,
        this.body = faker.lorem.paragraph(2),
        this.received = faker.date.recent()
    }

    returnObj(){
        return {
            id: this.id,
            from: this.from,
            subject: this.subject,
            body: this.body,
            received: this.received
        }
    }
}

module.exports = Message