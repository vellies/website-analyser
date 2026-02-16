import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#eeeeee',
        paddingBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#09090b',
        marginBottom: 4,
    },
    url: {
        fontSize: 10,
        color: '#6366f1',
        marginBottom: 10,
    },
    scoreHero: {
        marginVertical: 15,
        padding: 20,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroScoreCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#09090b',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroScoreText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    heroLabelContainer: {
        flex: 1,
        marginLeft: 20,
    },
    heroLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#64748b',
        marginBottom: 4,
    },
    heroVerdict: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0f172a',
        fontStyle: 'italic',
    },
    section: {
        marginTop: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#09090b',
        marginBottom: 12,
        borderLeft: 4,
        borderLeftColor: '#6366f1',
        paddingLeft: 10,
    },
    benchmarkMetric: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fafafa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    metricHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    metricTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    metricScore: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    subSectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: 8,
        marginBottom: 6,
    },
    strengthList: {
        marginBottom: 8,
    },
    strengthItem: {
        fontSize: 9,
        color: '#16a34a',
        marginBottom: 2,
        flexDirection: 'row',
    },
    gapItem: {
        fontSize: 9,
        color: '#334155',
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#fff1f2',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    gapLabel: {
        fontWeight: 'bold',
        color: '#be123c',
    },
    gapFix: {
        marginTop: 2,
        color: '#6366f1',
        fontWeight: 'bold',
    },
    auditCategory: {
        marginBottom: 15,
    },
    auditCategoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        padding: 8,
        borderRadius: 6,
        marginBottom: 4,
    },
    auditCategoryName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    auditCategoryScore: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    auditCategoryDetails: {
        fontSize: 9,
        color: '#64748b',
        fontStyle: 'italic',
        backgroundColor: '#fcfcfc',
        padding: 6,
        marginBottom: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    auditItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    auditStatus: {
        width: 50,
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    auditLabel: {
        fontSize: 10,
        color: '#334155',
        fontWeight: 'bold',
    },
    auditMessage: {
        fontSize: 9,
        color: '#64748b',
        marginTop: 2,
    },
    gapTitle: {
        fontSize: 10,
        color: '#0f172a',
        fontWeight: 'bold',
    },
    recommendationItem: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#eff6ff',
        borderRadius: 8,
    },
    recommendationBullet: {
        width: 20,
        fontSize: 11,
        color: '#2563eb',
        fontWeight: 'bold',
    },
    recommendationText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
        color: '#1e3a8a',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: '#94a3b8',
    },
    pageNumber: {
        fontSize: 8,
        color: '#94a3b8',
        fontWeight: 'bold',
    }
});

interface ReportPDFProps {
    data: any;
    decodedUrl: string;
}

export const ReportPDF = ({ data, decodedUrl }: ReportPDFProps) => {
    const { analysis, scrapedData, overallReferenceScore, referenceVerdict, parsedReferenceMetrics } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>{scrapedData?.title || decodedUrl}</Text>
                    <Text style={styles.url}>{data.url}</Text>
                </View>

                <View style={styles.scoreHero}>
                    <View style={styles.heroScoreCircle}>
                        <Text style={styles.heroScoreText}>{overallReferenceScore ?? 0}%</Text>
                    </View>
                    <View style={styles.heroLabelContainer}>
                        <Text style={styles.heroLabel}>AI Commerce Readiness Score</Text>
                        <Text style={styles.heroVerdict}>"{referenceVerdict}"</Text>
                    </View>
                </View>

                {/* AI Commerce Benchmark Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>AI Commerce Benchmark</Text>
                    {parsedReferenceMetrics?.map((metric: any, idx: number) => (
                        <View key={idx} style={styles.benchmarkMetric} wrap={false}>
                            <View style={styles.metricHeader}>
                                <Text style={styles.metricTitle}>{metric.title}</Text>
                                <Text style={styles.metricScore}>{metric.score} - {metric.status}</Text>
                            </View>

                            {metric.implementedItems && metric.implementedItems.length > 0 && (
                                <View>
                                    <Text style={[styles.subSectionTitle, { color: '#16a34a' }]}>Strengths</Text>
                                    <View style={styles.strengthList}>
                                        {metric.implementedItems.map((item: string, iIdx: number) => (
                                            <Text key={iIdx} style={styles.strengthItem}>• {item}</Text>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {metric.missingItems && metric.missingItems.length > 0 && (
                                <View>
                                    <Text style={[styles.subSectionTitle, { color: '#be123c' }]}>Improvement Gaps</Text>
                                    {metric.missingItems.map((item: any, mIdx: number) => (
                                        <View key={mIdx} style={styles.gapItem}>
                                            <Text style={styles.gapTitle}>
                                                <Text style={styles.gapLabel}>GAP: </Text>{item.label}
                                            </Text>
                                            {item.description && (
                                                <Text style={styles.auditMessage}>{item.description}</Text>
                                            )}
                                            {item.fix && (
                                                <Text style={[styles.gapFix, { marginTop: 4 }]}>
                                                    <Text style={{ fontSize: 8, color: '#4f46e5' }}>FIX: </Text>{item.fix}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                {/* Technical Live Audit Section */}
                <View style={styles.section} break>
                    <Text style={styles.sectionTitle}>Technical Live Audit</Text>
                    {analysis?.categories?.map((category: any, idx: number) => (
                        <View key={idx} style={styles.auditCategory}>
                            <View style={styles.auditCategoryHeader}>
                                <Text style={styles.auditCategoryName}>{category.name}</Text>
                                <Text style={styles.auditCategoryScore}>{category.score}%</Text>
                            </View>
                            {category.details && (
                                <Text style={styles.auditCategoryDetails}>"{category.details}"</Text>
                            )}
                            {category?.items?.map((item: any, iIdx: number) => (
                                <View key={iIdx} style={styles.auditItem} wrap={false}>
                                    <Text style={[
                                        styles.auditStatus,
                                        { color: item.status === 'pass' ? '#16a34a' : item.status === 'warning' ? '#ca8a04' : '#dc2626' }
                                    ]}>
                                        {item.status}
                                    </Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.auditLabel}>{item.label}</Text>
                                        <Text style={styles.auditMessage}>{item.message}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Growth Roadmap Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Strategic Growth Roadmap</Text>
                    {analysis?.recommendations?.map((rec: string, idx: number) => (
                        <View key={idx} style={styles.recommendationItem} wrap={false}>
                            <Text style={styles.recommendationBullet}>{idx + 1}.</Text>
                            <Text style={styles.recommendationText}>{rec}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Website Analyzer Report • Generated on {new Date().toLocaleDateString()}
                    </Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `Page ${pageNumber} of ${totalPages}`
                    )} />
                </View>
            </Page>
        </Document>
    );
};
