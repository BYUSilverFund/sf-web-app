"use client";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";

export default function AmplifyInit(): null {
  useEffect(() => {
    const cfg: any = {
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
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID || "",
          region: process.env.NEXT_PUBLIC_COGNITO_AWS_REGION || "us-west-2",
        },
      },
    };

    try {
      Amplify.configure(cfg as any);
      // Helpful runtime debugging: show the active Amplify config in the browser console
      // (only prints in client runtime).
      // eslint-disable-next-line no-console
      console.log("Amplify configured:", Amplify.getConfig());
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Amplify.configure error:", err);
    }
  }, []);

  return null;
}
