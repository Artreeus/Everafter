import { Section, Text, Heading, Hr } from '@react-email/components'
import { BaseEmail } from './layouts/BaseEmail'

interface CapsuleSealedEmailProps {
  authorName:      string
  capsuleTitle:    string
  deliveryDate:    string
  recipientNames:  string[]
  unsealDeadline:  string
  dashboardUrl:    string
  unsubscribeUrl?: string
}

export function CapsuleSealedEmail({
  authorName,
  capsuleTitle,
  deliveryDate,
  recipientNames,
  unsealDeadline,
  dashboardUrl,
  unsubscribeUrl,
}: CapsuleSealedEmailProps) {
  return (
    <BaseEmail preview={`Your capsule "${capsuleTitle}" has been sealed.`} unsubscribeUrl={unsubscribeUrl}>
      <Section>
        <Heading style={styles.heading}>Your capsule is sealed.</Heading>

        <Text style={styles.body}>
          {authorName}, your capsule &ldquo;{capsuleTitle}&rdquo; has been sealed and
          scheduled for delivery on <strong>{deliveryDate}</strong>.
        </Text>

        <Text style={styles.body}>
          {recipientNames.length === 1
            ? `${recipientNames[0]} will receive it when the time comes.`
            : `${recipientNames.slice(0, -1).join(', ')} and ${recipientNames.at(-1)} will each receive it when the time comes.`}
        </Text>

        <Hr style={styles.divider} />

        <Text style={styles.note}>
          You have until <strong>{unsealDeadline}</strong> to unseal and make changes.
          After that, your capsule is truly sealed — just as it should be.
        </Text>

        <Text style={{ ...styles.note, marginTop: '12px' }}>
          View your capsule any time in your{' '}
          <a href={dashboardUrl} style={styles.link}>dashboard</a>.
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
    margin: '0 0 20px',
  },
  body: {
    color: '#2C2825',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 16px',
  },
  divider: {
    borderColor: '#E8E2D9',
    margin: '24px 0',
  },
  note: {
    color: '#9B9189',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0',
  },
  link: {
    color: '#C4A55A',
    textDecoration: 'none',
  },
} as const

CapsuleSealedEmail.PreviewProps = {
  authorName:     'Sarah',
  capsuleTitle:   'To my daughter on her wedding day',
  deliveryDate:   'June 15, 2030',
  recipientNames: ['Emma'],
  unsealDeadline: 'tomorrow at 10:00 AM',
  dashboardUrl:   'https://everafter.app/dashboard',
} satisfies CapsuleSealedEmailProps

export default CapsuleSealedEmail
