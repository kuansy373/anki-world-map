export const geoPaths = {
  placeholder: { key: 'countriesLow', path: './data/countries-low.geojson' },
  countries:   { path: './data/countries.geojson', type: 'polygon' },
  onDemand: {
    antarctica:        { path: './data/antarctica.geojson', type: 'polygon' },
    usaStates:         { path: './data/us-states.geojson', type: 'polygon' },
    chinaProvinces:    { path: './data/china-provinces.geojson', type: 'polygon' },
    japanPrefectures:  { path: './data/japan-prefectures.geojson', type: 'polygon' },
    japanOldProvinces: { path: './data/japan-old-provinces.geojson', type: 'polygon' },
    dateLine:          { path: './data/international-date-line.geojson', type: 'line' },
  }
};

// 地域別カラー設定
export const regionColors = {
  Europe: '#6ac3be',
  Africa: '#81ca98',
  'Middle East': '#b2b379',
  Asia: '#fa9eaa',
  Oceania: '#eb9272',
  'North America': '#c0d288',
  'South America': '#a3d3d8',
  Antarctica: '#a7b5ff',
  Default: '#000000',
  'USA States': '#98ccae',
  'China Provinces': '#eda398',
  'Japan Prefectures': '#ffd3cf',
  'Japan Old Provinces': '#adb1de',
};

// ビュー設定
export const regionView = {
  'Europe': { center: [14, 52], zoom: 2.7 },
  'Africa': { center: [17, 5], zoom: 2.4 },
  'Middle East': { center: [50, 30], zoom: 2.7 },
  'Asia': { center: [105, 25], zoom: 2.5 },
  'Oceania': { center: [147, -25], zoom: 2.5 },
  'North America': { center: [-85, 25], zoom: 3 },
  'South America': { center: [-60, -18], zoom: 2.4 },
  'Antarctica': { center: [70, -80], zoom: 1.5 },
  'USA States': { center: [-97, 40], zoom: 3 },
  'China Provinces': { center: [105, 37], zoom: 3 },
  'Japan Prefectures': { center: [138.7, 37.6], zoom: 4 },
  'Japan Old Provinces': { center: [138.7, 37.6], zoom: 4 },
};

// 判定用リスト（ISO 3166-1 alpha-2）
export const countryRegions = {
  Europe: [
    'AL','AD','AM','AT','AZ',
    'BY','BE','BA','BG',
    'HR','CY','CZ',
    'DK',
    'EE',
    'FI','FR',
    'GE','DE','GR',
    'HU',
    'IS','IE','IT',
    'XK',
    'LV','LI','LT','LU',
    'MT','MD','MC','ME',
    'NL','MK','NO',
    'PL','PT',
    'RS','RO','RU',
    'SM','SK','SI','ES','SE','CH',
    'UA','GB',
    'VA'
  ],
  Africa: [
    'DZ','AO',
    'BJ','BW','BF','BI',
    'CV','CM','CF','TD','KM',
    'CD','DJ',
    'EG','GQ','ER','SZ','ET',
    'GA','GM','GH','GN','GW',
    'CI',
    'KE',
    'LS','LR','LY',
    'MG','MW','ML','MR','MU','MA','MZ',
    'NA','NE','NG',
    'CG','RW',
    'ST','SN','SC','SL','SO','ZA','SS','SD',
    'TG','TN',
    'UG','TZ',
    'EH',
    'ZM','ZW'
  ],
  'Middle East': [
    'AF',
    'BH',
    'IR','IQ','IL',
    'JO',
    'KW',
    'LB',
    'OM',
    'PS',
    'QA',
    'SA','SY',
    'TR',
    'AE',
    'YE'
  ],
  Asia: [
    'BD','BT','BN',
    'KH','CN',
    'TL',
    'HK',
    'IN','ID',
    'JP',
    'KZ','KG',
    'LA',
    'MO','MY','MV','MN','MM',
    'NP','KP',
    'PK','PH',
    'SG','KR','LK',
    'TW','TJ','TH','TM',
    'UZ',
    'VN'
  ],
  Oceania: [
    'AU',
    'CK',
    'FM','FJ',
    'KI',
    'MH',
    'NR','NC','NZ','NU',
    'PW','PG',
    'WS','SB',
    'TO','TV',
    'VU'
  ],
  'North America': [
    'AG',
    'BB','BZ','BM',
    'CA','CR','CU',
    'DM','DO',
    'SV',
    'GD','GL','GT',
    'HT','HN',
    'JM',
    'MX',
    'NI',
    'PA','PR',
    'KN','LC','VC',
    'BS','TT',
    'US'
  ],
  'South America': [
    'AR',
    'BO','BR',
    'CL','CO',
    'EC',
    'GY',
    'PY','PE',
    'SR',
    'UY',
    'VE'
  ]
};

countryRegions['Antarctica'] = [];
countryRegions['USA States'] = [];
countryRegions['China Provinces'] = [];
countryRegions['Japan Prefectures'] = [];
countryRegions['Japan Old Provinces'] = [];
