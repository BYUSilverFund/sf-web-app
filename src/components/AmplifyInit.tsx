"use client";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";

export default function AmplifyInit(): null {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfg: any = {
      API: {
        GraphQL: {
          endpoint:
            "https://aiod35xv2nccppo534hy5mnvv4.appsync-api.us-west-2.amazonaws.com/graphql",
          region: "us-west-2",
          defaultAuthMode: "apiKey",
          apiKey: "da2-utguyxkzzfblbn77ugtwmmesg4",
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
