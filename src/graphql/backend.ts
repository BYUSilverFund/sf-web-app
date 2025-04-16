import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import gql from "graphql-tag";

const awsconfig = {
  aws_appsync_graphqlEndpoint:
    "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql",
  aws_appsync_region: "us-west-2",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-udsupx5mc5atlhdbwa35uckq6a",
};

Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql",
      defaultAuthMode: "apiKey",
      apiKey: "da2-udsupx5mc5atlhdbwa35uckq6a", // Optional
      region: "us-west-2", // Optional
      customEndpoint:
        "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql", // Optional
      customEndpointRegion: "us-west-2", // Optional
    },
  },
});

export const getAlumniInfo = async () => {
  const client = generateClient();
  const result = await client.graphql({
    query: gql`
      query listSilverFundAlumniInfos {
        listSilverFundAlumniInfos {
          items {
            name
            current_position
            current_company
            graduation_year
            profile_url
          }
        }
      }
    `,
    authMode: "apiKey",
  });

  return (result as any).data.listSilverFundAlumniInfos.items;
};
