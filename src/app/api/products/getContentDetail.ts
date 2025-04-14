// src/app/api/products/getContentDetail.ts
  // コンテンツ詳細情報の型
  type ContentDetails = {
    topics_id: string;
    subject: string;
    Contents: string;
    inst_ymdhi: string;
    update_ymdhi: string;
  };
  export const getContentDetail = async (
    content_id: string
  ): Promise<ContentDetails> => {
    const contentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/rcms-api/3/content/details/${content_id}`;
    try {
      // コンテンツ詳細データを取得
      const contentResponse = await fetch(contentUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-RCMS-API-ACCESS-TOKEN':`${process.env.NEXT_PUBLIC_API_TOKEN}`, // 必要に応じて環境変数に置き換え
          'Accept': '*/*',
        },
      });
  
      if (!contentResponse.ok) {
        console.error(`Error: ${contentResponse.status} ${contentResponse.statusText}`);
        throw new Error('Failed to fetch content details');
      }
  
      const contentData = await contentResponse.json();
      const details = contentData.details;
  
      return {
        topics_id: details.topics_id,
        subject: details.subject,
        Contents: details.contents,
        inst_ymdhi: details.inst_ymdhi,
        update_ymdhi: details.update_ymdhi,
      };
    } catch (error) {
      console.error('Error fetching content details:', error);
      throw error;
    }
  };