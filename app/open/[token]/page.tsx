import type { Metadata }     from 'next'
import { notFound }          from 'next/navigation'
import { EnvelopeReveal }    from '@/features/opening/components/EnvelopeReveal'
import { trackOpenAction }   from '@/features/capsules/actions/track-open.action'
import type { OpeningData, SerializedOpenItem } from '@/features/capsules/actions/track-open.action'
import { tiptapJsonToHtml }  from '@/lib/utils/tiptap'

interface Props {
  params: Promise<{ token: string }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title:  'You have a capsule — Everafter',
  robots: { index: false, follow: false },
}

export default async function OpenCapsulePage({ params }: Props) {
  const { token } = await params
  const result    = await trackOpenAction(token)

  if (result.status === 'notFound') notFound()

  if (result.status === 'notYet') {
    return <NotYetScreen />
  }

  const data = prepareData(result.data)

  return (
    <main>
      <EnvelopeReveal data={data} token={token} />
    </main>
  )
}

// Pre-render rich text server-side so the client gets plain HTML strings
function prepareData(data: OpeningData): OpeningData {
  return {
    ...data,
    items: data.items.map((item): SerializedOpenItem => {
      if (item.type === 'letter' && item.contentFormat === 'rich' && item.content) {
        return { ...item, content: tiptapJsonToHtml(item.content) }
      }
      return item
    }),
  }
}

function NotYetScreen() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'linear-gradient(160deg, #2C2825 0%, #1A1714 100%)' }}
    >
      <div className="space-y-4 max-w-sm">
        <div
          className="text-5xl mb-6"
          aria-hidden
          style={{ filter: 'sepia(1) saturate(1.5) brightness(0.8)' }}
        >
          ⧖
        </div>
        <h1
          className="text-ivory text-2xl font-light"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Not quite yet.
        </h1>
        <p className="text-ivory/50 text-sm font-sans leading-relaxed">
          This capsule is sealed and waiting for its moment.
          Check back when the time is right.
        </p>
      </div>
    </main>
  )
}
