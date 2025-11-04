/**
 * Clear Seas Solutions - Enhanced Application
 * SIMPLIFIED: Uses working visualizers from vib34d-xr-quantum-sdk
 *
 * A Paul Phillips Manifestation - Paul@clearseassolutions.com
 * "The Revolution Will Not be in a Structured Format" © 2025
 */

import { WorkingQuantumVisualizer } from './visualizers/WorkingQuantumVisualizer.js';
import { DetailedScrollChoreographer } from './choreography/DetailedScrollChoreographer.js';
import { Utils, Logger } from './utils/Utils.js';

export class ClearSeasEnhancedApplication {
    constructor() {
        this.logger = new Logger('ClearSeasEnhanced', 'info');
        this.quantumVisualizer = null;
        this.detailedScrollChoreographer = null;
        this.isInitialized = false;

        this.logger.info('🌊 Clear Seas Solutions - Working Visualizer System');
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

            // Create scroll choreographer
            this.logger.info('🎬 Creating DetailedScrollChoreographer...');
            this.detailedScrollChoreographer = new DetailedScrollChoreographer(
                { visualizer: this.quantumVisualizer },
                null
            );
            this.detailedScrollChoreographer.initialize();
            this.logger.info('✅ Scroll choreography initialized');

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
