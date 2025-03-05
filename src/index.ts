import createContainer from "./container.js";
import controller from "./controller.js";
import server from "./server.js";

export default async function start() {
  const container = createContainer({ server, controller });

  return container;
}
