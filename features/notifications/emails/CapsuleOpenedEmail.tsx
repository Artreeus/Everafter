import { Section, Text, Heading, Button, Hr } from '@react-email/components'
import { BaseEmail } from './layouts/BaseEmail'

interface CapsuleOpenedEmailProps {
  authorName:      string
  recipientName:   string
  capsuleTitle:    string
  openedAt:        string
  dashboardUrl:    string
  unsubscribeUrl?: string
}

export function CapsuleOpenedEmail({
  authorName,
  recipientName,
  capsuleTitle,
  openedAt,
  dashboardUrl,
  unsubscribeUrl,
}: CapsuleOpenedEmailProps) {
  return (
    <BaseEmail preview={`${recipientName} opened your capsule "${capsuleTitle}"`} unsubscribeUrl={unsubscribeUrl}>
      <Section>
        <Heading style={styles.heading}>Your capsule was opened.</Heading>

        <Text style={styles.body}>
          {authorName}, {recipientName} just opened your capsule &ldquo;{capsuleTitle}&rdquo;.
        </Text>

        <Text style={{ ...styles.body, color: '#9B9189', fontStyle: 'italic' }}>
          Opened on {openedAt}.
        </Text>

        <Hr style={styles.divider} />

        <Text style={styles.note}>
          You can view all your capsules and their status in your dashboard.
        </Text>

        <Button href={dashboardUrl} style={styles.button}>
          Go to dashboard
        </Button>
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
    margin: '0 0 20px',
  },
  body: {
    color: '#2C2825',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 14px',
  },
  divider: { borderColor: '#E8E2D9', margin: '24px 0' },
  note: { color: '#9B9189', fontSize: '13px', lineHeight: '1.6', margin: '0 0 20px' },
  button: {
    backgroundColor: '#2C2825',
    color: '#FAF7F2',
    borderRadius: '8px',
    padding: '12px 28px',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'inline-block',
  },
} as const

CapsuleOpenedEmail.PreviewProps = {
  authorName:    'Sarah',
  recipientName: 'Emma',
  capsuleTitle:  'To my daughter on her wedding day',
  openedAt:      'June 15, 2030 at 10:32 AM',
  dashboardUrl:  'https://everafter.app/dashboard',
} satisfies CapsuleOpenedEmailProps

export default CapsuleOpenedEmail
