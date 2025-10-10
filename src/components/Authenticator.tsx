"use client";

import { Authenticator as AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { signUp, SignUpInput, signIn, SignInInput } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import type React from "react";

function Authenticator({ children }: { children?: React.ReactNode }) {
  // frontend email domain check
  const services = {
    async handleSignUp(input: SignUpInput) {
      const { username, password } = input;
      const domains = ["byu.edu", "student.byu.edu"];
      if (!domains.includes(username.split("@")[1])) {
        throw new Error("Please use your BYU email to sign up.");
      }
      return signUp({
        username,
        password,
      });
    },
    async handleSignIn(input: SignInInput) {
      const { username, password } = input;
      const domains = ["byu.edu", "student.byu.edu"];
      if (!domains.includes(username.split("@")[1])) {
        throw new Error("Please use your BYU email to sign in.");
      }
      return signIn({
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
          <div className="text-right m-2 space-y-2">
            <p>You are signed in</p>
            <button
              onClick={signOut}
              className="bg-blue-900 text-white p-2 rounded"
            >
              Sign Out
            </button>
          </div>
          {children}
        </>
      )}
    </AmplifyAuthenticator>
  );
}

export default Authenticator;
