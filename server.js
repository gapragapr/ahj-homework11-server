const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const uuid = require('uuid');
const { faker } = require('@faker-js/faker');
const app = new Koa();

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const router = new Router();
const server = http.createServer(app.callback());

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

const messagesList = {
    status: 'ok',
    timestamp: new Date().getTime(),
    messages: []
}


router.get('/messages/unread', async (ctx, next) => {
    for (let i = 0; i < 2; i++){
        messagesList.messages.push(new Message().returnObj())
    }

    ctx.response.body = JSON.stringify(messagesList)
})

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
server.listen(port);
