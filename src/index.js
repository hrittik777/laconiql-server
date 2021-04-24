const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

let links = [{
    id: 'link-0',
    url: 'test',
    description: 'Hello World'
}];

let idCount = links.length;
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (parent, args) => {
            return links.find(item => item.id === args.id);
        }
    },

    Mutation: {
        createLink: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };

            links.push(link);
            return link;
        },
        updateLink: (parent, args) => {
            const link = links.indexOf(links.find(item => item.id === args.id));

            if (args.description) {
                links[link].description = args.description;
            }

            if (args.url) {
                links[link].url = args.url;
            }

            return links[link];
        },
        deleteLink: (parent, args) => {
            const link = links.indexOf(links.find(item => item.id === args.id));

            if (link > -1) {
                links.splice(link, 1);
                return true;
            } else {
                return false;
            }
        }
    },
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));