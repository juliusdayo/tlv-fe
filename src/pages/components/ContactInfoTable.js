
import { Paper, Table, Title } from "@mantine/core";

export default function ContactInfoTable({ values }) {
    if (!values) return null;

    const { domainName, registrantName, technicalContactName, administrativeContactName, contactEmail } = values;

    const columns = [
        { field: "registrantName", label: "Registrant Name", value: registrantName || 'N/A' },
        { field: "technicalContactName", label: "Technical Contact Name", value: technicalContactName || 'N/A' },
        { field: "administrativeContactName", label: "Administrative Contact Name", value: administrativeContactName || 'N/A' },
        { field: "contactEmail", label: "Contact Email", value: contactEmail || 'N/A' },
    ];

    return (
        <Paper withBorder shadow="md" p="xl" m="lg">
            <Title order={2} mb="md">{domainName && `Contact information for ${domainName}`}</Title>
            <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                    {columns.map((col, index) => (
                        <Table.Tr key={col.field}>
                            <Table.Th w={index === 0 ? 160 : undefined}>{col.label}</Table.Th>
                            <Table.Td>{col.value}</Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Paper>
    );
}