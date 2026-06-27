import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Font,
  Link,
} from '@react-email/components'

interface BaseEmailProps {
  children:         React.ReactNode
  preview?:         string
  unsubscribeUrl?:  string
}

const bodyStyle = {
  backgroundColor: '#FAF7F2',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: 0,
}

const containerStyle = {
  maxWidth: '540px',
  margin: '0 auto',
  padding: '40px 24px',
}

const footerStyle = {
  color: '#9B9189',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  marginTop: '32px',
}

export function BaseEmail({ children, preview, unsubscribeUrl }: BaseEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Logo */}
          <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Text
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '24px',
                color: '#2C2825',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Everafter
            </Text>
          </Section>

          {children}

          <Hr style={{ borderColor: '#E8E2D9', margin: '32px 0' }} />

          <Text style={footerStyle}>
            You received this email because you have an account with Everafter.
            <br />
            Some words deserve the perfect moment.
            {unsubscribeUrl ? (
              <>
                {'\n'}
                <Link href={unsubscribeUrl} style={{ color: '#9B9189', textDecoration: 'underline' }}>
                  Unsubscribe
                </Link>
              </>
            ) : null}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
