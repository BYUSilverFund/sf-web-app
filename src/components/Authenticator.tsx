"use client";

import { Authenticator as AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { signUp, SignUpInput, signIn, SignInInput } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import type React from "react";
import "@/app/amplify.css";
import "@/images/sf-logo-blue.png";

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
      className="auth-shell"
      components={{
        Header() {
          return (
            <div className="auth-shell__logo">
              <img
                src="/sf-logo-blue.png"
                alt="BYU Silver Fund"
                className="h-20 w-auto"
              />
            </div>
          );
        },
        Footer() {
          return (
            <div className="auth-shell__note">
              This login is not connected to your BYU account <br></br>Use your
              @byu.edu email to sign up
            </div>
          );
        },
      }}
    >
      {({ signOut }) => (
        <>
          <div className="flex justify-end px-6 py-3">
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-md border border-blue-900/20 bg-blue-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-900/90"
            >
              Sign out{" "}
            </button>
          </div>
          {children}
        </>
      )}
    </AmplifyAuthenticator>
  );
}

export default Authenticator;
