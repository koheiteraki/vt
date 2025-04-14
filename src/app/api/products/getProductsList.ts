// api/products.ts

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_BASE_URL}/rcms-api/3/products`;
const API_TOKEN = `${process.env.NEXT_PUBLIC_API_TOKEN}`;

export interface Product {
  topics_id: number;
  ymd: string;
  contents_type: number;
  contents: string;
  subject: string;
  topics_flg: number;
  open_flg: number;
  regular_flg: number;
  inst_ymdhi: string;
  update_ymdhi: string;
  topics_group_id: number;
  slug: string;
  order_no: number;
  group_nm: string;
  group_description: string;
  contents_type_cnt: number;
  contents_type_nm: string;
  contents_type_slug: string | null;
  contents_type_parent_nm: string | null;
  category_parent_id: number | null;
  contents_type_ext_col_01: string | null;
  contents_type_ext_col_02: string | null;
  contents_type_ext_col_03: string | null;
  contents_type_ext_col_04: string | null;
  contents_type_ext_col_05: string | null;
  contents_type_list: number[];
  ext_1: {
    id: string;
    url: string;
    desc: string;
    url_org: string;
  };
  ext_2: {
    id: string;
    url: string;
    desc: string;
    url_org: string;
  };
  ext_3: {
    id: string;
    url: string;
    desc: string;
    url_org: string;
  };
  ext_4: {
    id: string;
    url: string;
    desc: string;
    url_org: string;
  };
  ext_5: {
    id: string;
    url: string;
    desc: string;
    url_org: string;
  };
}

export interface PageInfo {
  totalCnt: number;
  perPage: number;
  totalPageCnt: number;
  pageNo: number;
  firstIndex: number;
  lastIndex: number;
  path: string;
  param: string;
  startPageNo: number;
  endPageNo: number;
}

export interface ApiResponse {
  errors: { code: string; message: string }[];
  messages: { type: string; content: string }[];
  list: Product[];
  pageInfo: PageInfo;
}

export const getAllProducts = async (): Promise<{
  list: Product[];
  count: number;
}> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        ...(API_TOKEN && { 'X-RCMS-API-ACCESS-TOKEN': API_TOKEN }),
      },
    }).catch((error) => {
      console.error('Network error:', error);
      throw new Error('Network error occurred while fetching products.');
    });

    if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please check your API token.');
        }
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

    const data: ApiResponse = await response.json();

    return {
      list: data.list,
      count: data.pageInfo.totalCnt,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};