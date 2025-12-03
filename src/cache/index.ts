import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://concrete-caribou-44100.upstash.io",
  token: "AaxEAAIncDJiYmI0ZGNmZDQ3MzM0NDY2OTRkNmExMmJmYzA2MTdjMnAyNDQxMDA",
});

export default redis;
