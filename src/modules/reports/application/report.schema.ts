import { z } from "zod";

import { todayDateString } from "../domain/report.rules";

const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)");

export const reportDateRangeSchema = z
  .object({
    from: dateStringSchema.optional(),
    to: dateStringSchema.optional(),
  })
  .transform((data) => {
    const today = todayDateString();
    return {
      from: data.from ?? today,
      to: data.to ?? today,
    };
  })
  .superRefine((data, ctx) => {
    const fromDate = new Date(`${data.from}T00:00:00`);
    const toDate = new Date(`${data.to}T00:00:00`);
    if (fromDate.getTime() > toDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha desde no puede ser posterior a hasta.",
        path: ["from"],
      });
    }
  });

export type ReportDateRangeInput = z.infer<typeof reportDateRangeSchema>;
