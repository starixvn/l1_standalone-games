import express from "express";

export default function server() {
  const app = express();

  app.listen(5000, () => {
    console.log(`Service is running at http://localhost:5000`);
  });

  return app;
}
