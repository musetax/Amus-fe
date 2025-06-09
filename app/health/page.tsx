// app/health/route.js

export async function GET() {
    console.log('dhdhdhdhdh')
    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  