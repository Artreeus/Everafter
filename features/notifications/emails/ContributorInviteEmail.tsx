import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface ContributorInviteEmailProps {
  toName:        string
  authorName:    string
  capsuleTitle:  string
  contributeUrl: string
}

export const PreviewProps: ContributorInviteEmailProps = {
  toName:        'Emma',
  authorName:    'Sarah',
  capsuleTitle:  'To my daughter on her wedding day',
  contributeUrl: 'https://everafter.app/contribute/abc123',
}

const main      = { backgroundColor: '#FAF9F7', fontFamily: '"Inter", sans-serif' }
const container = { maxWidth: '520px', margin: '0 auto', padding: '40px 20px' }
const card      = { backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #E8E4DF' }
const label     = { fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#9B8E82', margin: '0 0 4px' }
const h1        = { fontSize: '22px', fontWeight: '300', color: '#2C2825', margin: '0 0 8px', lineHeight: '1.4' }
const body      = { fontSize: '14px', color: '#6B5F55', lineHeight: '1.7', margin: '0 0 20px' }
const btn       = { backgroundColor: '#2C2825', borderRadius: '10px', color: '#FAF9F7', fontSize: '14px', fontWeight: '500', padding: '12px 28px', textDecoration: 'none', display: 'inline-block' }
const hr        = { borderColor: '#E8E4DF', margin: '24px 0' }
const footer    = { fontSize: '12px', color: '#B8ADA5', textAlign: 'center' as const, margin: '24px 0 0' }

export default function ContributorInviteEmail({ toName, authorName, capsuleTitle, contributeUrl }: ContributorInviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{authorName} invited you to contribute to their time capsule</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={card}>
            <p style={label}>Everafter · Time Capsule</p>
            <Heading style={h1}>You&apos;ve been invited to contribute</Heading>
            <Text style={body}>
              Hi {toName}, {authorName} is creating a time capsule called &ldquo;{capsuleTitle}&rdquo; and would love
              for you to add something to it — a letter, a photo, a voice message, or a memory.
            </Text>
            <Text style={{ ...body, fontStyle: 'italic', color: '#9B8E82' }}>
              Your contribution will be part of something they&apos;ll open in the future.
            </Text>
            <Section style={{ textAlign: 'center', margin: '28px 0' }}>
              <Button href={contributeUrl} style={btn}>Add your contribution</Button>
            </Section>
            <Hr style={hr} />
            <Text style={{ ...body, margin: 0, fontSize: '12px', color: '#9B8E82' }}>
              This link is personal to you. Only you can use it to contribute.
            </Text>
          </div>
          <Text style={footer}>Everafter · Memories that travel through time</Text>
        </Container>
      </Body>
    </Html>
  )
}
