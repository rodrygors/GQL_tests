const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();

app.listen(5000, () => {
  console.log("now listening for requests on port 5000");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.use("/", (req, res) => {
  res.send("Welcome to GraphQL server. Use GraphQL endpoint at /graphql");
});