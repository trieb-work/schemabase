// eslint-disable-next-line import/no-extraneous-dependencies
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import morgan from "morgan";
import passport from "passport";
import express from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import session from "express-session";
import bodyParser from "body-parser";
import { env } from "@eci/pkg/env";
import Redis from "ioredis";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const HOST = process.env.HOST;
if (!HOST)
  throw new Error("$HOST not set! Can't create the callback URL for google");

const allowedLoginDomains = process.env.ALLOWED_LOGIN_DOMAINS;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.require("GOOGLE_OAUTH_ID"),
      clientSecret: env.require("GOOGLE_OAUTH_SECRET"),
      callbackURL: `${
        HOST.includes("localhost") ? "http" : "https"
      }://${HOST}/login/callback`,
    },
    // check, that only users with the correct domain can access
    function (
      _accessToken: any,
      _refreshToken: any,
      profile: any,
      cb: (arg0: any, arg1?: any) => any,
    ) {
      if (
        allowedLoginDomains?.includes(profile._json.hd) &&
        profile._json.email_verified
      ) {
        console.info(`Allowing access for user ${profile._json.email}`);
        return cb(undefined, profile);
      }
      return cb(new Error("Invalid host domain"));
    },
  ),
);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser((user: any, cb: (arg0: null, arg1: any) => void) => {
  cb(null, user);
});

passport.deserializeUser((user: any, cb: (arg0: null, arg1: any) => void) => {
  cb(null, user);
});

async function main() {
  const port = parseInt(env.get("PORT", "13000")!);

  const connection = {
    host: env.require("REDIS_HOST"),
    port: Number.parseInt(env.require("REDIS_PORT")),
    password: env.require("REDIS_PASSWORD"),
  };

  const redis = new Redis(connection);

  /**
   * A queue name always look like this:
   * bull:eci:<TenantId>:<IntegrationId>:<queueName>
   * bull:eci:pk_7f165pf-prod:id_wrtrgwqrg:SaleorProductSyncWorkflow
   * Getting all redis keys from the namespace "bull"
   */
  const keys = await redis.keys("bull:eci:*");
  const queuesUnsorted: string[] = [];
  for (const key of keys) {
    const [, , tenant, integrationId, topic] = key.split(":");
    const queueName = `eci:${tenant}:${integrationId}:${topic}`;
    if (topic && integrationId && !queuesUnsorted.includes(queueName))
      queuesUnsorted.push(queueName);
  }

  const queues = queuesUnsorted.sort((a, b) => a.localeCompare(b));

  const serverAdapter: any = new ExpressAdapter();
  serverAdapter.setBasePath("/ui");

  createBullBoard({
    queues: queues.map(
      (workflow) =>
        new BullMQAdapter(
          new Queue(workflow, {
            connection: {
              host: env.require("REDIS_HOST"),
              port: parseInt(env.require("REDIS_PORT")),
              password: env.require("REDIS_PASSWORD"),
            },
          }),
        ),
    ),
    // @ts-ignore
    serverAdapter,
  });

  const app = express();

  app.use(morgan("combined"));

  app.use(session({ secret: "keyboard cat" }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Initialize Passport and restore authentication state, if any, from the session.
  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/login",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  app.get(
    "/login/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (_req, res) {
      // Successful authentication, redirect home.
      res.redirect("/ui");
    },
  );

  app.use(
    "/ui",
    ensureLoggedIn({ redirectTo: "/login" }),
    serverAdapter.getRouter(),
  );

  app.use("/health", (_req, res) => {
    res.send({ status: "ok" });
  });

  app.use("/", (_req, res) => {
    res.redirect("/ui");
  });

  const server = app.listen(port, () => {
    console.log(`Running on port ${port}...`);
  });

  // The signals we want to handle
  // NOTE: although it is tempting, the SIGKILL signal (9) cannot be intercepted and handled
  const signals: { [key: string]: number } = {
    SIGHUP: 1,
    SIGINT: 2,
    SIGTERM: 15,
  };
  // Do any necessary shutdown logic for our application here
  const shutdown = (signal: any, value: any) => {
    console.log("shutdown!");
    server.close(() => {
      console.log(`server stopped by ${signal} with value ${value}`);
      process.exit(128 + value);
    });
  };
  // Create a listener for each of the signals that we want to handle
  Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
      console.log(`process received a ${signal} signal`);
      shutdown(signal, signals[signal]);
    });
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
