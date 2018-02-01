const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info);
    },
    state(parent, args, ctx, info) {
      return ctx.db.query.states(info);
    },
    individual(parent, args, ctx, info) {
      return ctx.db.query.individuals(info);
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info);
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id } }, info);
    }
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
            isPublished: false
          }
        },
        info
      );
    },
    createState(parent, { title, code }, ctx, info) {
      return ctx.db.mutation.createState(
        {
          data: {
            title,
            code
          }
        },
        info
      );
    },
    createIndividual(parent, args, ctx, info) {
      return ctx.db.mutation.createIndividual(
        {
          data: {
            firstname: args.input.firstname,
            middlename: args.input.middlename,
            lastname: args.input.lastname,
            tin: args.input.tin,
            gender: args.input.gender,
            phone: args.input.phone,
            email: args.input.email,
            maritalstatus: args.input.maritalstatus,
            dateofbirth: args.input.dateofbirth,
            address: args.input.address,
            street: args.input.street,
            lga: args.input.lga,
            occupation: args.input.occupation,
            employeestatus: args.input.employeestatus,
            employer: args.input.employer,
            language: args.input.language,
            marketassociation: args.input.marketassociation,
            parkassociation: args.input.parkassociation
          }
        },
        info
      );
    },
    deleteIndividual(parent, { title }, ctx, info) {
      return ctx.db.mutation.deleteIndividual({ where: { id } }, info);
    },
    deleteState(parent, { title }, ctx, info) {
      return ctx.db.mutation.deleteState({ where: { title } }, info);
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info);
    },
    updateState(parent, args, ctx, info) {
      const title = args.title,
        newTitle = args.input.title,
        code = args.input.code;

      return ctx.db.mutation.updateState(
        {
          where: { title },
          data: {
            title: newTitle,
            code
          }
        },
        info
      );
    },
    updateIndividual(parent, args, ctx, info) {
      return ctx.db.mutation.updateIndividual(
        {
          where: { id },
          data: {
            id: args.input.id,
            first_name: args.input.first_name,
            middle_name: args.input.middle_name,
            last_name: args.input.last_name,
            tin: args.input.tin,
            gender: args.input.gender,
            phone: args.input.phone,
            email: args.input.email,
            marital_status: args.input.marital_status,
            date_to_birth: args.input.date_to_birth,
            address: input.args.address,
            street: args.input.street,
            nationality: args.input.nationality,
            state: args.input.state,
            lga: args.input.lga,
            occupation: args.input.occupation,
            employee_status: args.input.employee_status,
            employer: args.input.employer,
            language: args.input.language,
            market_association: args.input.market_association,
            park_association: args.input.park_association
          }
        },
        info
      );
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/public-firehide-928/test/dev", // the endpoint of the Prisma DB service
      secret: "mysecret123", // specified in database/prisma.yml
      debug: true // log all GraphQL queryies & mutations
    })
  })
});

server.start(() => console.log("Server is running on http://localhost:4000"));
