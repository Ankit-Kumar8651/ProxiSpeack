import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Volume2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Code2,
} from 'lucide-react';

export const HowItWorksPage = () => {
  return (
    <div style={{ padding: '3rem 0', flex: 1 }}>
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 3.5rem auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--accent-secondary)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Cpu size={16} /> Technical Architecture & Physics
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            How ProxiSpeak Functions Under the Hood
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            A transparent walkthrough of our 2D coordinate model, distance attenuation mathematics,
            Web Audio API nodes, and peer-to-peer real-time communication.
          </p>
        </div>

        {/* 4 Pillars of Architecture */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          {/* Pillar 1 */}
          <div
            className="ui-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                01
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Virtual 2D Coordinate Grid
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>
                ProxiSpeak uses a clean virtual canvas grid (e.g. 1000px × 650px) where each avatar's position
                is tracked as <code>(x, y)</code> pixels. This is strictly a virtual office layout—not physical GPS
                tracking.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--status-available)" />
                  <span>Bounded coordinate space with strict boundary clamping</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--status-available)" />
                  <span>AABB (Axis-Aligned Bounding Box) collision detection around desks and walls</span>
                </li>
              </ul>
            </div>

            <div
              style={{
                background: '#0F172A',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#E2E8F0',
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>// Collision & Position Check</div>
              <div>
                <span style={{ color: '#F472B6' }}>const</span> isColliding = (x, y, radius) =&gt; &#123;
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#F472B6' }}>return</span> obstacles.some(obs =&gt; (
              </div>
              <div style={{ paddingLeft: '2rem', color: '#38BDF8' }}>
                x + radius &gt; obs.x &amp;&amp; x - radius &lt; obs.x + obs.w &amp;&amp;<br />
                y + radius &gt; obs.y &amp;&amp; y - radius &lt; obs.y + obs.h
              </div>
              <div style={{ paddingLeft: '1rem' }}>));</div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            className="ui-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(34, 211, 238, 0.15)',
                  color: '#22D3EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                02
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Euclidean Distance & Audio Attenuation
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>
                Whenever any avatar moves, distance to all other participants is calculated using the Pythagorean
                theorem. The resulting distance drives the audio gain from 1.0 (touching) down to 0.0 (past 200px).
              </p>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Linear attenuation formula: <code>Gain = Math.max(0, 1 - (distance / MAX_AUDIBLE_RANGE))</code>
              </div>
            </div>

            <div
              style={{
                background: '#0F172A',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#E2E8F0',
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>// Audio Gain Calculation</div>
              <div>
                <span style={{ color: '#F472B6' }}>const</span> calculateGain = (p1, p2) =&gt; &#123;
              </div>
              <div style={{ paddingLeft: '1rem', color: '#FCD34D' }}>
                const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#F472B6' }}>if</span> (dist &gt; AUDIBLE_RANGE) <span style={{ color: '#F472B6' }}>return</span> 0;
              </div>
              <div style={{ paddingLeft: '1rem', color: '#4ADE80' }}>
                // Smooth linear falloff
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                <span style={{ color: '#F472B6' }}>return</span> Math.max(0, 1 - dist / AUDIBLE_RANGE);
              </div>
              <div>&#125;;</div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            className="ui-card"
            style={{
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                03
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Web Audio API Processing Graph
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1rem' }}>
                Incoming audio streams pass through a chain of Web Audio API nodes: a <code>MediaStreamSource</code>,
                connected to a <code>GainNode</code> for distance attenuation, and a <code>StereoPannerNode</code>
                for left/right directional spatialization.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Source &rarr; GainNode (Volume) &rarr; StereoPannerNode (Direction) &rarr; AudioContext.destination
              </div>
            </div>

            <div
              style={{
                background: '#0F172A',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#E2E8F0',
                lineHeight: 1.6,
              }}
            >
              <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>// Web Audio API Node Graph</div>
              <div>const ctx = new AudioContext();</div>
              <div>const source = ctx.createMediaStreamSource(stream);</div>
              <div>const gainNode = ctx.createGain();</div>
              <div>const panner = ctx.createStereoPanner();</div>
              <div style={{ marginTop: '0.5rem', color: '#38BDF8' }}>
                source.connect(gainNode);<br />
                gainNode.connect(panner);<br />
                panner.connect(ctx.destination);
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/office/main-hq" className="btn btn-primary btn-lg">
            Try the Live 2D Office <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
