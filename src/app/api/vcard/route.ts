import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('n') || '';
  const role = searchParams.get('r') || '';
  const company = searchParams.get('c') || '';
  const phone = searchParams.get('p') || '';
  const email = searchParams.get('e') || '';
  const website = searchParams.get('w') || '';
  const linkedin = searchParams.get('l') || '';

  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TITLE:${role}
TEL:${phone}
EMAIL:${email}
URL:${website}
X-SOCIALPROFILE;type=linkedin:${linkedin}
END:VCARD`;

  return new NextResponse(vCard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name.replace(/\\s+/g, '_') || 'contact'}.vcf"`,
    },
  });
}
