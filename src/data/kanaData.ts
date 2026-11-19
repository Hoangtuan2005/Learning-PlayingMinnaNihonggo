export interface KanaChar {
  id: string;
  romaji: string;
  hiragana: string;
  katakana: string;
  group: 'seion' | 'dakuon' | 'yoon';
  rowName: string;
  note?: string;
}

// 1. ÂM CƠ BẢN (SEION - 46 KÝ TỰ)
export const KANA_SEION_ROWS: { rowName: string; items: (KanaChar | null)[] }[] = [
  {
    rowName: "Hàng A (あ/ア)",
    items: [
      { id: "k_a", romaji: "a", hiragana: "あ", katakana: "ア", group: "seion", rowName: "Hàng A" },
      { id: "k_i", romaji: "i", hiragana: "い", katakana: "イ", group: "seion", rowName: "Hàng A" },
      { id: "k_u", romaji: "u", hiragana: "う", katakana: "ウ", group: "seion", rowName: "Hàng A" },
      { id: "k_e", romaji: "e", hiragana: "え", katakana: "エ", group: "seion", rowName: "Hàng A" },
      { id: "k_o", romaji: "o", hiragana: "お", katakana: "オ", group: "seion", rowName: "Hàng A" },
    ]
  },
  {
    rowName: "Hàng Ka (か/カ)",
    items: [
      { id: "k_ka", romaji: "ka", hiragana: "か", katakana: "カ", group: "seion", rowName: "Hàng Ka" },
      { id: "k_ki", romaji: "ki", hiragana: "き", katakana: "キ", group: "seion", rowName: "Hàng Ka" },
      { id: "k_ku", romaji: "ku", hiragana: "く", katakana: "ク", group: "seion", rowName: "Hàng Ka" },
      { id: "k_ke", romaji: "ke", hiragana: "け", katakana: "ケ", group: "seion", rowName: "Hàng Ka" },
      { id: "k_ko", romaji: "ko", hiragana: "こ", katakana: "コ", group: "seion", rowName: "Hàng Ka" },
    ]
  },
  {
    rowName: "Hàng Sa (さ/サ)",
    items: [
      { id: "k_sa", romaji: "sa", hiragana: "さ", katakana: "サ", group: "seion", rowName: "Hàng Sa" },
      { id: "k_shi", romaji: "shi", hiragana: "し", katakana: "シ", group: "seion", rowName: "Hàng Sa", note: "Phát âm [shi]" },
      { id: "k_su", romaji: "su", hiragana: "す", katakana: "ス", group: "seion", rowName: "Hàng Sa" },
      { id: "k_se", romaji: "se", hiragana: "せ", katakana: "セ", group: "seion", rowName: "Hàng Sa" },
      { id: "k_so", romaji: "so", hiragana: "そ", katakana: "ソ", group: "seion", rowName: "Hàng Sa" },
    ]
  },
  {
    rowName: "Hàng Ta (た/タ)",
    items: [
      { id: "k_ta", romaji: "ta", hiragana: "た", katakana: "タ", group: "seion", rowName: "Hàng Ta" },
      { id: "k_chi", romaji: "chi", hiragana: "ち", katakana: "チ", group: "seion", rowName: "Hàng Ta", note: "Phát âm [chi]" },
      { id: "k_tsu", romaji: "tsu", hiragana: "つ", katakana: "ツ", group: "seion", rowName: "Hàng Ta", note: "Phát âm [tsu]" },
      { id: "k_te", romaji: "te", hiragana: "て", katakana: "テ", group: "seion", rowName: "Hàng Ta" },
      { id: "k_to", romaji: "to", hiragana: "と", katakana: "ト", group: "seion", rowName: "Hàng Ta" },
    ]
  },
  {
    rowName: "Hàng Na (な/ナ)",
    items: [
      { id: "k_na", romaji: "na", hiragana: "な", katakana: "ナ", group: "seion", rowName: "Hàng Na" },
      { id: "k_ni", romaji: "ni", hiragana: "に", katakana: "ニ", group: "seion", rowName: "Hàng Na" },
      { id: "k_nu", romaji: "nu", hiragana: "ぬ", katakana: "ヌ", group: "seion", rowName: "Hàng Na" },
      { id: "k_ne", romaji: "ne", hiragana: "ね", katakana: "ネ", group: "seion", rowName: "Hàng Na" },
      { id: "k_no", romaji: "no", hiragana: "の", katakana: "ノ", group: "seion", rowName: "Hàng Na" },
    ]
  },
  {
    rowName: "Hàng Ha (は/ハ)",
    items: [
      { id: "k_ha", romaji: "ha", hiragana: "は", katakana: "ハ", group: "seion", rowName: "Hàng Ha" },
      { id: "k_hi", romaji: "hi", hiragana: "ひ", katakana: "ヒ", group: "seion", rowName: "Hàng Ha" },
      { id: "k_fu", romaji: "fu", hiragana: "ふ", katakana: "フ", group: "seion", rowName: "Hàng Ha", note: "Phát âm [fu/hu]" },
      { id: "k_he", romaji: "he", hiragana: "へ", katakana: "ヘ", group: "seion", rowName: "Hàng Ha" },
      { id: "k_ho", romaji: "ho", hiragana: "ほ", katakana: "ホ", group: "seion", rowName: "Hàng Ha" },
    ]
  },
  {
    rowName: "Hàng Ma (ま/マ)",
    items: [
      { id: "k_ma", romaji: "ma", hiragana: "ま", katakana: "マ", group: "seion", rowName: "Hàng Ma" },
      { id: "k_mi", romaji: "mi", hiragana: "み", katakana: "ミ", group: "seion", rowName: "Hàng Ma" },
      { id: "k_mu", romaji: "mu", hiragana: "む", katakana: "ム", group: "seion", rowName: "Hàng Ma" },
      { id: "k_me", romaji: "me", hiragana: "め", katakana: "メ", group: "seion", rowName: "Hàng Ma" },
      { id: "k_mo", romaji: "mo", hiragana: "も", katakana: "モ", group: "seion", rowName: "Hàng Ma" },
    ]
  },
  {
    rowName: "Hàng Ya (や/ヤ)",
    items: [
      { id: "k_ya", romaji: "ya", hiragana: "や", katakana: "ヤ", group: "seion", rowName: "Hàng Ya" },
      null,
      { id: "k_yu", romaji: "yu", hiragana: "ゆ", katakana: "ユ", group: "seion", rowName: "Hàng Ya" },
      null,
      { id: "k_yo", romaji: "yo", hiragana: "よ", katakana: "ヨ", group: "seion", rowName: "Hàng Ya" },
    ]
  },
  {
    rowName: "Hàng Ra (ら/ラ)",
    items: [
      { id: "k_ra", romaji: "ra", hiragana: "ら", katakana: "ラ", group: "seion", rowName: "Hàng Ra" },
      { id: "k_ri", romaji: "ri", hiragana: "り", katakana: "リ", group: "seion", rowName: "Hàng Ra" },
      { id: "k_ru", romaji: "ru", hiragana: "る", katakana: "ル", group: "seion", rowName: "Hàng Ra" },
      { id: "k_re", romaji: "re", hiragana: "れ", katakana: "レ", group: "seion", rowName: "Hàng Ra" },
      { id: "k_ro", romaji: "ro", hiragana: "ろ", katakana: "ロ", group: "seion", rowName: "Hàng Ra" },
    ]
  },
  {
    rowName: "Hàng Wa / N (わ/ワ)",
    items: [
      { id: "k_wa", romaji: "wa", hiragana: "わ", katakana: "ワ", group: "seion", rowName: "Hàng Wa" },
      null,
      null,
      null,
      { id: "k_wo", romaji: "wo (o)", hiragana: "を", katakana: "ヲ", group: "seion", rowName: "Hàng Wa", note: "Trợ từ phát âm [o]" },
    ]
  },
  {
    rowName: "Âm mũi N (ん/ン)",
    items: [
      { id: "k_n", romaji: "n", hiragana: "ん", katakana: "ン", group: "seion", rowName: "Âm mũi N", note: "Phát âm [n/m/ng]" },
      null,
      null,
      null,
      null
    ]
  }
];

// 2. ÂM ĐỤC & BÁN ĐỤC (DAKUON & HANDAKUON - 25 KÝ TỰ)
export const KANA_DAKUON_ROWS: { rowName: string; items: (KanaChar | null)[] }[] = [
  {
    rowName: "Hàng Ga (が/ガ)",
    items: [
      { id: "k_ga", romaji: "ga", hiragana: "が", katakana: "ガ", group: "dakuon", rowName: "Hàng Ga" },
      { id: "k_gi", romaji: "gi", hiragana: "ぎ", katakana: "ギ", group: "dakuon", rowName: "Hàng Ga" },
      { id: "k_gu", romaji: "gu", hiragana: "ぐ", katakana: "グ", group: "dakuon", rowName: "Hàng Ga" },
      { id: "k_ge", romaji: "ge", hiragana: "げ", katakana: "ゲ", group: "dakuon", rowName: "Hàng Ga" },
      { id: "k_go", romaji: "go", hiragana: "ご", katakana: "ゴ", group: "dakuon", rowName: "Hàng Ga" },
    ]
  },
  {
    rowName: "Hàng Za (ざ/ザ)",
    items: [
      { id: "k_za", romaji: "za", hiragana: "ざ", katakana: "ザ", group: "dakuon", rowName: "Hàng Za" },
      { id: "k_ji", romaji: "ji", hiragana: "じ", katakana: "ジ", group: "dakuon", rowName: "Hàng Za", note: "Phát âm [ji]" },
      { id: "k_zu", romaji: "zu", hiragana: "ず", katakana: "ズ", group: "dakuon", rowName: "Hàng Za" },
      { id: "k_ze", romaji: "ze", hiragana: "ぜ", katakana: "ゼ", group: "dakuon", rowName: "Hàng Za" },
      { id: "k_zo", romaji: "zo", hiragana: "ぞ", katakana: "ゾ", group: "dakuon", rowName: "Hàng Za" },
    ]
  },
  {
    rowName: "Hàng Da (だ/ダ)",
    items: [
      { id: "k_da", romaji: "da", hiragana: "だ", katakana: "ダ", group: "dakuon", rowName: "Hàng Da" },
      { id: "k_d_ji", romaji: "ji (dji)", hiragana: "ぢ", katakana: "ヂ", group: "dakuon", rowName: "Hàng Da" },
      { id: "k_d_zu", romaji: "zu (dzu)", hiragana: "づ", katakana: "ヅ", group: "dakuon", rowName: "Hàng Da" },
      { id: "k_de", romaji: "de", hiragana: "で", katakana: "デ", group: "dakuon", rowName: "Hàng Da" },
      { id: "k_do", romaji: "do", hiragana: "ど", katakana: "ド", group: "dakuon", rowName: "Hàng Da" },
    ]
  },
  {
    rowName: "Hàng Ba (ば/バ)",
    items: [
      { id: "k_ba", romaji: "ba", hiragana: "ば", katakana: "バ", group: "dakuon", rowName: "Hàng Ba" },
      { id: "k_bi", romaji: "bi", hiragana: "び", katakana: "ビ", group: "dakuon", rowName: "Hàng Ba" },
      { id: "k_bu", romaji: "bu", hiragana: "ぶ", katakana: "ブ", group: "dakuon", rowName: "Hàng Ba" },
      { id: "k_be", romaji: "be", hiragana: "べ", katakana: "ベ", group: "dakuon", rowName: "Hàng Ba" },
      { id: "k_bo", romaji: "bo", hiragana: "ぼ", katakana: "ボ", group: "dakuon", rowName: "Hàng Ba" },
    ]
  },
  {
    rowName: "Hàng Pa (ぱ/パ - Bán đục)",
    items: [
      { id: "k_pa", romaji: "pa", hiragana: "ぱ", katakana: "パ", group: "dakuon", rowName: "Hàng Pa" },
      { id: "k_pi", romaji: "pi", hiragana: "ぴ", katakana: "ピ", group: "dakuon", rowName: "Hàng Pa" },
      { id: "k_pu", romaji: "pu", hiragana: "ぷ", katakana: "プ", group: "dakuon", rowName: "Hàng Pa" },
      { id: "k_pe", romaji: "pe", hiragana: "ぺ", katakana: "ペ", group: "dakuon", rowName: "Hàng Pa" },
      { id: "k_po", romaji: "po", hiragana: "ぽ", katakana: "ポ", group: "dakuon", rowName: "Hàng Pa" },
    ]
  }
];

// 3. ÂM GHÉP (YOON - 33 KÝ TỰ)
export const KANA_YOON_ROWS: { rowName: string; items: (KanaChar | null)[] }[] = [
  {
    rowName: "Âm ghép Kya / Sha / Cha",
    items: [
      { id: "y_kya", romaji: "kya", hiragana: "きゃ", katakana: "キャ", group: "yoon", rowName: "Kya" },
      { id: "y_kyu", romaji: "kyu", hiragana: "きゅ", katakana: "キュ", group: "yoon", rowName: "Kyu" },
      { id: "y_kyo", romaji: "kyo", hiragana: "きょ", katakana: "キョ", group: "yoon", rowName: "Kyo" },
      { id: "y_sha", romaji: "sha", hiragana: "しゃ", katakana: "シャ", group: "yoon", rowName: "Sha" },
      { id: "y_shu", romaji: "shu", hiragana: "しゅ", katakana: "シュ", group: "yoon", rowName: "Shu" },
      { id: "y_sho", romaji: "sho", hiragana: "しょ", katakana: "ショ", group: "yoon", rowName: "Sho" },
      { id: "y_cha", romaji: "cha", hiragana: "ちゃ", katakana: "チャ", group: "yoon", rowName: "Cha" },
      { id: "y_chu", romaji: "chu", hiragana: "ちゅ", katakana: "チュ", group: "yoon", rowName: "Chu" },
      { id: "y_cho", romaji: "cho", hiragana: "ちょ", katakana: "チョ", group: "yoon", rowName: "Cho" },
    ]
  },
  {
    rowName: "Âm ghép Nya / Hya / Mya / Rya",
    items: [
      { id: "y_nya", romaji: "nya", hiragana: "にゃ", katakana: "ニャ", group: "yoon", rowName: "Nya" },
      { id: "y_nyu", romaji: "nyu", hiragana: "にゅ", katakana: "ニュ", group: "yoon", rowName: "Nyu" },
      { id: "y_nyo", romaji: "nyo", hiragana: "にょ", katakana: "ニョ", group: "yoon", rowName: "Nyo" },
      { id: "y_hya", romaji: "hya", hiragana: "ひゃ", katakana: "ヒャ", group: "yoon", rowName: "Hya" },
      { id: "y_hyu", romaji: "hyu", hiragana: "ひゅ", katakana: "ヒュ", group: "yoon", rowName: "Hyu" },
      { id: "y_hyo", romaji: "hyo", hiragana: "ひょ", katakana: "ヒョ", group: "yoon", rowName: "Hyo" },
      { id: "y_mya", romaji: "mya", hiragana: "みゃ", katakana: "ミャ", group: "yoon", rowName: "Mya" },
      { id: "y_myu", romaji: "myu", hiragana: "みゅ", katakana: "ミュ", group: "yoon", rowName: "Myu" },
      { id: "y_myo", romaji: "myo", hiragana: "みょ", katakana: "ミョ", group: "yoon", rowName: "Myo" },
      { id: "y_rya", romaji: "rya", hiragana: "りゃ", katakana: "リャ", group: "yoon", rowName: "Rya" },
      { id: "y_ryu", romaji: "ryu", hiragana: "りゅ", katakana: "リュ", group: "yoon", rowName: "Ryu" },
      { id: "y_ryo", romaji: "ryo", hiragana: "りょ", katakana: "リョ", group: "yoon", rowName: "Ryo" },
    ]
  },
  {
    rowName: "Âm ghép đục Gya / Ja / Bya / Pya",
    items: [
      { id: "y_gya", romaji: "gya", hiragana: "ぎゃ", katakana: "ギャ", group: "yoon", rowName: "Gya" },
      { id: "y_gyu", romaji: "gyu", hiragana: "ぎゅ", katakana: "ギュ", group: "yoon", rowName: "Gyu" },
      { id: "y_gyo", romaji: "gyo", hiragana: "ぎょ", katakana: "ギョ", group: "yoon", rowName: "Gyo" },
      { id: "y_ja", romaji: "ja", hiragana: "じゃ", katakana: "ジャ", group: "yoon", rowName: "Ja" },
      { id: "y_ju", romaji: "ju", hiragana: "じゅ", katakana: "ジュ", group: "yoon", rowName: "Ju" },
      { id: "y_jo", romaji: "jo", hiragana: "じょ", katakana: "ジョ", group: "yoon", rowName: "Jo" },
      { id: "y_bya", romaji: "bya", hiragana: "びゃ", katakana: "ビャ", group: "yoon", rowName: "Bya" },
      { id: "y_byu", romaji: "byu", hiragana: "びゅ", katakana: "ビュ", group: "yoon", rowName: "Byu" },
      { id: "y_byo", romaji: "byo", hiragana: "びょ", katakana: "ビョ", group: "yoon", rowName: "Byo" },
      { id: "y_pya", romaji: "pya", hiragana: "ぴゃ", katakana: "ピャ", group: "yoon", rowName: "Pya" },
      { id: "y_pyu", romaji: "pyu", hiragana: "ぴゅ", katakana: "ピュ", group: "yoon", rowName: "Pyu" },
      { id: "y_pyo", romaji: "pyo", hiragana: "ぴょ", katakana: "ピョ", group: "yoon", rowName: "Pyo" },
    ]
  }
];
