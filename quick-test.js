/**
 * Quick test of deployed site
 */

const { chromium } = require('playwright');

async function quickTest() {
    console.log('🧪 Quick test of https://domusgpt.github.io/ClearSeas-Enhanced/\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 390, height: 844 }
    });
    const page = await context.newPage();

    // Capture console messages
    const messages = [];
    page.on('console', msg => {
        messages.push(`[${msg.type()}] ${msg.text()}`);
    });

    try {
        console.log('📱 Loading mobile view (390x844)...');
        await page.goto('https://domusgpt.github.io/ClearSeas-Enhanced/', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });

        await page.waitForTimeout(3000);

        console.log('\n📋 Console Messages:');
        messages.forEach(msg => console.log('  ' + msg));

        // Check canvas
        const canvas = await page.$('#quantum-background');
        console.log('\n🎨 Canvas:', canvas ? 'Found' : 'NOT FOUND');

        if (canvas) {
            const canvasRect = await canvas.boundingBox();
            console.log('  Size:', canvasRect);
            const canvasOpacity = await canvas.evaluate(el => window.getComputedStyle(el).opacity);
            console.log('  Opacity:', canvasOpacity);
            const canvasZIndex = await canvas.evaluate(el => window.getComputedStyle(el).zIndex);
            console.log('  Z-index:', canvasZIndex);
        }

        // Check cards
        const cards = await page.$$('.signal-card, .capability-card, .card');
        console.log('\n🃏 Cards found:', cards.length);

        for (let i = 0; i < Math.min(3, cards.length); i++) {
            const card = cards[i];
            const position = await card.evaluate(el => window.getComputedStyle(el).position);
            const rect = await card.boundingBox();
            const transform = await card.evaluate(el => window.getComputedStyle(el).transform);

            console.log(`\n  Card ${i}:`);
            console.log(`    Position: ${position}`);
            console.log(`    Location: x=${rect.x.toFixed(0)}, y=${rect.y.toFixed(0)}`);
            console.log(`    Size: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`);
            console.log(`    Transform: ${transform.substring(0, 50)}...`);
        }

        // Take screenshot
        await page.screenshot({
            path: '/mnt/c/Users/millz/Desktop/clearseas-quick-test.png',
            fullPage: false
        });
        console.log('\n📸 Screenshot: /mnt/c/Users/millz/Desktop/clearseas-quick-test.png');

        console.log('\n✅ Test complete');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

quickTest();
