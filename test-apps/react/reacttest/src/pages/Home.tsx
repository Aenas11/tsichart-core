import { Link } from 'react-router-dom';
import {
    LineChart,
    Activity,
    Sparkles,
    Settings,
    Play
} from 'lucide-react';

export function Home() {
    return (
        <div className="page home-page">
            <header className="home-header">
                <h1>TSIChart Core Test Application</h1>
                <p className="subtitle">
                    Comprehensive testing environment for tsichart-core React integration
                </p>
            </header>

            <section className="intro-section">
                <h2>About This App</h2>
                <p>
                    This application serves as a testing ground for the <strong>tsichart-core</strong> library,
                    showcasing all available chart components, interactive features, and configuration options.
                </p>
                <p>
                    Navigate through the sidebar to explore different chart types and features. Each page includes
                    live examples, code snippets, and interactive configurations.
                </p>
            </section>

            <section className="features-grid">
                <div className="feature-card">
                    <LineChart size={32} />
                    <h3>Time Series Charts</h3>
                    <p>Line charts, bar charts, pie charts, heatmaps, and scatter plots</p>
                    <Link to="/charts/line" className="feature-link">Explore Charts →</Link>
                </div>

                <div className="feature-card">
                    <Sparkles size={32} />
                    <h3>Interactive Features</h3>
                    <p>Brush actions, context menus, zooming, panning, and real-time updates</p>
                    <Link to="/interactive/multi-type" className="feature-link">See Interactions →</Link>
                </div>

                <div className="feature-card">
                    <Activity size={32} />
                    <h3>UI Components</h3>
                    <p>Date pickers, availability charts, event grids, and more</p>
                    <Link to="/components/datetime-picker" className="feature-link">View Components →</Link>
                </div>

                <div className="feature-card">
                    <Settings size={32} />
                    <h3>Advanced Features</h3>
                    <p>Theme customization, data formats, tree-shaking, and styling</p>
                    <Link to="/advanced/themes" className="feature-link">Advanced Options →</Link>
                </div>
            </section>

            <section className="quick-start">
                <h2>Quick Start</h2>
                <div className="quick-start-content">
                    <div className="quick-start-step">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h4>Install the Package</h4>
                            <code>npm install tsichart-core</code>
                        </div>
                    </div>

                    <div className="quick-start-step">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h4>Import Components</h4>
                            <code>import TsiClient from 'tsichart-core'</code>
                        </div>
                    </div>

                    <div className="quick-start-step">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h4>Import Styles</h4>
                            <code>import 'tsichart-core/tsiclient.css'</code>
                        </div>
                    </div>

                    <div className="quick-start-step">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h4>Create Charts</h4>
                            <code>new tsiClient.ux.LineChart(element)</code>
                        </div>
                    </div>
                </div>
            </section>

            <section className="playground-cta">
                <Play size={48} />
                <h2>Try the Interactive Playground</h2>
                <p>Experiment with chart options and see live results</p>
                <Link to="/playground" className="cta-button">Open Playground</Link>
            </section>
        </div>
    );
}
