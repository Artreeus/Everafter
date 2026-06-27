import { Section, Text, Button, Heading } from '@react-email/components'
import { BaseEmail } from './layouts/BaseEmail'

interface WelcomeEmailProps {
  name: string
  appUrl?: string
}

export function WelcomeEmail({
  name,
  appUrl = 'https://everafter.app',
}: WelcomeEmailProps) {
  return (
    <BaseEmail preview={`Welcome to Everafter, ${name}.`}>
      <Section>
        <Heading
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '28px',
            fontWeight: 300,
            color: '#2C2825',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            margin: '0 0 16px',
          }}
        >
          Welcome, {name}.
        </Heading>

        <Text
          style={{
            color: '#9B9189',
            fontSize: '15px',
            lineHeight: '1.7',
            margin: '0 0 24px',
          }}
        >
          You&apos;re now part of Everafter — a place to create time capsules for
          the people who matter most. Seal your words today. Deliver them exactly
          when it matters.
        </Text>

        <Text
          style={{
            color: '#2C2825',
            fontSize: '15px',
            lineHeight: '1.7',
            margin: '0 0 32px',
            fontStyle: 'italic',
          }}
        >
          Some words deserve the perfect moment.
        </Text>

        <Button
          href={`${appUrl}/capsules/new`}
          style={{
            backgroundColor: '#2C2825',
            color: '#FAF7F2',
            borderRadius: '8px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Create your first capsule
        </Button>

        <Text
          style={{
            color: '#9B9189',
            fontSize: '13px',
            lineHeight: '1.6',
            margin: '24px 0 0',
          }}
        >
          If you didn&apos;t create this account, you can safely ignore this email.
        </Text>
      </Section>
    </BaseEmail>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'Sarah',
  appUrl: 'https://everafter.app',
} satisfies WelcomeEmailProps

export default WelcomeEmail
