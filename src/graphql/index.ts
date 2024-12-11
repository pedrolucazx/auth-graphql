import resolversProfile from './resolvers/profile.resolver';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';

const typesArray = loadFilesSync(path.join(__dirname, '../graphql/schemas'), {
  extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = { ...resolversProfile };

export { resolvers, typeDefs };