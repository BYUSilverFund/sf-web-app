import { defineFunction } from "@aws-amplify/backend";
// at deploy time: Amplify will create a Lambda function named pre-sign-up using the code in handler.ts
const preSignUp = defineFunction({
  name: "pre-sign-up",
  entry: "./handler.ts", // path to the file containing the function code
});

import { defineAuth } from "@aws-amplify/backend";

// tells Amplify to add the preSignUp function as a trigger to the Auth resource (defined in cfg object in AmplifyInit component).
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    preSignUp,
  },
});
