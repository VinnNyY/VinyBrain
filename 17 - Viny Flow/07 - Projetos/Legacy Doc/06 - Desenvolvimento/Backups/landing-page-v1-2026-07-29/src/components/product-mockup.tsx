import { Badge } from "@/components/ui";

export function ProductMockup() {
  return (
    <div
      className="mock-browser"
      role="img"
      aria-label="Interface demonstrativa do Legacy Doc analisando uma base de código e organizando documentação técnica para revisão"
    >
      <div className="browser-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <div>/legacy-doc/report-preview</div>
      </div>
      <div className="mock-grid">
        <div className="mock-column repo-column" aria-hidden="true">
          <p className="mock-label">Repository</p>
          {["src/auth", "billing", "legacy-api", "jobs/sync", "database"].map((item, index) => (
            <span key={item} className={index === 0 ? "active" : ""}>
              {item}
            </span>
          ))}
        </div>
        <div className="mock-column analysis-column" aria-hidden="true">
          <div className="flex items-center justify-between gap-3">
            <p className="mock-label">Analysis</p>
            <Badge>Scanning</Badge>
          </div>
          <div className="scan-card">
            <span className="scan-line" />
            <code>InvoiceService.process()</code>
            <p>Dependency chain identified</p>
          </div>
          <div className="function-list">
            <span>validateUser()</span>
            <span>syncInvoice()</span>
            <span>retryPayment()</span>
          </div>
          <div className="mini-graph">
            <span>auth</span><i /><span>billing</span><i /><span>report</span>
          </div>
        </div>
        <div className="mock-column report-column" aria-hidden="true">
          <div className="flex items-center justify-between gap-3">
            <p className="mock-label">Generated report</p>
            <Badge tone="green">Review</Badge>
          </div>
          <h2>Billing module</h2>
          <p>Handles invoice lifecycle, retry jobs and status synchronization.</p>
          <div className="finding-card">
            <strong>Pending context</strong>
            <span>Business rule not present in code comments.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
