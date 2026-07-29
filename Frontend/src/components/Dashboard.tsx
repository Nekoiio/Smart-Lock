import logo from '../assets/logo.png';
import './Dashboard.css';

export type DeviceStatus = 'locked' | 'unlocked' | 'pending';

export interface Device {
  id: string;
  name: string;
  status: DeviceStatus;
  localIp?: string;
}

interface DashboardProps {
  devices: Device[];
  loading?: boolean;
  onUnlock: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateDevice: (data: { name: string; status: DeviceStatus; localIp: string }) => void;
}

function statusLabel(status: DeviceStatus) {
  if (status === 'locked') return 'LOCKED';
  if (status === 'unlocked') return 'UNLOCKED';
  return 'PENDING';
}

export default function Dashboard({
  devices,
  loading = false,
  onUnlock,
  onDelete,
  onCreateDevice,
}: DashboardProps) {
  function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    onCreateDevice({
      name: String(formData.get('name') ?? ''),
      status: (formData.get('status') as DeviceStatus) ?? 'locked',
      localIp: String(formData.get('localIp') ?? ''),
    });
    form.reset();
  }

  return (
    <div className="dash">
      <div className="dash__scanlines" aria-hidden="true" />
      <div className="dash__logo-banner">
        <img src={logo} alt="Smart Lock" className="dash__logo-banner-img" />
      </div>

      <header className="dash__header">
        <span className="dash__eyebrow">ACCESS CONTROL</span>
        <div className="dash__header-side dash__header-side--right">
          <span className="dash__status-dot" />
          <span className="dash__eyebrow">SYSTEM ONLINE</span>
        </div>
      </header>

      <main className="dash__main">
        <section className="panel panel--form">
          <div className="panel__corner panel__corner--tl" />
          <div className="panel__corner panel__corner--br" />
          <h2 className="panel__title">Register Device</h2>
          <form className="dash-form" onSubmit={handleCreateSubmit}>
            <label className="dash-form__field">
              <span>Name</span>
              <input name="name" type="text" placeholder="front-door" required />
            </label>
            <label className="dash-form__field">
              <span>Status</span>
              <select name="status" defaultValue="locked">
                <option value="locked">Locked</option>
                <option value="unlocked">Unlocked</option>
                <option value="pending">Pending</option>
              </select>
            </label>
            <label className="dash-form__field">
              <span>Local IP</span>
              <input name="localIp" type="text" placeholder="192.168.1.50" />
            </label>
            <button type="submit" className="btn btn--primary">
              Deploy Device
            </button>
          </form>
        </section>

        <section className="panel panel--devices">
          <div className="panel__corner panel__corner--tl" />
          <div className="panel__corner panel__corner--br" />
          <h2 className="panel__title">Devices</h2>

          {loading && <p className="dash__empty">Reading device table…</p>}

          {!loading && devices.length === 0 && (
            <p className="dash__empty">No devices registered yet.</p>
          )}

          {!loading && devices.length > 0 && (
            <div className="device-grid">
              {devices.map((d) => (
                <div className="device-card" key={d.id} data-status={d.status}>
                  <div className="device-card__row">
                    <span className={`led led--${d.status}`} />
                    <span className="device-card__name">{d.name}</span>
                  </div>
                  <div className="device-card__row device-card__row--meta">
                    <span className={`pill pill--${d.status}`}>{statusLabel(d.status)}</span>
                    {d.localIp && <span className="device-card__ip">{d.localIp}</span>}
                  </div>
                  <div className="device-card__actions">
                    <button className="btn btn--ghost" onClick={() => onUnlock(d.id)}>
                      Unlock
                    </button>
                    <button className="btn btn--danger" onClick={() => onDelete(d.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
   
    </div>
  );
}
/*
      <footer className="dash__footer">
        <img src={logo} alt="Smart Lock" className="dash__footer-logo" />
      </footer>
      */