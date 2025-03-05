import type { AwilixContainer } from "awilix";

import { asFunction, asValue, createContainer, InjectionMode } from "awilix";

export type Container = AwilixContainer;

export default function container(...modules: Record<string, any>[]) {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  container.register("container", asValue(container));

  for (const module of modules) {
    for (const entry of Object.entries(module)) {
      const [key, loader] = entry;

      if (typeof loader === "function") {
        container.register(key, asFunction(loader).singleton());
      } else {
        container.register(key, asValue(loader));
      }
    }
  }

  for (const module of modules) {
    for (const key of Object.keys(module)) {
      container.resolve(key);
    }
  }

  return container;
}
