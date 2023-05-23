import { GraphQLClient } from 'graphql-request'

export const fetchCmsQuery = async (query, variables) => {
  try {
    const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_CONTENTFUL_SPACE_ID}/environments/master`
    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${
          variables.preview
            ? process.env.NEXT_CONTENTFUL_PREVIEW_TOKEN
            : process.env.NEXT_CONTENTFUL_ACCESS_TOKEN
        }`,
      },
    })
    return await graphQLClient.request(query, variables)
  } catch (error) {
    console.error(
      `There was a problem retrieving entries with the query ${query}`
    )
    console.error(error)
  }
}
