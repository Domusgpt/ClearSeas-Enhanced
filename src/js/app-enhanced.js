/**
 * Clear Seas Solutions - Enhanced Application
 * Integrated morphing transition system
 *
 * A Paul Phillips Manifestation - Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format" © 2025
 */

import { WorkingQuantumVisualizer } from './visualizers/WorkingQuantumVisualizer.js';
import { MorphingTransitionSystem } from './choreography/MorphingTransitionSystem.js';
import { Utils, Logger } from './utils/Utils.js';

export class ClearSeasEnhancedApplication {
    constructor() {
        this.logger = new Logger('ClearSeasEnhanced', 'info');
        this.quantumVisualizer = null;
        this.morphingSystem = null;
        this.isInitialized = false;

        this.logger.info('🌊 Clear Seas Solutions - Integrated Morphing System');
    }

    async initialize() {
        if (this.isInitialized) {
            this.logger.warn('Already initialized');
            return;
        }

        try {
            this.logger.info('🌌 Creating WorkingQuantumVisualizer...');

            // Create working visualizer on quantum-background canvas
            this.quantumVisualizer = new WorkingQuantumVisualizer('quantum-background', {
                role: 'background',
                reactivity: 1.0,
                variant: 0
            });

            if (!this.quantumVisualizer.gl) {
                throw new Error('Failed to create WebGL context');
            }

            this.logger.info('✅ WorkingQuantumVisualizer created with WebGL context');

            // Start render loop
            this.startRenderLoop();
            this.logger.info('✅ Render loop started');

            // Create morphing transition system
            this.logger.info('🔄 Creating MorphingTransitionSystem...');
            this.morphingSystem = new MorphingTransitionSystem(
                this.quantumVisualizer,
                window.gsap
            );

            // Register sections with their configurations
            this.registerSections();

            // Setup morphing transitions between sections
            this.morphingSystem.setupMorphingTransitions();

            // Setup text scroll-off
            this.morphingSystem.setupTextScrollOff();

            this.logger.info('✅ Integrated morphing system initialized');

            this.isInitialized = true;
            this.logger.info('🎉 Application initialized successfully');

            window.dispatchEvent(new CustomEvent('clearSeasEnhancedReady', {
                detail: { app: this }
            }));

        } catch (error) {
            this.logger.error('Initialization failed:', error);
            console.error(error);
        }
    }

    /**
     * Register all sections with morphing system
     */
    registerSections() {
        // Hero section
        this.morphingSystem.registerSection('hero', {
            cardSelector: '.signal-card',
            layout: 'grid',
            visualizerState: {
                geometry: 2, // SPHERE
                hue: 180,
                intensity: 0.6,
                chaos: 0.1,
                speed: 0.8,
                gridDensity: 20
            }
        });

        // Capabilities section
        this.morphingSystem.registerSection('capabilities', {
            cardSelector: '.capability-card',
            layout: 'grid',
            visualizerState: {
                geometry: 7, // CRYSTAL
                hue: 280,
                intensity: 0.7,
                chaos: 0.2,
                speed: 1.0,
                gridDensity: 30
            }
        });

        // Research section
        this.morphingSystem.registerSection('research', {
            cardSelector: '.card',
            layout: 'stack',
            visualizerState: {
                geometry: 5, // FRACTAL
                hue: 200,
                intensity: 0.9,
                chaos: 0.4,
                speed: 1.3,
                gridDensity: 45
            }
        });

        // Contact section
        this.morphingSystem.registerSection('contact', {
            cardSelector: '.contact-card',
            layout: 'flex',
            visualizerState: {
                geometry: 0, // TETRAHEDRON
                hue: 240,
                intensity: 0.5,
                chaos: 0.05,
                speed: 0.6,
                gridDensity: 12
            }
        });

        this.logger.info('📝 Sections registered with morphing system');
    }

    startRenderLoop() {
        const render = () => {
            if (this.quantumVisualizer) {
                this.quantumVisualizer.render();
            }
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

/**
 * A Paul Phillips Manifestation
 * © 2025 Clear Seas Solutions LLC
 */
