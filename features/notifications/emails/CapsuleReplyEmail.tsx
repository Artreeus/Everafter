import {
  Body, Column, Container, Head, Heading, Hr, Html,
  Preview, Row, Section, Text,
} from '@react-email/components'
import * as React from 'react'

interface CapsuleReplyEmailProps {
  authorName:   string
  capsuleTitle: string
  replyFrom:    string
  replyContent: string
}

export const PreviewProps: CapsuleReplyEmailProps = {
  authorName:   'Sarah',
  capsuleTitle: 'To my daughter on her wedding day',
  replyFrom:    'Emma',
  replyContent: 'This made me cry happy tears. Thank you so much, Mum. I love you.',
}

const main    = { backgroundColor: '#FAF9F7', fontFamily: '"Inter", sans-serif' }
const container = { maxWidth: '520px', margin: '0 auto', padding: '40px 20px' }
const card    = { backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '40px', border: '1px solid #E8E4DF' }
const label   = { fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#9B8E82', margin: '0 0 4px' }
const h1      = { fontSize: '22px', fontWeight: '300', color: '#2C2825', margin: '0 0 8px', lineHeight: '1.4' }
const body    = { fontSize: '14px', color: '#6B5F55', lineHeight: '1.7', margin: '0 0 24px' }
const quote   = { backgroundColor: '#FAF9F7', borderLeft: '3px solid #D4A96A', borderRadius: '4px', padding: '16px 20px', margin: '24px 0' }
const quoteText = { fontSize: '14px', color: '#3D3530', lineHeight: '1.7', fontStyle: 'italic', margin: '0' }
const hr      = { borderColor: '#E8E4DF', margin: '24px 0' }
const footer  = { fontSize: '12px', color: '#B8ADA5', textAlign: 'center' as const, margin: '24px 0 0' }

export default function CapsuleReplyEmail({ authorName, capsuleTitle, replyFrom, replyContent }: CapsuleReplyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{replyFrom} replied to your capsule "{capsuleTitle}"</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={card}>
            <p style={label}>Everafter</p>
            <Heading style={h1}>You received a reply</Heading>
            <Text style={body}>
              Hi {authorName}, {replyFrom} opened your capsule &ldquo;{capsuleTitle}&rdquo; and sent you a reply.
            </Text>

            <Section style={quote}>
              <Text style={quoteText}>&ldquo;{replyContent}&rdquo;</Text>
            </Section>

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={{ ...body, margin: 0 }}>
                  — {replyFrom}
                </Text>
              </Column>
            </Row>
          </div>

          <Text style={footer}>
            Everafter · Memories that travel through time
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
