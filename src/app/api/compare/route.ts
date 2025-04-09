import { chromium, firefox, webkit, devices } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { NextResponse } from 'next/server';

// ブラウザのシングルトンインスタンスを管理するためのクラス
class BrowserManager {
  constructor() {
    this.browser = null;
  }

  async getBrowser(browserName) {
    if (this.browser) {
      return this.browser; // ブラウザが既に起動している場合は再利用
    }

    switch (browserName) {
      case 'chromium':
        this.browser = await chromium.launch();
        break;
      case 'firefox':
        this.browser = await firefox.launch();
        break;
      case 'webkit':
        this.browser = await webkit.launch();
        break;
      default:
        throw new Error(`Invalid browser name: ${browserName}`); // エラーを投げる
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // 定期的なブラウザの再起動
  async restartBrowser(browserName) {
    await this.closeBrowser();
    this.browser = await this.getBrowser(browserName);
  }
}

const browserManager = new BrowserManager();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productionUrl = searchParams.get('productionUrl');
    const developmentUrl = searchParams.get('developmentUrl');
    const deviceName = searchParams.get('device') || 'Desktop'; // デフォルトはデスクトップ
    const browserName = searchParams.get('browser') || 'chromium'; // デフォルトは Chromium

    if (!productionUrl || !developmentUrl) {
      return NextResponse.json({ error: 'Missing productionUrl or developmentUrl' }, { status: 400 });
    }

    // ブラウザの取得
    const browser = await browserManager.getBrowser(browserName);

    let contextOptions = {};
    if (deviceName !== 'Desktop') {
      const device = devices[deviceName];
      if (!device) {
        return NextResponse.json({ error: `Invalid device name: ${deviceName}` }, { status: 400 });
      }
      contextOptions = {
        ...device,
        viewport: device.viewport, // 明示的に viewport を設定
      };
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
      // ページの読み込み完了後にスクリーンショットを取得 (フルスクリーン)

      async function takeScreenshotWithScroll(url) {
        await page.goto(url, { waitUntil: 'load', timeout: 30000 }); // タイムアウトを設定

        // ページ全体をスクロール
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500; // スクロール量
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight - window.innerHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 100); // スクロール間隔
          });
        });

        // スクロール後のコンテンツが読み込まれるのを待つ
        await page.waitForTimeout(500); // 必要に応じて調整

        return await page.screenshot({ fullPage: true });
      }


      const productionScreenshot = await takeScreenshotWithScroll(productionUrl);
      const developmentScreenshot = await takeScreenshotWithScroll(developmentUrl);

      // 画像比較処理
      const img1 = PNG.sync.read(productionScreenshot);
      const img2 = PNG.sync.read(developmentScreenshot);
      const { width, height } = img1;
      const diff = new PNG({ width, height });

      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.2 } // 差分の閾値 (調整可能)
      );

      // 差分画像をBase64エンコード
      const diffImageBuffer = PNG.sync.write(diff);
      const diffImageBase64 = `data:image/png;base64,${diffImageBuffer.toString('base64')}`;

      return NextResponse.json({ diffImageSrc: diffImageBase64, numDiffPixels });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: `Screenshot or comparison error: ${e.message}` }, { status: 500 }); // より詳細なエラーメッセージ
    } finally {
      await page.close();
      await context.close();
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: `General error: ${e.message}` }, { status: 500 }); // より詳細なエラーメッセージ
  }
}

// API が終了する際にブラウザを閉じる (例: Next.js アプリケーションの終了時)
process.on('exit', async () => {
  await browserManager.closeBrowser();
});

// 定期的なブラウザの再起動 (例: 1時間ごと)
setInterval(async () => {
  await browserManager.restartBrowser('chromium'); // chromium を再起動
}, 3600000);