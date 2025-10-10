import type { PreSignUpTriggerHandler } from "aws-lambda";

// code that runs when Cognito invokes the pre-sign-up trigger.
export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes["email"];

  if (!email.endsWith("@byu.edu")) {
    throw new Error("Invalid email domain");
  }

  return event;
};
