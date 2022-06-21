const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const app = new Koa();
const Message = require('./message')

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

const messagesList = {
    status: 'ok',
    timestamp: new Date().getTime(),
    messages: []
}


router.get('/messages/unread', async (ctx) => {
    for (let i = 0; i < 2; i++){
        messagesList.messages.push(new Message().returnObj())
    }

    ctx.response.body = JSON.stringify(messagesList)
    console.log('response complete')
})

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
server.listen(port);
