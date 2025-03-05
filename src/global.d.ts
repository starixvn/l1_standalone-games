import { Container } from "awilix";
import { Application } from "express";

declare global {
  type Context = {
    container: Container;
    server: Application;
  };
}

export {};
