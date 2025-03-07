import express from "express";
import { join } from "path";
import { cwd } from "process";

export default function server() {
  const app = express();

  app.listen(5000, () => {
    console.log(`Service is running at http://localhost:5000`);
  });

  app.set("view engine", "ejs");
  app.set("views", join(cwd(), "views"));

  return app;
}
