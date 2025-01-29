import { checker } from "./api-checker.ts";

async function generateCoverageReport() {
  const allMethods = checker.getAllMethodsStatus();
  const missingMethods = checker.getMissingMethods();
  const extraMethods = checker.getExtraMethods();

  const implementedMethods = allMethods.filter((m) => m.available);
  const totalEndpoints = Object.keys(checker.endpoints).length;
  const coveragePercent = (
    (implementedMethods.length / totalEndpoints) *
    100
  ).toFixed(1);

  const report = `# Smartschool API Coverage Report

This document provides an overview of the API coverage status for the Smartschool client implementation.

## Status Indicators

- ✅ Fully implemented and available
- ❌ Defined in endpoints but not implemented
- ⚠️ Implemented but not in endpoints

## Implementation Status

### Available Methods

The following methods are fully implemented and match the API endpoints:

\`\`\`typescript
class SmartschoolClient {
${implementedMethods.map((m) => `    ✅ ${m.method}()`).join("\n")}
}
\`\`\`

### Missing Implementations

The following endpoints are defined in the API but not yet implemented in the client:

\`\`\`typescript
class SmartschoolClient {
${missingMethods.map((m) => `    ❌ ${m}()`).join("\n")}
}
\`\`\`

### Extra Implementations

The following methods are implemented in the client but not defined in the API endpoints:

\`\`\`typescript
class SmartschoolClient {
${extraMethods.map((m) => `    ⚠️ ${m}()`).join("\n")}
}
\`\`\`

## Coverage Statistics

Current status:
- Total number of API endpoints: ${totalEndpoints}
- Implemented endpoints: ${implementedMethods.length}
- Coverage percentage: ${coveragePercent}%

## How to Contribute

To help improve API coverage:

1. Pick a method marked with ❌ from the Missing Implementations section
2. Implement the method following the API specification
3. Submit a pull request with your implementation
4. Update this coverage report

## Automated Verification

You can run the API coverage check yourself using:

\`\`\`typescript
const checker = new APIChecker(client);
console.log(checker.getAllMethodsStatus());
\`\`\`

This report is automatically generated using the APIChecker utility class.

---
Last updated: ${new Date().toLocaleDateString()}`;

  // Write the report to API-COVERAGE.md using Deno's API
  await Deno.writeTextFile("API-COVERAGE.md", report);
  console.log("API coverage report generated successfully!");
}

// Generate the report
if (import.meta.main) {
  generateCoverageReport();
}
