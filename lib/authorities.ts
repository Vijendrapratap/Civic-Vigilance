const DATA: { region: string; handles: string[] }[] = [
  { region: 'default', handles: ['@municipal_corp', '@trafficpolice'] },
  { region: 'ward-42', handles: ['@ward42office', '@cityroads'] }
];

export function suggestAuthorities(region?: string) {
  if (!region) return DATA[0].handles;
  const found = DATA.find((d) => d.region === region);
  return found ? found.handles : DATA[0].handles;
}
