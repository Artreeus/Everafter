import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from '@react-email/components'

interface PlusWelcomeEmailProps {
  name: string
}

export default function PlusWelcomeEmail({ name = 'there' }: PlusWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Everafter Plus</Preview>
      <Body style={{ backgroundColor: '#FAF9F6', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: 520, margin: '40px auto', padding: '0 20px' }}>
          <Section style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: '40px 48px', border: '1px solid #E8E4DC' }}>
            <Heading style={{ fontSize: 22, color: '#2C2C2C', fontWeight: 400, marginBottom: 8 }}>
              Welcome to Plus, {name}.
            </Heading>
            <Text style={{ fontSize: 15, color: '#6B6355', lineHeight: 1.7, marginBottom: 20 }}>
              You now have access to everything Everafter has to offer — unlimited capsules, group contributions,
              recurring deliveries, and up to 10 recipients per capsule.
            </Text>
            <Text style={{ fontSize: 13, color: '#9A8F82', lineHeight: 1.7 }}>
              Your subscription keeps Everafter running. Thank you for believing in what we&apos;re building.
            </Text>
          </Section>
          <Text style={{ fontSize: 11, color: '#B8AFA6', textAlign: 'center', marginTop: 24 }}>
            Everafter · Manage your subscription at everafter.app/settings/billing
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
