const graphql = require('graphql');
const Article = require('../models/article');
const Contributor = require('../models/contributor');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema} = graphql;

let articles = [
    { name: 'The History of Node.js', topic: 'Node.js', date: '2020-08-25T00:00:00Z', id:"1", contributorId:"1"},
    { name: 'Understanding Docker Concepts', topic: 'Containers', date: '2020-07-23T00:00:00Z', id:"2", contributorId:"2"},
    { name: 'Linting in Node.js using ESLint', topic: 'Node.js', date: '2020-08-24T00:00:00Z', id:"3", contributorId:"2"},
    { name: 'REST APIs - Introductory guide', topic: 'API', date: '2020-06-26T00:00:00Z', id:"4", contributorId:"1"},
];

let contributors = [
    { name: 'John Doe', url: '/john-doe', major: 'Computer Science', id:"1"},
    { name: 'Jane Doe', url: '/jane-doe', major: 'Physics', id:"2"},
];

const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: ( ) => ({
        id: { type: graphql.GraphQLID },
        name: { type: GraphQLString },
        topic: { type: GraphQLString },
        date: { type: GraphQLString },
        contributorId: { type: GraphQLID },
        contributor: {
            type: ContributorType,
            resolve(parent, args){
                return Contributor.findById(args.id)
            }
        }
    })
});

const ContributorType = new GraphQLObjectType({
    name: 'Contributor',
    fields: ( ) => ({
        id: { type: graphql.GraphQLID },
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        major: { type: graphql.GraphQLString },
        articles:{
            type: new GraphQLList(ArticleType),
            resolve(parent, args){
                Article.find({contributorId:parent.id})
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        status: {
            type:GraphQLString,
            resolve(parent, args){
                return 'Welcome to GraphQL'
            }
        },
        article: {
            /*
            Example query:
            {
                article (id:1){
                    name,
                    contributorId
                }
            }
            */ 
            type:ArticleType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                Article.findById(args.id)
            }
        },
        contributor: {
            type:ContributorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                Contributor.findById(parent.contributorId)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});