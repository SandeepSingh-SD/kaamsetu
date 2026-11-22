import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { navy: '#102544', orange: '#f1873c', cream: '#faf8f4', ink: '#152238', muted: '#667085', line: '#e8e6e1' }, boxShadow: { soft: '0 12px 40px rgba(16,37,68,.08)' } } }, plugins: [] };
export default config;
