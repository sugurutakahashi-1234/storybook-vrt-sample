import { oc } from "@orpc/contract";
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string().default("Sample todo"),
  completed: z.boolean().default(false),
});
export type Todo = z.infer<typeof TodoSchema>;

export const todoContract = {
  list: oc.route({ method: "GET", path: "/todos" }).output(z.array(TodoSchema)),
  create: oc
    .route({ method: "POST", path: "/todos" })
    .input(z.object({ title: z.string() }))
    .output(TodoSchema),
  toggle: oc
    .route({ method: "PATCH", path: "/todos/{id}" })
    .input(z.object({ id: z.string() }))
    .output(TodoSchema),
};
