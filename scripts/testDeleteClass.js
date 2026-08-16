const SUPABASE_URL = 'https://ulgbwklsfkzqpyniztgq.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2J3a2xzZmt6cXB5bml6dGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTE3MjgsImV4cCI6MjEwMjQ2NzcyOH0.GHTcsrLgebxqlkyN8XlOXGJ7S8Od-1bxyvRE1b1PWX8';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2J3a2xzZmt6cXB5bml6dGdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5MTcyOCwiZXhwIjoyMTAyNDY3NzI4fQ.NFuWZTK_ezIq126YxYhLEEx-M0KfJevIMKIo4D8Zqa0';

async function test() {
  console.log('--- Checking classes with Anon key ---');
  const res = await fetch(`${SUPABASE_URL}/rest/v1/classes?select=*`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
  const data = await res.json();
  console.log('Classes count:', data.length, data.map(c => ({ id: c.id, name: c.name, join_code: c.join_code })));

  if (data.length > 0) {
    const classIdToDelete = data[0].id;
    console.log(`Trying to DELETE class ${classIdToDelete} with ANON KEY...`);
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/classes?id=eq.${classIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Prefer': 'return=representation'
      }
    });
    const delResult = await delRes.text();
    console.log('DELETE status with ANON:', delRes.status, 'result:', delResult);

    console.log(`Trying to DELETE with SERVICE KEY...`);
    const delServRes = await fetch(`${SUPABASE_URL}/rest/v1/classes?id=eq.${classIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    });
    const delServResult = await delServRes.text();
    console.log('DELETE status with SERVICE KEY:', delServRes.status, 'result:', delServResult);
  }
}

test();
