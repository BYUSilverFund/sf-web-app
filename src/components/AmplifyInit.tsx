"use client";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";

export default function AmplifyInit(): null {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfg: any = {
      API: {
        GraphQL: {
          endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "",
          region: "us-west-2",
          defaultAuthMode: "apiKey",
          apiKey: process.env.NEXT_PUBLIC_GRAPHQL_API_KEY || "",
        },
      },
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID || "",
          region: process.env.NEXT_PUBLIC_COGNITO_REGION || "us-west-2",
        },
      },
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Amplify.configure(cfg as any);
    } catch (err) {
      console.error("Amplify.configure error:", err);
    }
  }, []);

  return null;
}
