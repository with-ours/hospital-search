import { validateAllAddresses } from "../src/lib/validate-addresses";

validateAllAddresses()
  .then(() => {
    console.log("\n✅ Validation complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Validation failed:", error);
    process.exit(1);
  });
