// Imported dynamically in the browser only (see agreement-tool.tsx).
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { agreementSections, type AgreementData } from "@/lib/agreement";

const s = StyleSheet.create({
  page: { paddingTop: 48, paddingBottom: 64, paddingHorizontal: 54, fontSize: 10, fontFamily: "Helvetica", lineHeight: 1.45, color: "#111" },
  title: { fontSize: 17, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  sub: { fontSize: 9, color: "#555", marginBottom: 14 },
  h2: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 3 },
  p: { marginBottom: 4 },
  sigRow: { flexDirection: "row", marginTop: 34 },
  sigBox: { flex: 1, borderTopWidth: 1, borderTopColor: "#111", paddingTop: 4, marginRight: 24 },
  sigLabel: { fontSize: 8.5, color: "#444" },
  footer: { position: "absolute", bottom: 26, left: 54, right: 54, fontSize: 7, color: "#666" },
});

export function AgreementPdf({ d }: { d: AgreementData }) {
  const sections = agreementSections(d);
  return (
    <Document title="Subcontractor Agreement" author={d.builder || "Contractor"}>
      <Page size="LETTER" style={s.page} wrap>
        <Text style={s.title}>Subcontractor Agreement</Text>
        <Text style={s.sub}>{d.state ? `Residential construction, ${d.state}` : "Residential construction"}</Text>
        {sections.map((sec) => (
          <View key={sec.h} wrap>
            <Text style={s.h2}>{sec.h}</Text>
            {sec.p.map((para, i) => (
              <Text key={i} style={s.p}>
                {para}
              </Text>
            ))}
          </View>
        ))}
        <View style={s.sigRow} wrap={false}>
          <View style={s.sigBox}>
            <Text>{d.builder || "Contractor"}</Text>
            <Text style={s.sigLabel}>Signature, name, title, date</Text>
          </View>
          <View style={s.sigBox}>
            <Text>{d.sub || "Subcontractor"}</Text>
            <Text style={s.sigLabel}>Signature, name, title, date</Text>
          </View>
        </View>
        <Text style={s.footer} fixed>
          Template only, not legal advice. Construction, licensing, lien and indemnity rules differ by state. Have a licensed attorney
          {d.state ? ` in ${d.state}` : ""} review this agreement before you rely on it.
        </Text>
      </Page>
    </Document>
  );
}
