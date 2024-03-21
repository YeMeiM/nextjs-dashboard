import {NextRequest, NextResponse} from "next/server";
import {iteratorToStream, textIterator} from "@/app/lib/utils";

export async function GET(req: NextRequest, res: NextResponse) {
  const params = req.nextUrl.searchParams;
  const query = params.get('q') || '';
  if (!query) {
    return NextResponse.json({
      message: '请输入查询问题'
    }, {
      status: 500,
      statusText: 'fail',
    });
  }
  const iterator = textIterator(
    `[${req.ip}]${query}：export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const res = await fetch(\`https://data.mongodb-api.com/product/\${id}\`, {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY!,
    },
  })
  const product = await res.json()
 
  return Response.json({ product })
}`)

  return new Response(iteratorToStream(iterator));
}