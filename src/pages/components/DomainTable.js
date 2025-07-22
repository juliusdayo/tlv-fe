
import { Paper, Table, Title } from "@mantine/core";


export default function DomainTable({ values }) {
    if (!values) return null;

    const { domainName, registrarName, registrationDate, expirationDate, estimatedDomainAge, hostnames } = values;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const formatDomainAge = (age) => {
        if (!age) return 'N/A';
        return `${age} days`;
    };

    const formatHostnames = (hostnames) => {
        if (!hostnames) return 'N/A';
        if (typeof hostnames === 'string') {
            const formatted = hostnames.split(',').map(hostname => hostname.trim()).join(', ');
            if (formatted.length > 25) {
                return formatted.substring(0, 25) + '...';
            }
            return formatted;
        }
        return hostnames;
    }

    const columns = [
        { field: "registrarName", label: "Registrar Name", value: registrarName || 'N/A' },
        { field: "registrationDate", label: "Registration Date", value: formatDate(registrationDate) },
        { field: "expirationDate", label: "Expiration Date", value: formatDate(expirationDate) },
        { field: "estimatedDomainAge", label: "Estimated Domain Age", value: formatDomainAge(estimatedDomainAge) },
        { field: "hostnames", label: "Hostnames", value: formatHostnames(hostnames) },
    ];
    return (

        <Paper withBorder shadow="md" p="xl" m="lg" >
            <Title order={2} mb="md"> {domainName && `Here is the information for ${domainName}`}</Title>
            <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                    {columns.map((col, index) => (
                        <Table.Tr key={col.field}>
                            <Table.Th style={{ backgroundColor: 'gray' }}>{col.label}</Table.Th>
                            <Table.Td>{col.value}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Paper >
    )

}