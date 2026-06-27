import { Section, Text, Heading, Button, Hr } from '@react-email/components'
import { BaseEmail } from './layouts/BaseEmail'

interface CapsuleDeliveryEmailProps {
  recipientName: string
  senderName:    string
  capsuleTitle:  string
  openUrl:       string
}

export function CapsuleDeliveryEmail({
  recipientName,
  senderName,
  capsuleTitle,
  openUrl,
}: CapsuleDeliveryEmailProps) {
  return (
    <BaseEmail preview={`${senderName} has a message for you — it's finally time.`}>
      <Section>
        <Heading style={styles.heading}>A message has arrived for you.</Heading>

        <Text style={styles.body}>
          Dear {recipientName},
        </Text>

        <Text style={styles.body}>
          {senderName} created a time capsule for you — and today is the day it opens.
          It&apos;s called &ldquo;{capsuleTitle}&rdquo;.
        </Text>

        <Text style={{ ...styles.body, fontStyle: 'italic', color: '#9B9189' }}>
          They wrote this just for you. Take a breath before you open it.
        </Text>

        <Hr style={styles.divider} />

        <Button
          href={openUrl}
          style={styles.button}
        >
          Open your capsule
        </Button>

        <Text style={styles.note}>
          This link is personal to you. Please don&apos;t share it — it opens the capsule only once.
        </Text>
      </Section>
    </BaseEmail>
  )
}

const styles = {
  heading: {
    fontFamily: 'Georgia, serif',
    fontSize: '26px',
    fontWeight: 300,
    color: '#2C2825',
    letterSpacing: '-0.02em',
    lineHeight: '1.2',
    margin: '0 0 24px',
  },
  body: {
    color: '#2C2825',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px',
  },
  divider: {
    borderColor: '#E8E2D9',
    margin: '28px 0',
  },
  button: {
    backgroundColor: '#2C2825',
    color: '#FAF7F2',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-block',
  },
  note: {
    color: '#9B9189',
    fontSize: '12px',
    lineHeight: '1.6',
    margin: '20px 0 0',
  },
} as const

CapsuleDeliveryEmail.PreviewProps = {
  recipientName: 'Emma',
  senderName:    'Sarah',
  capsuleTitle:  'To my daughter on her wedding day',
  openUrl:       'https://everafter.app/open/abc123',
} satisfies CapsuleDeliveryEmailProps

export default CapsuleDeliveryEmail
