import { updateStoresWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

export default async function brandAtlantic({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storeModuleService = container.resolve(Modules.STORE)

  const [store] = await storeModuleService.listStores()
  if (!store) {
    throw new Error("No store found to brand as Atlantic.")
  }

  const currentMetadata =
    (store.metadata as Record<string, unknown> | undefined) ?? {}

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Atlantic",
        metadata: {
          ...currentMetadata,
          brand: "Atlantic",
          logo_url:
            process.env.ATLANTIC_LOGO_URL ??
            (currentMetadata.logo_url as string | undefined) ??
            "",
        },
      },
    },
  })

  logger.info("Store branding updated: name set to Atlantic.")
}
