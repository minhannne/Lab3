
import { useEffect, useState } from 'react';
import { PUBG_VN_SQUADS } from '../data/pubg-vn-telemetry-spec';

export function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [retryTick, setRetryTick] = useState(0);

  const [view, setView] = useState({
    status: 'IDLE',
    data: null,
    error: null,
  });

  

  useEffect(() => {
    const controller = new AbortController();

    async function loadTelemetry() {
      setView({
        status: 'LOADING',
        data: null,
        error: null,
      });

      try {
        const response = await fetch(
          `/api/telemetry?squadId=${encodeURIComponent(squadId)}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          },
        );

        let payload;

        try {
          payload = await response.json();
        } catch {
          throw new Error('Invalid telemetry response.');
        }

        if (!response.ok) {
          throw new Error(
            payload.message ||
              `Telemetry request failed (${response.status}).`,
          );
        }

        if (controller.signal.aborted) {
          return;
        }

        setView({
          status: 'SUCCESS',
          data: payload,
          error: null,
        });
      } catch (err) {
        // Squad changes intentionally cancel the old request.
        // Cancellation is not a telemetry failure.
        if (
          controller.signal.aborted ||
          err.name === 'AbortError'
        ) {
          return;
        }

        setView({
          status: 'ERROR',
          data: null,
          error:
            err.message ||
            'Unable to connect to the telemetry service.',
        });
      }
    }

    loadTelemetry();

    // Cancel the previous request when the squad changes,
    // Retry is clicked, or the component unmounts.
    return () => {
      controller.abort();
    };
  }, [squadId, retryTick]);

  return (
    <main className="telemetry-panel">
      <header className="telemetry-header">
        <div>
          <p className="eyebrow">
            KRAFTON × PUBG VIETNAM SERIES
          </p>

          <h1>Live Match Telemetry</h1>

          <p>
            Squad tracking and match status radar
          </p>
        </div>

        <div className="squad-selector">
          <label htmlFor="squad-select">
            Select squad
          </label>

          <select
            id="squad-select"
            value={squadId}
            onChange={(event) => {
              setSquadId(event.target.value);
            }}
          >
            {PUBG_VN_SQUADS.map((squad) => (
              <option key={squad.id} value={squad.id}>
                {squad.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {view.status === 'IDLE' && (
        <p>Telemetry system is ready.</p>
      )}

      {view.status === 'LOADING' && (
        <section
          className="skeleton-card"
          aria-busy="true"
          aria-label="Loading match telemetry"
        >
          <div
            className="skeleton-orb"
            aria-hidden="true"
          />

          <p>Syncing KRAFTON Radar...</p>

          <div
            className="skeleton-line"
            aria-hidden="true"
          />

          <div
            className="skeleton-line short"
            aria-hidden="true"
          />
        </section>
      )}

      {view.status === 'ERROR' && (
        <section className="telemetry-error" role="alert">
          <h2>Blue-Zone Link Lost</h2>

          <p>{view.error}</p>

          <button
            type="button"
            onClick={() => {
              setRetryTick((current) => current + 1);
            }}
          >
            Reconnect Satellite (Retry)
          </button>
        </section>
      )}

      {view.status === 'SUCCESS' && view.data && (
        <article
          className="telemetry-card"
          aria-live="polite"
        >
          <div className="team-heading">
            <div>
              <p className="eyebrow">
                LIVE SQUAD STATUS
              </p>

              <h2>{view.data.name}</h2>
            </div>

            <span className="status-badge">
              {view.data.status}
            </span>
          </div>

          <dl className="telemetry-stats">
            <div>
              <dt>Map</dt>
              <dd>{view.data.map}</dd>
            </div>

            <div>
              <dt>Match phase</dt>
              <dd>{view.data.phase}</dd>
            </div>

            <div>
              <dt>Players alive</dt>
              <dd>{view.data.alive}</dd>
            </div>

            <div>
              <dt>Kills</dt>
              <dd>{view.data.kills}</dd>
            </div>

            <div>
              <dt>WWCD probability</dt>
              <dd>{view.data.wwcdProb}</dd>
            </div>
          </dl>
        </article>
      )}
    </main>
  );
}

export default PubgMatchTelemetry;
