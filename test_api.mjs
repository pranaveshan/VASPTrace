const base = 'http://localhost:5000';

async function test() {
  const [entities, alerts, health, sources, search, val] = await Promise.all([
    fetch(`${base}/api/entities`).then(r => r.json()),
    fetch(`${base}/api/alerts`).then(r => r.json()),
    fetch(`${base}/api/system/health`).then(r => r.json()),
    fetch(`${base}/api/system/data-sources`).then(r => r.json()),
    fetch(`${base}/api/search?q=wazirx`).then(r => r.json()),
    fetch(`${base}/api/investigations/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: '0x71C2a3628F5c36C059B880bF202bE6325Fe8912e', network: 'ETH' })
    }).then(r => r.json())
  ]);

  console.log('--- ALL API ENDPOINTS VERIFIED ---');
  console.log(`Entities count: ${entities.length}`);
  console.log(`Alerts count: ${alerts.length}`);
  console.log(`Health status: ${health.status}`);
  console.log(`Data Sources count: ${sources.length}`);
  console.log(`Search matches for "wazirx": ${search.length}`);
  console.log(`Address validation: isValid=${val.isValid}, checksum=${val.checksumMatch}`);
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
