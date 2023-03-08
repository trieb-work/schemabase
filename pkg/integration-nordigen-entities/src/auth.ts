import NordigenClient from "nordigen-node";

/**
 * Takes care of the authentication process with Nordigen. Makes sure,
 * that access tokens are valid
 */
const auth = async () => {
  const client = new NordigenClient({
    secretId: "23dbd8f3-eec9-435d-b3ab-5bb6eac3365d",
    // eslint-disable-next-line max-len
    secretKey: "3a643af670f74db9c986138872aefd0a3bdd6bc5b834a930db7c566e315693f3dd54e964449f39594a5367ead0a5cf531a6d40ac2d4a89d791e2ece758b1aa7a",
  });

  // Generate new access token. Token is valid for 24 hours
  const tokenData = await client.generateToken();

  // Get access and refresh token
  // Note: access_token is automatically injected to other requests after you successfully obtain it
  const token = tokenData.access;
  const refreshToken = tokenData.refresh;
  console.log(tokenData)

  const institutions = await client.institution.getInstitutions({country: "LV"});

  console.log(institutions)
};
export default auth;
