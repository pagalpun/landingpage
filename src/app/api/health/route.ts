export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'SocialSage Next.js API is working!'
  })
}