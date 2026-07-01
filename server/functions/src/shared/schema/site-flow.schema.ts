import { z } from "zod";
import { siteModuleIds } from "../model/site-flow";

const siteFlowModuleSchema = z
  .object({
    flowId: z.string().trim().min(1).max(120),
    moduleId: z.enum(siteModuleIds),
  })
  .strict();

const updateSiteFlowSchema = z
  .object({
    modules: z.array(siteFlowModuleSchema).max(siteModuleIds.length),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .superRefine(({ modules }, context) => {
    const flowIds = new Set<string>();
    const moduleIds = new Set<string>();

    modules.forEach((module, index) => {
      if (flowIds.has(module.flowId)) {
        context.addIssue({
          code: "custom",
          message: "Flow IDs must be unique",
          path: ["modules", index, "flowId"],
        });
      }
      if (moduleIds.has(module.moduleId)) {
        context.addIssue({
          code: "custom",
          message: "Module IDs must be unique",
          path: ["modules", index, "moduleId"],
        });
      }

      flowIds.add(module.flowId);
      moduleIds.add(module.moduleId);
    });
  })
  .transform(({ token: _token, user: _user, ...flow }) => flow);

type UpdateSiteFlowBody = z.infer<typeof updateSiteFlowSchema>;

export { updateSiteFlowSchema, UpdateSiteFlowBody };
