const [, , sha, version] = process.argv;

const startDate = new Date();

const formatted: string = [
  ["Version", version],
  ["SHA", sha],
  ["Started", startDate.toISOString()],
]
  .map(([k, v]) => `  - ${k}:\t${v}`)
  .join("\n");

export { startDate, sha, version, formatted };
