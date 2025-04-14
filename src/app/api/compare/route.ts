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
    const developmentUsername = searchParams.get('developmentUsername') || '';
    const developmentPassword = searchParams.get('developmentPassword') || '';
    console.log('API: ', developmentUsername, developmentPassword); // ログ追加

    if (!productionUrl || !developmentUrl) {
      return NextResponse.json({ error: 'Missing productionUrl or developmentUrl' }, { status: 400 });
    }

    // ブラウザの取得
    const browser = await browserManager.getBrowser(browserName);

    // デバイス設定
    let contextOptions = {};
    let viewport = null;  // ビューポートをnullで初期化
    if (deviceName === 'Desktop') {
      viewport = { width: 1920, height: 1080 }; // デスクトップのビューポートを設定
      contextOptions = {
        viewport: viewport,
        httpCredentials: {
          username: developmentUsername,
          password: developmentPassword,
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      };
    } else {
      const device = devices[deviceName];
      if (!device) {
        return NextResponse.json({ error: `Invalid device name: ${deviceName}` }, { status: 400 });
      }
      viewport = device.viewport; // モバイルデバイスのビューポートを取得
      contextOptions = {
        ...device, // モバイルデバイスのプロファイルを適用
        httpCredentials: {
          username: developmentUsername,
          password: developmentPassword,
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      };
    }


    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
      // Production URL のページを読み込み
      console.log('Navigating to production URL with authentication...');
      await page.goto(productionUrl, { waitUntil: 'load', timeout: 35000 });
      console.log('Production page loaded.');

      // スクリーンの高さ全体を取得
      const productionHeight = await page.evaluate(() => Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
      ));

      if (viewport) {
          await page.setViewportSize({
              width: viewport.width,
              height: productionHeight
          });
      }


      const productionScreenshot = await page.screenshot({ fullPage: true });

      // Development URL のページを読み込み
      console.log('Navigating to development URL with authentication...');
      await page.goto(developmentUrl, {
        waitUntil: 'load',
        timeout: 35000,
      });
      console.log('Development page loaded.');

      // スクリーンの高さ全体を取得
      const developmentHeight = await page.evaluate(() => Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
      ));

      if (viewport) {
          await page.setViewportSize({
              width: viewport.width,
              height: developmentHeight
          });
      }


      const developmentScreenshot = await page.screenshot({ fullPage: true });

      // 差分比較処理
      const img1 = PNG.sync.read(productionScreenshot);
      const img2 = PNG.sync.read(developmentScreenshot);
      const width = Math.min(img1.width, img2.width);
      const height = Math.min(img1.height, img2.height);

      const resizedImg1 = new PNG({ width, height });
      const resizedImg2 = new PNG({ width, height });

      PNG.bitblt(img1, resizedImg1, 0, 0, width, height, 0, 0);
      PNG.bitblt(img2, resizedImg2, 0, 0, width, height, 0, 0);
      const diff = new PNG({ width, height });

      // **差分チェックオプション**:
      // ここに差分チェックのオプション (閾値、色など) を追加できます。
      const numDiffPixels = pixelmatch(
        resizedImg1.data,
        resizedImg2.data,
        diff.data,
        width,
        height,
        { threshold: 0.3 } // 差分の閾値 (調整可能)
      );

      // 差分画像をBase64エンコード
      const diffImageBuffer = PNG.sync.write(diff);
      const diffImageBase64 = `data:image/png;base64,${diffImageBuffer.toString('base64')}`;

      return NextResponse.json({ diffImageSrc: diffImageBase64, numDiffPixels });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: `Screenshot or comparison error: ${e.message}` }, { status: 500 });
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