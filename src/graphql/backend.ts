import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import gql from "graphql-tag";

Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql",
      defaultAuthMode: "apiKey",
      apiKey: "da2-udsupx5mc5atlhdbwa35uckq6a",
      region: "us-west-2",
      customEndpoint:
        "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql",
      customEndpointRegion: "us-west-2",
    },
  },
});


export interface AlumniInfo {
  name: string;
  current_position: string;
  current_company: string;
  graduation_year: string;
  profile_url: string;
}

interface ListSilverFundAlumniInfosResponse {
  data: {
    listSilverFundAlumniInfos: {
      items: AlumniInfo[];
    };
  };
}

export const getAlumniInfo = async (): Promise<AlumniInfo[]> => {
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

  return (result as ListSilverFundAlumniInfosResponse).data.listSilverFundAlumniInfos.items;
};
