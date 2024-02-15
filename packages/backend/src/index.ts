import { server } from './server.js';

server()
  .then((server) => {
    server.listen({ port: 4000 });
  })
  .catch((error) => {
    console.log(error);
  });
