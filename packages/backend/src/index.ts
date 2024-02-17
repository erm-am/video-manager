import { setupWebServer } from './server.js';
import { setupWebSockets } from './sockets/index.js';

setupWebServer()
  .then((webServer) => {
    return setupWebSockets(webServer);
  })
  .then((webServerWithSockets) => {
    webServerWithSockets.listen({ port: 4000 });
  })
  .catch((error) => {
    console.log(error);
  });
