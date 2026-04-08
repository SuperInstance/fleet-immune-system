interface Threat {
  id: string;
  type: 'malware' | 'intrusion' | 'data_exfiltration' | 'ddos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  timestamp: number;
  status: 'active' | 'contained' | 'neutralized';
}

interface QuarantineRequest {
  threatId: string;
  target: string;
  duration?: number;
}

interface ImmunityScore {
  fleetId: string;
  score: number;
  lastUpdated: number;
  threatsBlocked: number;
  responseTime: number;
}

class FleetImmuneSystem {
  private threats: Map<string, Threat> = new Map();
  private immunityScores: Map<string, ImmunityScore> = new Map();
  private quarantineList: Set<string> = new Set();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample threats
    const sampleThreats: Threat[] = [
      {
        id: 'threat-001',
        type: 'malware',
        severity: 'high',
        source: '192.168.1.100',
        target: 'fleet-node-01',
        timestamp: Date.now() - 3600000,
        status: 'active'
      },
      {
        id: 'threat-002',
        type: 'intrusion',
        severity: 'critical',
        source: 'external-attacker',
        target: 'api-gateway',
        timestamp: Date.now() - 1800000,
        status: 'contained'
      }
    ];

    sampleThreats.forEach(threat => this.threats.set(threat.id, threat));

    // Sample immunity scores
    this.immunityScores.set('fleet-node-01', {
      fleetId: 'fleet-node-01',
      score: 85,
      lastUpdated: Date.now(),
      threatsBlocked: 42,
      responseTime: 150
    });

    this.immunityScores.set('api-gateway', {
      fleetId: 'api-gateway',
      score: 92,
      lastUpdated: Date.now(),
      threatsBlocked: 67,
      responseTime: 89
    });
  }

  public detectThreat(threat: Omit<Threat, 'id' | 'timestamp' | 'status'>): string {
    const threatId = `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThreat: Threat = {
      ...threat,
      id: threatId,
      timestamp: Date.now(),
      status: 'active'
    };

    this.threats.set(threatId, newThreat);
    this.updateImmunityScore(threat.target, -10);
    
    // Auto-quarantine for critical threats
    if (threat.severity === 'critical') {
      this.quarantineList.add(threat.target);
    }

    return threatId;
  }

  public quarantineTarget(request: QuarantineRequest): boolean {
    this.quarantineList.add(request.target);
    
    const threat = this.threats.get(request.threatId);
    if (threat) {
      threat.status = 'contained';
      this.generateAntibody(threat);
    }

    return true;
  }

  private generateAntibody(threat: Threat): void {
    // Simulate antibody/countermeasure generation
    console.log(`Generating antibody for threat ${threat.id} of type ${threat.type}`);
    
    // Update immunity score based on successful containment
    this.updateImmunityScore(threat.target, 5);
  }

  private updateImmunityScore(fleetId: string, delta: number): void {
    const currentScore = this.immunityScores.get(fleetId);
    if (currentScore) {
      currentScore.score = Math.max(0, Math.min(100, currentScore.score + delta));
      currentScore.lastUpdated = Date.now();
      if (delta > 0) {
        currentScore.threatsBlocked++;
      }
    }
  }

  public getThreats(): Threat[] {
    return Array.from(this.threats.values());
  }

  public getImmunityScore(fleetId?: string): ImmunityScore | ImmunityScore[] {
    if (fleetId) {
      return this.immunityScores.get(fleetId) || {
        fleetId,
        score: 0,
        lastUpdated: Date.now(),
        threatsBlocked: 0,
        responseTime: 0
      };
    }
    return Array.from(this.immunityScores.values());
  }

  public isQuarantined(target: string): boolean {
    return this.quarantineList.has(target);
  }
}

const immuneSystem = new FleetImmuneSystem();

const htmlResponse = (content: string): Response => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fleet Immune System</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0a0a0f;
      color: #ffffff;
      line-height: 1.6;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      text-align: center;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #1a1a2e;
    }
    
    h1 {
      font-size: 3rem;
      font-weight: 700;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .card {
      background: #111827;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #1e293b;
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      border-color: #dc2626;
    }
    
    .card h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #f8fafc;
    }
    
    .card p {
      color: #cbd5e1;
      margin-bottom: 1rem;
    }
    
    .stats {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #dc2626;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    
    .threat-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    .threat-critical { background-color: #dc2626; }
    .threat-high { background-color: #ea580c; }
    .threat-medium { background-color: #f59e0b; }
    .threat-low { background-color: #10b981; }
    
    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid #1a1a2e;
      color: #64748b;
      font-size: 0.875rem;
    }
    
    .api-endpoints {
      background: #1e293b;
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 2rem;
    }
    
    .endpoint {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #0f172a;
      border-radius: 6px;
    }
    
    .method {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.875rem;
      margin-right: 1rem;
    }
    
    .method.get { background-color: #10b981; color: white; }
    .method.post { background-color: #f59e0b; color: white; }
    
    .endpoint-path {
      font-family: monospace;
      color: #cbd5e1;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Fleet Immune System</h1>
      <p class="subtitle">Active threat detection and response for distributed fleet infrastructure. Real-time monitoring, automated quarantine, and adaptive countermeasures.</p>
    </header>
    
    <div class="dashboard">
      <div class="card">
        <h2>Threat Monitoring</h2>
        <p>Real-time detection of malware, intrusions, data exfiltration, and DDoS attacks across the fleet.</p>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${immuneSystem.getThreats().length}</div>
            <div class="stat-label">Active Threats</div>
          </div>
          <div class="stat">
            <div class="stat-value">${Array.from(immuneSystem.getImmunityScore() as ImmunityScore[]).reduce((acc, score) => acc + score.threatsBlocked, 0)}</div>
            <div class="stat-label">Total Blocked</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2>Herd Immunity</h2>
        <p>Collective defense scoring based on threat response effectiveness and countermeasure deployment.</p>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">${Math.round(Array.from(immuneSystem.getImmunityScore() as ImmunityScore[]).reduce((acc, score) => acc + score.score, 0) / (Array.from(immuneSystem.getImmunityScore() as ImmunityScore[]).length || 1))}%</div>
            <div class="stat-label">Fleet Average</div>
          </div>
          <div class="stat">
            <div class="stat-value">${Array.from(immuneSystem.getImmunityScore() as ImmunityScore[]).length}</div>
            <div class="stat-label">Protected Nodes</div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2>Automated Response</h2>
        <p>Instant quarantine and antibody generation for identified threats with incident response automation.</p>
        <div class="stats">
          <div class="stat">
            <div class="stat-value">&lt;150ms</div>
            <div class="stat-label">Avg Response</div>
          </div>
          <div class="stat">
            <div class="stat-value">24/7</div>
            <div class="stat-label">Protection</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="api-endpoints">
      <h2>API Endpoints</h2>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="endpoint-path">/api/threats</span>
      </div>
      <div class="endpoint">
        <span class="method post">POST</span>
        <span class="endpoint-path">/api/quarantine</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="endpoint-path">/api/immunity</span>
      </div>
      <div class="endpoint">
        <span class="method get">GET</span>
        <span class="endpoint-path">/health</span>
      </div>
    </div>
    
    <footer>
      <p>Fleet Immune System v1.0 • Active Threat Detection & Response</p>
      <p>All fleet communications are encrypted and monitored for anomalous behavior.</p>
    </footer>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'"
    }
  });
};

const handleApiRequest = async (request: Request, path: string): Promise<Response> => {
  const url = new URL(request.url);
  
  switch (path) {
    case '/api/threats': {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const threats = immuneSystem.getThreats();
      return new Response(JSON.stringify({ threats }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    case '/api/quarantine': {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      try {
        const body = await request.json() as QuarantineRequest;
        const success = immuneSystem.quarantineTarget(body);
        
        return new Response(JSON.stringify({ 
          success, 
          message: `Target ${body.target} quarantined successfully`,
          quarantineId: body.threatId
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request body' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    case '/api/immunity': {
      if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const fleetId = url.searchParams.get('fleetId');
      const immunityData = fleetId 
        ? immuneSystem.getImmunityScore(fleetId)
        : immuneSystem.getImmunityScore();
      
      return new Response(JSON.stringify({ immunity: immunityData }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    case '/health': {
      return new Response(JSON.stringify({ 
        status: 'healthy',
        timestamp: Date.now(),
        system: 'Fleet Immune System',
        version: '1.0'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    default: {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

const handler: ExportedHandler = {
  async fetch(request: Request, env: unknown, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Set security headers for all responses
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'",
      'X-Content-Type-Options': 'nosniff'
    };
    
    // Handle API routes
    if (path.startsWith('/api/') || path === '/health') {
      const response = await handleApiRequest(request, path);
      
      // Add security headers to API responses
      const headers = new Headers(response.headers);
      Object.entries(securityHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }
    
    // Serve HTML dashboard for root path
    if (path === '/' || path === '/dashboard') {
      return htmlResponse('');
    }
    
    // Default 404 response
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...securityHeaders
      }
    });
  }
};
const sh = {"Content-Security-Policy":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'none'","X-Frame-Options":"DENY"};
export default { async fetch(r: Request) { const u = new URL(r.url); if (u.pathname==='/health') return new Response(JSON.stringify({status:'ok'}),{headers:{'Content-Type':'application/json',...sh}}); return new Response(html,{headers:{'Content-Type':'text/html;charset=UTF-8',...sh}}); }};