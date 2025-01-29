import { SmartschoolClient } from "../mod.ts";
import config from "../../config.json" with { type: "json" };

export const client = new SmartschoolClient(config);
