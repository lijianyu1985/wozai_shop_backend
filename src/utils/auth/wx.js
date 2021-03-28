import Config from "getconfig";
import errors from "../errors";
import https from "https";

export async function code2Session(code) {
  const { appId, appSecret, appCode2SessionUrl } = Config.wxConfig;
  const myURL = new URL(appCode2SessionUrl);
  myURL.searchParams.append("appid", appId);
  myURL.searchParams.append("secret", appSecret);
  myURL.searchParams.append("js_code", code);
  myURL.searchParams.append("grant_type", "authorization_code");
  try {
    return new Promise((resolve, reject) => {
      https
        .get(myURL.href, (res) => {
          const { statusCode } = res;
          let error;
          // Any 2xx status code signals a successful response but
          // here we're only checking for 200.
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                              `Status Code: ${statusCode}`);
          }
          if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            reject(error);
            return;
          }

          res.setEncoding("utf8");
          let rawData = "";
          res.on("data", (chunk) => {
            rawData += chunk;
          });
          res.on("end", () => {
            try {
              const parsedData = JSON.parse(rawData);
              resolve(parsedData);
            } catch (e) {
              console.error(e.message);
              reject(e);
            }
          });
        })
        .on("error", (e) => {
          console.error(`Got error: ${e.message}`);
          reject(e);
        });
    });
  } catch (err) {
    console.log(err);
    return Object.assign({}, errors.client.wxCode2SessionException, err);
  }
}
