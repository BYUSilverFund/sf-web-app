import { generateClient } from "aws-amplify/api";

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
    query: /* GraphQL */ `
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

  return (result as ListSilverFundAlumniInfosResponse).data
    .listSilverFundAlumniInfos.items;
};
