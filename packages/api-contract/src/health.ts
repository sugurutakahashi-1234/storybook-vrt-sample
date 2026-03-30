import { oc } from "@orpc/contract";
import { z } from "zod";

const HealthSchema = z.object({
  status: z.string(),
  env: z.string(),
});

export const healthContract = {
  check: oc.route({ method: "GET", path: "/health" }).output(HealthSchema),
};
