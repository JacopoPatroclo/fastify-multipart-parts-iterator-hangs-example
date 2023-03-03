import fastify from "fastify";
import mult from "@fastify/multipart";

async function main() {
  const app = fastify({ logger: true });
  app.register(mult);

  app.post("/test", async (request, res) => {
    let file;
    const parts = request.parts();

    const accumulator = {};

    for await (const part of parts) {
      console.log("read parts", part.fieldname);
      if (!part.file) {
        accumulator[part.fieldname] = part.value;
      } else {
        file = part;
      }
    }

    console.log("never reach this point, async iterator keeps hanging");

    res.send({
      hello: "fastify",
    });
  });

  await app.listen({
    port: 3000,
    host: "0.0.0.0",
  });

  console.log(
    "App Started, call http://localhost:3000/test with a form-data request to reproduce the issue"
  );
}

main().then().catch(console.error);
