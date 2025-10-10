"use client";

import { Authenticator as AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { signUp, SignUpInput } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import type React from "react";

function Authenticator({ children }: { children?: React.ReactNode }) {
  const services = {
    async handleSignUp(input: SignUpInput) {
      // custom username and email
      const { username, password } = input;
      if (username.split("@")[1] !== "byu.edu") {
        throw new Error("Please use your BYU email to sign up.");
      }
      return signUp({
        username,
        password,
      });
    },
  };

  const formFields = {
    signIn: {
      username: {
        placeholder: "Enter your BYU email",
      },
    },
    signUp: {
      username: {
        placeholder: "Use your BYU email",
      },
    },
  };

  return (
    <AmplifyAuthenticator
      services={services}
      formFields={formFields}
      className="m-4"
    >
      {({ signOut, user }) => (
        <>
          <h1>Hello {user?.username}</h1>
          <button
            onClick={signOut}
            className="bg-blue-800 text-white p-2 rounded"
          >
            Sign out
          </button>
          {children}
        </>
      )}
    </AmplifyAuthenticator>
  );
}

export default Authenticator;
