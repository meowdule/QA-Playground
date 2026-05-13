import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { input: "./data/scenarios.json" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = argv[i + 1];
  }
  return args;
}

function scenariosFromPayload(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.scenarios)) return raw.scenarios;
  if (raw?.scenario) return [raw.scenario];
  return [];
}

function nonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function validateStep(step, idx, errors, prefix) {
  if (!step || typeof step !== "object") {
    errors.push(`${prefix}.steps[${idx}] must be an object`);
    return;
  }
  if (!nonEmptyString(step.action)) errors.push(`${prefix}.steps[${idx}].action is required`);
  if (!nonEmptyString(step.target)) errors.push(`${prefix}.steps[${idx}].target is required`);
}

function validateVariant(variant, idx, errors, prefix) {
  const p = `${prefix}.variants[${idx}]`;
  if (!variant || typeof variant !== "object") {
    errors.push(`${p} must be an object`);
    return;
  }
  if (!nonEmptyString(variant.kind)) errors.push(`${p}.kind is required`);
  if (!Array.isArray(variant.steps) || variant.steps.length === 0) {
    errors.push(`${p}.steps must be a non-empty array`);
  } else {
    variant.steps.forEach((step, stepIdx) => validateStep(step, stepIdx, errors, p));
  }
}

function validateScenario(scenario, index) {
  const errors = [];
  const prefix = `scenarios[${index}]`;
  if (!scenario || typeof scenario !== "object") {
    return [`${prefix} must be an object`];
  }
  if (!nonEmptyString(scenario.id)) errors.push(`${prefix}.id is required`);
  if (!nonEmptyString(scenario.name)) errors.push(`${prefix}.name is required`);
  if (!nonEmptyString(scenario.targetUrl)) errors.push(`${prefix}.targetUrl is required`);
  if (!Array.isArray(scenario.boxes)) errors.push(`${prefix}.boxes must be an array`);

  if (!Array.isArray(scenario.normalSteps) || scenario.normalSteps.length === 0) {
    errors.push(`${prefix}.normalSteps must be a non-empty array`);
  } else {
    scenario.normalSteps.forEach((step, idx) => validateStep(step, idx, errors, `${prefix}.normalSteps`));
  }

  if (!Array.isArray(scenario.variants)) {
    errors.push(`${prefix}.variants must be an array`);
  } else {
    scenario.variants.forEach((variant, idx) => validateVariant(variant, idx, errors, prefix));
  }

  const md = scenario.missionDraft;
  if (!md || typeof md !== "object") {
    errors.push(`${prefix}.missionDraft is required`);
  } else {
    if (!nonEmptyString(md.missionId)) errors.push(`${prefix}.missionDraft.missionId is required`);
    if (!nonEmptyString(md.title)) errors.push(`${prefix}.missionDraft.title is required`);
    if (!md.runtimeMission || typeof md.runtimeMission !== "object") {
      errors.push(`${prefix}.missionDraft.runtimeMission is required`);
    } else {
      if (!nonEmptyString(md.runtimeMission.route)) errors.push(`${prefix}.missionDraft.runtimeMission.route is required`);
      if (!nonEmptyString(md.runtimeMission.visitCheckId)) errors.push(`${prefix}.missionDraft.runtimeMission.visitCheckId is required`);
      if (!nonEmptyString(md.runtimeMission.submitCheckId)) errors.push(`${prefix}.missionDraft.runtimeMission.submitCheckId is required`);
    }
  }

  return errors;
}

function main() {
  const { input } = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(process.cwd(), input);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Scenario input file not found: ${inputPath}`);
  }
  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const scenarios = scenariosFromPayload(payload);

  if (scenarios.length === 0) {
    // eslint-disable-next-line no-console
    console.log("No scenarios found; validation passed (empty payload).");
    return;
  }

  const errors = [];
  scenarios.forEach((scenario, index) => {
    errors.push(...validateScenario(scenario, index));
  });

  if (errors.length) {
    // eslint-disable-next-line no-console
    console.error("Scenario validation failed:");
    errors.forEach((e) => {
      // eslint-disable-next-line no-console
      console.error(`- ${e}`);
    });
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`Scenario validation passed: ${scenarios.length} scenario(s)`);
}

main();
