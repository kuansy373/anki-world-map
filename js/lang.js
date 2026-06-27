let currentLang = 'en';

export function setLang(lang) {
  currentLang = lang;
}

export function getMessage(key) {
  return messages[key][currentLang];
}

export function getDisplayName(names) {
  if (typeof names === 'object' && names !== null) {
    return names[currentLang] ?? names.en ?? Object.values(names)[0] ?? '';
  }
  return currentLang === 'ja' ? (translations[names] || names) : names;
}

export function getRegionDisplayName(region) {
  if (currentLang === 'ja') return regionNameJa[region] || region;
  return region;
}

export function updateButtonTexts(lang) {
  document.querySelectorAll('[data-en][data-ja]').forEach(el => {
    const text = lang === 'ja' ? el.dataset.ja : el.dataset.en;
    if (el.tagName === 'INPUT') el.placeholder = text;
    else el.textContent = text;
  });
}

// ==================

const messages = {
  noViewSettings: { en: 'has no view settings', ja: 'のビュー設定がありません' },
};

const regionNameJa = {
  'Europe': 'ヨーロッパ',
  'Africa': 'アフリカ',
  'Middle East': '中東',
  'Asia': 'アジア',
  'Oceania': 'オセアニア',
  'North America': '北アメリカ',
  'South America': '南アメリカ',
  'Antarctica': '南極大陸',
  'Default': '未定義',
  'USA States': 'アメリカ(州)',
  'China Provinces': '中国(省)',
  'Japan Prefectures': '日本(都道府県)',
  'Japan Old Provinces': '日本(令制国)',
  'Commands': 'コマンド',
};

const translations = {
  "README": "わたしを読んで",
  "Lat: ": "緯度: ",
  "Lng: ": "経度: ",
};
