import { chromium, firefox, webkit, devices, Browser } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { NextResponse } from 'next/server';

// ブラウザのシングルトンインスタンスを管理するためのクラス
class BrowserManager {
  private browser: Browser | null; // 型定義を追加
  constructor() {
    this.browser = null;
  }
  async getBrowser(browserName: string): Promise<Browser> {
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

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // 定期的なブラウザの再起動
  async restartBrowser(browserName: string): Promise<Browser> {
    await this.closeBrowser();
    return this.getBrowser(browserName);
  }
}

const browserManager = new BrowserManager();

export async function GET(request: Request) {
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
    let contextOptions: Record<string, string | number | boolean | object | null> = {};
    let viewport = null;  // ビューポートをnullで初期化
    if (deviceName === 'Desktop') {
      viewport = { width: 1280, height: 720 }; // デスクトップのビューポートを設定
      contextOptions = {
        viewport: viewport,
        httpCredentials: {
          username: developmentUsername,
          password: developmentPassword,
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      };
    } else if (deviceName === 'iPhone') {
      const device = devices['iPhone 11'];
      viewport = device.viewport;
      contextOptions = {
        ...device,
        httpCredentials: {
          username: developmentUsername,
          password: developmentPassword,
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      };
            // Firefox の場合は isMobile を削除
            if (browserName === 'firefox') {
              delete contextOptions.isMobile;
            }
    } else if (deviceName === 'Android') {
      const device = devices['Pixel 5'];
      viewport = device.viewport;
      contextOptions = {
        ...device,
        httpCredentials: {
          username: developmentUsername,
          password: developmentPassword,
        },
        bypassCSP: true,
        ignoreHTTPSErrors: true,
      };
            // Firefox の場合は isMobile を削除
            if (browserName === 'firefox') {
              delete contextOptions.isMobile;
            }
    } else {
      return NextResponse.json({ error: `Invalid device name: ${deviceName}` }, { status: 400 });
    }


    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
      // Production URL のページを読み込み
      console.log('production URLを読み込み中です');
      await page.goto(productionUrl, { waitUntil: 'load', timeout: 10000 });
      // ページをスクロールしてすべての要素を表示
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const scroll = () => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    resolve();
                    return;
                }
                requestAnimationFrame(scroll);
            };
            scroll();
        });
    });
      console.log('Production URLの読み込みが完了しました');

      // スクロール後に1秒待機
      await page.waitForTimeout(1000);
      // スクロール後にスクリーンショットを取得
      const productionScreenshot = await page.screenshot({ fullPage: true});
      console.log('Production URLのスクショが完了しました');

      // Development URL のページを読み込み
      console.log('development URLを読み込み中です');;
      await page.goto(developmentUrl, {
        waitUntil: 'load',
        timeout: 20000,
      });
            // ページをスクロールしてすべての要素を表示
            await page.evaluate(async () => {
              await new Promise<void>((resolve) => {
                  let totalHeight = 0;
                  const distance = 100;
                  const scroll = () => {
                      const scrollHeight = document.body.scrollHeight;
                      window.scrollBy(0, distance);
                      totalHeight += distance;
                      if (totalHeight >= scrollHeight) {
                          resolve();
                          return;
                      }
                      requestAnimationFrame(scroll);
                  };
                  scroll();
              });
          });
      console.log('Development URLの読み込みが完了しました');

      // スクロール後に1秒待機
      await page.waitForTimeout(1000);
      const developmentScreenshot = await page.screenshot({ fullPage: true});
      console.log('Development URLのスクショが完了しました');

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
        { threshold: 0.1, }
         // 差分の閾値 (調整可能)
      );

      const productionImageBase64 = `data:image/png;base64,${productionScreenshot.toString('base64')}`;
      const developmentImageBase64 = `data:image/png;base64,${developmentScreenshot.toString('base64')}`;
      // 差分画像をBase64エンコード
      const diffImageBuffer = PNG.sync.write(diff);
      const diffImageBase64 = `data:image/png;base64,${diffImageBuffer.toString('base64')}`;

      return NextResponse.json({
        diffImageSrc: diffImageBase64,
        numDiffPixels,
        productionImageSrc: productionImageBase64,
        developmentImageSrc: developmentImageBase64,
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message); // エラーメッセージを安全に取得
      } else {
        console.error('An unknown error occurred:', e); // 型が不明な場合の処理
      }
      return NextResponse.json({ error: `Screenshot or comparison error: ${e instanceof Error ? e.message : 'Unknown error'}` }, { status: 500 });
    } finally {
      await page.close();
      await context.close();
    }
  } catch (e) {
    console.error('Unknown error:', e); // 型が不明な場合の処理
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}
