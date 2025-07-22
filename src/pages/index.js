import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Button, Container, Paper, Select, Stack, Table, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import DomainTable from "./components/DomainTable";
import ContactInfoTable from "./components/ContactInfoTable";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: {
      domain: '',
      infoType: 'domain',
    },
    validate: {
      domain: (value) => {
        if (!value || value.trim().length === 0) {
          return 'Please enter a domain name';
        }
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
        const cleanDomain = value.trim().toLowerCase()
          .replace(/^https?:\/\//, '')
          .replace(/^www\./, '')
          .replace(/\/$/, '');

        if (!domainRegex.test(cleanDomain)) {
          return 'Please enter a valid domain name';
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(values.domain)}&type=${encodeURIComponent(values.infoType)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);

    } catch (err) {
      console.error('Domain lookup error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>


      <Container>
        <form onSubmit={form.onSubmit(handleSubmit)} >
          <Paper withBorder shadow="md" p="xl" className={styles.formContainer}>
            <Title>Domain Info Lookup</Title>
            <Stack>
              <TextInput
                label="Enter domain name"
                placeholder="example.com"
                required
                {...form.getInputProps("domain")}
              />
              <Select
                label="Information Type"
                data={[
                  { value: 'domain', label: 'Domain Information' },
                  { value: 'contact', label: 'Contact Information' }
                ]}
                {...form.getInputProps('infoType')}
                disabled={loading}
              />
              <Button type="submit" loading={loading}>
                Lookup
              </Button>
            </Stack>
          </Paper>
        </form>

        {console.log(results)}
        {results && form.values.infoType === 'domain' && <DomainTable values={results} />}
        {results && form.values.infoType === 'contact' && <ContactInfoTable values={results} />}
        {error && (
          <Paper withBorder shadow="md" p="xl" className={styles.errorContainer}>
            <Title order={2}>Error</Title>
            <p>{error}</p>
          </Paper>
        )}
      </Container>
    </>
  );
}
