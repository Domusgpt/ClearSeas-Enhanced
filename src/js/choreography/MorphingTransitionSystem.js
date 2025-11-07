/**
 * MorphingTransitionSystem.js
 *
 * Card-to-card morphing and restructuring between sections
 * - Previous section's cards morph into next section's layout
 * - Text scrolls off normally, cards restructure
 * - New content manifests during transition
 * - Integrated with visualizer transitions
 *
 * © 2025 Clear Seas Solutions LLC - Paul Phillips
 */

export class MorphingTransitionSystem {
    constructor(visualizer, gsap) {
        this.visualizer = visualizer;
        this.gsap = gsap;
        this.ScrollTrigger = window.ScrollTrigger;

        // Map of sections and their card configurations
        this.sectionConfigs = new Map();

        console.log('🔄 MorphingTransitionSystem initialized');
    }

    /**
     * Register a section with its cards and layout configuration
     */
    registerSection(sectionId, config) {
        const section = document.getElementById(sectionId);
        if (!section) {
            console.warn(`Section ${sectionId} not found`);
            return;
        }

        const cards = Array.from(section.querySelectorAll(config.cardSelector || '.signal-card, .card, .capability-card'));

        this.sectionConfigs.set(sectionId, {
            section,
            cards,
            layout: config.layout || 'grid', // grid, flex, stack
            cardCount: cards.length,
            visualizerState: config.visualizerState,
            ...config
        });

        console.log(`📝 Registered section: ${sectionId} with ${cards.length} cards`);
    }

    /**
     * Setup morphing transitions between all registered sections
     */
    setupMorphingTransitions() {
        const sections = Array.from(this.sectionConfigs.keys());

        for (let i = 0; i < sections.length - 1; i++) {
            const currentSectionId = sections[i];
            const nextSectionId = sections[i + 1];

            this.createMorphTransition(currentSectionId, nextSectionId);
        }

        console.log('✅ Morphing transitions configured');
    }

    /**
     * Create morphing transition between two sections
     */
    createMorphTransition(fromSectionId, toSectionId) {
        const fromConfig = this.sectionConfigs.get(fromSectionId);
        const toConfig = this.sectionConfigs.get(toSectionId);

        if (!fromConfig || !toConfig) return;

        const fromSection = fromConfig.section;
        const toSection = toConfig.section;
        const fromCards = fromConfig.cards;
        const toCards = toConfig.cards;

        // Create a transition trigger between sections
        this.gsap.timeline({
            scrollTrigger: {
                trigger: toSection,
                start: 'top bottom',
                end: 'top center',
                scrub: 1,
                onEnter: () => this.onTransitionStart(fromConfig, toConfig),
                onUpdate: (self) => this.onTransitionProgress(fromConfig, toConfig, self.progress),
                markers: false
            }
        });

        console.log(`🔗 Morph transition: ${fromSectionId} → ${toSectionId}`);
    }

    /**
     * Called when transition starts
     */
    onTransitionStart(fromConfig, toConfig) {
        console.log(`🎬 Starting morph: ${fromConfig.section.id} → ${toConfig.section.id}`);

        // Prepare "to" cards for manifestation
        toConfig.cards.forEach((card, i) => {
            // Start hidden and scaled down
            this.gsap.set(card, {
                opacity: 0,
                scale: 0.8,
                filter: 'blur(8px)'
            });
        });
    }

    /**
     * Called during transition with progress 0-1
     */
    onTransitionProgress(fromConfig, toConfig, progress) {
        const fromCards = fromConfig.cards;
        const toCards = toConfig.cards;

        // Phase 1 (0-0.4): Disassemble "from" cards
        if (progress < 0.4) {
            const disassembleProgress = progress / 0.4;
            this.disassembleCards(fromCards, disassembleProgress);
        }

        // Phase 2 (0.3-0.7): Visualizer morphs (overlaps with phases 1 & 3)
        if (progress >= 0.3 && progress <= 0.7) {
            const morphProgress = (progress - 0.3) / 0.4;
            this.morphVisualizer(fromConfig.visualizerState, toConfig.visualizerState, morphProgress);
        }

        // Phase 3 (0.6-1.0): Assemble "to" cards
        if (progress >= 0.6) {
            const assembleProgress = (progress - 0.6) / 0.4;
            this.assembleCards(toCards, assembleProgress);
        }
    }

    /**
     * Disassemble cards from current section
     * Cards scatter, fade, break apart
     */
    disassembleCards(cards, progress) {
        cards.forEach((card, i) => {
            const delay = i * 0.1;
            const adjustedProgress = Math.max(0, Math.min(1, progress - delay));

            // Each card scatters in a different direction
            const angle = (i / cards.length) * Math.PI * 2;
            const distance = adjustedProgress * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            // Apply scatter animation
            this.gsap.set(card, {
                x: x,
                y: y,
                rotation: adjustedProgress * (Math.random() - 0.5) * 45,
                scale: 1 - adjustedProgress * 0.5,
                opacity: 1 - adjustedProgress,
                filter: `blur(${adjustedProgress * 12}px)`
            });
        });
    }

    /**
     * Morph visualizer parameters smoothly between states
     */
    morphVisualizer(fromState, toState, progress) {
        if (!this.visualizer || !this.visualizer.params) return;

        const params = this.visualizer.params;

        // Smooth interpolation
        const ease = this.easeInOutCubic(progress);

        params.geometry = this.lerp(fromState.geometry, toState.geometry, ease);
        params.hue = this.lerp(fromState.hue, toState.hue, ease);
        params.intensity = this.lerp(fromState.intensity, toState.intensity, ease);
        params.chaos = this.lerp(fromState.chaos, toState.chaos, ease);
        params.gridDensity = this.lerp(fromState.gridDensity, toState.gridDensity, ease);
        params.morphFactor = Math.sin(ease * Math.PI); // Peak at 0.5, smooth to 0 at ends

        // Extra rotation during morph
        params.rot4dXW += 0.002 * ease;
        params.rot4dYW += 0.0015 * ease;
    }

    /**
     * Assemble cards for next section
     * Cards coalesce from scattered state, new content manifests
     */
    assembleCards(cards, progress) {
        cards.forEach((card, i) => {
            const delay = i * 0.15;
            const adjustedProgress = Math.max(0, Math.min(1, progress - delay));

            // Ease in with bounce
            const easedProgress = this.easeOutBack(adjustedProgress);

            // Manifest from particles to solid
            this.gsap.set(card, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 0.8 + easedProgress * 0.2,
                opacity: easedProgress,
                filter: `blur(${(1 - easedProgress) * 8}px)`
            });

            // Content inside card fades in after card solidifies
            if (easedProgress > 0.5) {
                const contentProgress = (easedProgress - 0.5) / 0.5;
                const cardContent = card.querySelectorAll('h2, p, .signal-metadata');
                cardContent.forEach(el => {
                    this.gsap.set(el, {
                        opacity: contentProgress,
                        y: (1 - contentProgress) * 20
                    });
                });
            }
        });
    }

    /**
     * Easing functions
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Setup text scroll-off animations (text scrolls normally)
     */
    setupTextScrollOff() {
        const textElements = document.querySelectorAll('h1, h2.section-title, .hero-lede, .eyebrow');

        textElements.forEach(el => {
            this.gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top center',
                    end: 'bottom top',
                    scrub: 1,
                    onLeave: () => {
                        // Text naturally scrolls off
                        this.gsap.to(el, {
                            opacity: 0,
                            y: -50,
                            duration: 0.5
                        });
                    }
                }
            });
        });

        console.log('📜 Text scroll-off animations configured');
    }

    /**
     * Create integrated choreography
     * All systems working together
     */
    integrateWithOrthogonalChoreographer(orthogonalChoreographer) {
        // Disable orthogonal choreographer's card animations
        // We'll handle card animations through morphing system
        console.log('🔗 Integrating with OrthogonalScrollChoreographer');

        // Keep visualizer control in morphing system
        // Visualizer transitions are now tied to card morphing
    }
}

/**
 * A Paul Phillips Manifestation
 * "The Revolution Will Not be in a Structured Format"
 * © 2025 Clear Seas Solutions LLC
 */
