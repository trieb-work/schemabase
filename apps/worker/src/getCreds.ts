import axios from "axios";

const defaultHeaders = {
  accept: "*/*",
  "accept-encoding": "gzip, deflate, br",
  "accept-language": "de-DE,de;q=0.9",
  "cache-control": "no-cache",
  pragma: "no-cache",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36",
  "sec-ch-ua":
    '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const parseSetCookieHeader = (headers: {
  "set-cookie": string[];
}): [string, string][] =>
  headers["set-cookie"]
    ?.map(
      (cookie: string) =>
        cookie.split(";")?.[0]?.split("=") as [string, string],
    )
    .filter(
      (cookieArr: any) =>
        cookieArr.length === 2 &&
        typeof cookieArr?.[0] === "string" &&
        typeof cookieArr?.[1] === "string",
    ); // typeguard

const getLoginCookies = async () => {
  const resCsrf = await axios.get(
    "https://accounts.zoho.com/signin?servicename=ZohoInventory&signupurl=https://www.zoho.com/inventory/signup/index.html",
    {
      headers: {
        ...defaultHeaders,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
    },
  );
  const cookies: [string, string][] = parseSetCookieHeader(resCsrf.headers);
  const csrfToken = `iamcsrcoo=${
    cookies.find(([key]) => key === "iamcsr")?.[1]
  }`;
  const cookieStr = cookies.map(([key, value]) => `${key}=${value}`).join("; ");
  await axios.get("https://tlstest.zoho.com/api", {
    headers: {
      ...defaultHeaders,
      "sec-fetch-site": "cross-site",
      Referer: "https://accounts.zoho.eu/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
  await delay(800); // simulate user behaviour
  await axios.post(
    "https://accounts.zoho.com/accounts/public/api/locate",
    `cli_time=${Date.now()}&servicename=ZohoInventory&serviceurl=https%3A%2F%2Finventory.zoho.com%2Fhome&signupurl=https%3A%2F%2Fwww.zoho.com%2Finventory%2Fsignup%2Findex.html`,
    {
      headers: {
        ...defaultHeaders,
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        origin: "https://accounts.zoho.com",
        "x-zcsrf-token": csrfToken,
        cookie: cookieStr,
        Referer:
          "https://accounts.zoho.com/signin?servicename=ZohoInventory&signupurl=https://www.zoho.com/inventory/signup/index.html",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  );
  await delay(800); // simulate user behaviour
  const resLookup = await axios.post(
    "https://accounts.zoho.eu/signin/v2/lookup/info@trieb.work",
    `mode=primary&cli_time=${Date.now()}&servicename=ZohoInventory&serviceurl=https%3A%2F%2Finventory.zoho.com%2Fhome&signupurl=https%3A%2F%2Fwww.zoho.com%2Finventory%2Fsignup%2Findex.html`,
    {
      headers: {
        ...defaultHeaders,
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        origin: "https://accounts.zoho.eu",
        "x-zcsrf-token": csrfToken,
        cookie: cookieStr,
        Referer:
          "https://accounts.zoho.eu/signin?servicename=ZohoInventory&signupurl=https://www.zoho.com/inventory/signup/index.html",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  );
  if (resLookup.data.status_code !== 201)
    throw new Error("lookup status code not 201, lookup failed");
  await delay(800); // simulate user behaviour
  const resSignin = await axios.post(
    `https://accounts.zoho.eu/signin/v2/primary/${
      resLookup.data.lookup.identifier
    }/password?digest=${
      resLookup.data.lookup.digest
    }&cli_time=${Date.now()}&servicename=ZohoInventory&serviceurl=https%3A%2F%2Finventory.zoho.eu%2Fhome&signupurl=https%3A%2F%2Fwww.zoho.com%2Finventory%2Fsignup%2Findex.html`,
    '{"passwordauth":{"password":"H53Lj^w6#8@4@SkJvbwj"}}',
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "x-zcsrf-token": csrfToken,
        cookie: cookieStr,
        Referer:
          "https://accounts.zoho.eu/signin?servicename=ZohoInventory&signupurl=https://www.zoho.com/inventory/signup/index.html",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
  );
  if (resSignin.data.status_code !== 201)
    throw new Error(`login not successfull: ${resSignin.data.message}`);
  const cookies2: [string, string][] = parseSetCookieHeader(resSignin.headers);
  const cookieStr2 = cookies2
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  const resHome = await axios.get("https://inventory.zoho.eu/home", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie: `${cookieStr}; ${cookieStr2}`,
      Referer: "https://accounts.zoho.eu/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
  const cookies3: [string, string][] = parseSetCookieHeader(resHome.headers);
  // transform and merge cookie arrays from all steps into single map. Overide values with the same key from previous steps.
  const cookieMap = [...cookies, ...cookies2, ...cookies3].reduce(
    (akku, [key, value]) => ({
      ...akku,
      [key]: value,
    }),
    {},
  );
  return cookieMap;
};

(async () => {
  console.log(await getLoginCookies());
})();
