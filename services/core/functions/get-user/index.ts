import { APIGatewayProxyEvent } from "aws-lambda";

import { UserEntity } from "../../entities";
import { formatResponse } from "../../helpers/format-response";

export const main = async (event: APIGatewayProxyEvent) => {
  try {
    const email = event.queryStringParameters?.email;

    if (email === undefined) {
      return formatResponse("Please provide the email of the user you wish to get.", 400)
    }

    const response = await UserEntity.get({
      email: email,
    });

    console.log(response);
    const user = response.Item;
    delete user?.["apiKey"];

    if (user === undefined) {
      return formatResponse("User not found.", 404)
    }

    return formatResponse(JSON.stringify(user))

  } catch (err) {
    console.error(err);

    return formatResponse("Error when getting user.", 500)
  }
};
