import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  
  // Clear persistent workspace and reload to show the test block
  await page.evaluate(() => localStorage.clear());
  // Adding the test block explicitly via script so we don't mess up workspaceStore.ts again
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('pulseboard_workspace') || '{}');
    if (!state.id) {
       // if empty, wait a tiny bit and mock it
    }
  });

  await page.reload();
  await page.waitForTimeout(1000);
  
  // Actually, we need to inject a text block into the Zustand store to test it.
  await page.evaluate(() => {
    // hack to get access to zustand
    const hackBtn = document.createElement('button');
    hackBtn.id = 'hack-add-block';
    hackBtn.onclick = () => {
      // Find the addBlock from the react tree? No, let's just click the New Text Block from sidebar if it exists.
    };
    document.body.appendChild(hackBtn);
  });

  // Let's just click the "Text" block from the sidebar
  const sidebarBtn = await page.getByRole('button', { name: /Text/i, exact: false }).first();
  if (sidebarBtn) {
    await sidebarBtn.click();
    await page.waitForTimeout(1000);
  }

  console.log("Clicking summarize via evaluate...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sumBtn = buttons.find(b => b.textContent && b.textContent.includes('Summarize'));
    if (sumBtn) sumBtn.click();
  });

  // Wait for AI logs
  await page.waitForTimeout(5000);
  
  // check DOM
  const aiBlockHTML = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.flex-col'));
    const gen = cards.find(el => el.textContent.includes('Generating summary'));
    const success = cards.find(el => el.textContent.includes('From:'));
    return { generating: !!gen, success: !!success, text: success ? success.innerText : null };
  });
  
  console.log('DOM RESULT:', aiBlockHTML);
  
  await browser.close();
})();
