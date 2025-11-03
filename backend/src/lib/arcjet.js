import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";
import express from "express";
import { ENV } from "./env.js";
const aj = arcjet({
  
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    
    (ENV.NODE_ENV === "production"
       ? [detectBot({
          mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
          allow: ["CATEGORY:SEARCH_ENGINE"],
}),
]
       : []
    ),
    
  
    // Create a token bucket rate limit. Other algorithms are supported.
    
    slidingWindow({
        mode:"LIVE",
        max:100,
        interval:60,
    }),
  ],
});

export default aj;