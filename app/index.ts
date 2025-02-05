import express, { Express, Request, Response } from "express";

const app: Express = express();

const main = () => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(8080, () => {
    console.log("Server is running on port 3000");
  });
};

main();
