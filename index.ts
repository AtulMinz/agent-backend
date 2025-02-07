import express, { Express, Request, Response } from "express";

const app: Express = express();

const main = () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(8080, () => {
    console.log(`Server running on http://localhost:3000`);
  });
};

main();
