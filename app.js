const { useState, useEffect } = React;

function App() {
  const [page, setPage] = useState("dashboard");
  const [properties, setProperties] = useState(() => JSON.parse(localStorage.getItem("properties") || "[]"));
  const [tenants, setTenants] = useState(() => JSON.parse(localStorage.getItem("tenants") || "[]"));
  const [leases, setLeases] = useState(() => JSON.parse(localStorage.getItem("leases") || "[]"));

  useEffect(() => localStorage.setItem("properties", JSON.stringify(properties)), [properties]);
  useEffect(() => localStorage.setItem("tenants", JSON.stringify(tenants)), [tenants]);
  useEffect(() => localStorage.setItem("leases", JSON.stringify(leases)), [leases]);

  return (
    <div style={{display:"flex"}}>
      <aside className="sidebar">
        <h2>Rental PMS</h2>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("properties")}>Properties</button>
        <button onClick={() => setPage("tenants")}>Tenants</button>
        <button onClick={() => setPage("leases")}>Leases</button>
      </aside>

      <main className="main">
        {page === "dashboard" && <Dashboard properties={properties} tenants={tenants} leases={leases} />}
        {page === "properties" && <Properties properties={properties} setProperties={setProperties} />}
        {page === "tenants" && <Tenants tenants={tenants} setTenants={setTenants} />}
        {page === "leases" && (
          <Leases leases={leases} setLeases={setLeases} tenants={tenants} properties={properties} />
        )}
      </main>
    </div>
  );
}

function Dashboard({ properties, tenants, leases }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Properties: {properties.length}</p>
      <p>Total Tenants: {tenants.length}</p>
      <p>Total Leases: {leases.length}</p>
    </div>
  );
}

function Properties({ properties, setProperties }) {
  const [name, setName] = useState("");

  function addProperty() {
    if (!name.trim()) return;
    setProperties([...properties, { id: Date.now(), name }]);
    setName("");
  }

  return (
    <div>
      <h1>Properties</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Property name" />
      <button onClick={addProperty}>Add</button>

      <ul>
        {properties.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}

function Tenants({ tenants, setTenants }) {
  const [name, setName] = useState("");

  function addTenant() {
    if (!name.trim()) return;
    setTenants([...tenants, { id: Date.now(), name }]);
    setName("");
  }

  return (
    <div>
      <h1>Tenants</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Tenant name" />
      <button onClick={addTenant}>Add</button>

      <ul>
        {tenants.map(t => <li key={t.id}>{t.name}</li>)}
      </ul>
    </div>
  );
}

function Leases({ leases, setLeases, tenants, properties }) {
  const [selectedTenant, setSelectedTenant] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  function addLease() {
    if (!selectedTenant || !selectedProperty) return;
    setLeases([...leases, { id: Date.now(), tenant: selectedTenant, property: selectedProperty }]);
    setSelectedTenant("");
    setSelectedProperty("");
  }

  return (
    <div>
      <h1>Leases</h1>

      <select value={selectedTenant} onChange={e => setSelectedTenant(e.target.value)}>
        <option value="">Select Tenant</option>
        {tenants.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
      </select>

      <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)}>
        <option value="">Select Property</option>
        {properties.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
      </select>

      <button onClick={addLease}>Add Lease</button>

      <ul>
        {leases.map(l => (
          <li key={l.id}>{l.tenant} → {l.property}</li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
