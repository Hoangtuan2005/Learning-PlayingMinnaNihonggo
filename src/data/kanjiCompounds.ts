// Danh sách Từ ghép Kanji (Jukugo) tổng hợp từ Bài 1 đến Bài 15
// Chuẩn hóa theo tài liệu Hán tự Look & Learn / Minna no Nihongo

export interface KanjiCompound {
  id: string;
  lesson: number;
  word: string;
  reading: string;
  hanViet: string;
  meaning: string;
  rootKanji: string[];
}

export const KANJI_COMPOUNDS: KanjiCompound[] = [
  {
    "id": "kc_01_001",
    "lesson": 1,
    "word": "一つ",
    "reading": "ひとつ",
    "hanViet": "NHẤT",
    "meaning": "1 cái (Vật trung/đồ vật chung)",
    "rootKanji": [
      "一"
    ]
  },
  {
    "id": "kc_01_002",
    "lesson": 1,
    "word": "一枚",
    "reading": "いちまい",
    "hanViet": "NHẤT MAI",
    "meaning": "1 tờ, 1 tấm (vật mỏng phẳng)",
    "rootKanji": [
      "一",
      "枚"
    ]
  },
  {
    "id": "kc_01_003",
    "lesson": 1,
    "word": "一月",
    "reading": "いちがつ",
    "hanViet": "NHẤT NGUYỆT",
    "meaning": "Tháng 1",
    "rootKanji": [
      "一",
      "月"
    ]
  },
  {
    "id": "kc_01_004",
    "lesson": 1,
    "word": "一日",
    "reading": "いちにち",
    "hanViet": "NHẤT NHẬT",
    "meaning": "1 ngày (khoảng thời gian)",
    "rootKanji": [
      "一",
      "日"
    ]
  },
  {
    "id": "kc_01_005",
    "lesson": 1,
    "word": "一本",
    "reading": "いっぽん",
    "hanViet": "NHẤT BỔN",
    "meaning": "1 cây, 1 chai, 1 que (vật dài)",
    "rootKanji": [
      "一",
      "本"
    ]
  },
  {
    "id": "kc_01_006",
    "lesson": 1,
    "word": "一万円札",
    "reading": "いちまんえんさつ",
    "hanViet": "NHẤT VẠN VIÊN TRÁT",
    "meaning": "Tờ tiền 1 vạn yên",
    "rootKanji": [
      "一",
      "万",
      "円",
      "札"
    ]
  },
  {
    "id": "kc_01_007",
    "lesson": 1,
    "word": "二つ",
    "reading": "ふたつ",
    "hanViet": "NHỊ",
    "meaning": "2 cái (vật trung)",
    "rootKanji": [
      "二"
    ]
  },
  {
    "id": "kc_01_008",
    "lesson": 1,
    "word": "二台",
    "reading": "にだい",
    "hanViet": "NHỊ ĐÀI",
    "meaning": "2 cái, 2 chiếc (máy móc, xe cộ)",
    "rootKanji": [
      "二",
      "台"
    ]
  },
  {
    "id": "kc_01_009",
    "lesson": 1,
    "word": "三つ",
    "reading": "みっつ",
    "hanViet": "TAM",
    "meaning": "3 cái (vật trung)",
    "rootKanji": [
      "三"
    ]
  },
  {
    "id": "kc_01_010",
    "lesson": 1,
    "word": "三枚",
    "reading": "さんまい",
    "hanViet": "TAM MAI",
    "meaning": "3 tờ, 3 tấm",
    "rootKanji": [
      "三",
      "枚"
    ]
  },
  {
    "id": "kc_01_011",
    "lesson": 1,
    "word": "四つ",
    "reading": "よっつ",
    "hanViet": "TỨ",
    "meaning": "4 cái (vật trung)",
    "rootKanji": [
      "四"
    ]
  },
  {
    "id": "kc_01_012",
    "lesson": 1,
    "word": "四時間",
    "reading": "よじかん",
    "hanViet": "TỨ THỜI GIAN",
    "meaning": "4 tiếng đồng hồ",
    "rootKanji": [
      "四",
      "時",
      "間"
    ]
  },
  {
    "id": "kc_01_013",
    "lesson": 1,
    "word": "四本",
    "reading": "よんほん",
    "hanViet": "TỨ BỔN",
    "meaning": "4 cây, 4 chai (vật dài)",
    "rootKanji": [
      "四",
      "本"
    ]
  },
  {
    "id": "kc_01_014",
    "lesson": 1,
    "word": "四月",
    "reading": "しがつ",
    "hanViet": "TỨ NGUYỆT",
    "meaning": "Tháng 4",
    "rootKanji": [
      "四",
      "月"
    ]
  },
  {
    "id": "kc_01_015",
    "lesson": 1,
    "word": "五つ",
    "reading": "いつつ",
    "hanViet": "NGŨ",
    "meaning": "5 cái (vật trung)",
    "rootKanji": [
      "五"
    ]
  },
  {
    "id": "kc_01_016",
    "lesson": 1,
    "word": "五人",
    "reading": "ごにん",
    "hanViet": "NGŨ NHÂN",
    "meaning": "5 người",
    "rootKanji": [
      "五",
      "人"
    ]
  },
  {
    "id": "kc_01_017",
    "lesson": 1,
    "word": "五月",
    "reading": "ごがつ",
    "hanViet": "NGŨ NGUYỆT",
    "meaning": "Tháng 5",
    "rootKanji": [
      "五",
      "月"
    ]
  },
  {
    "id": "kc_01_018",
    "lesson": 1,
    "word": "六つ",
    "reading": "むっつ",
    "hanViet": "LỤC",
    "meaning": "6 cái (vật trung)",
    "rootKanji": [
      "六"
    ]
  },
  {
    "id": "kc_01_019",
    "lesson": 1,
    "word": "六月",
    "reading": "ろくがつ",
    "hanViet": "LỤC NGUYỆT",
    "meaning": "Tháng 6",
    "rootKanji": [
      "六",
      "月"
    ]
  },
  {
    "id": "kc_01_020",
    "lesson": 1,
    "word": "六本",
    "reading": "ろっぽん",
    "hanViet": "LỤC BỔN",
    "meaning": "6 cây, 6 chai (vật dài)",
    "rootKanji": [
      "六",
      "本"
    ]
  },
  {
    "id": "kc_01_021",
    "lesson": 1,
    "word": "七つ",
    "reading": "ななつ",
    "hanViet": "THẤT",
    "meaning": "7 cái (vật trung)",
    "rootKanji": [
      "七"
    ]
  },
  {
    "id": "kc_01_022",
    "lesson": 1,
    "word": "七月",
    "reading": "しちがつ",
    "hanViet": "THẤT NGUYỆT",
    "meaning": "Tháng 7",
    "rootKanji": [
      "七",
      "月"
    ]
  },
  {
    "id": "kc_01_023",
    "lesson": 1,
    "word": "七五三",
    "reading": "しちごさん",
    "hanViet": "THẤT NGŨ TAM",
    "meaning": "Lễ hội trẻ em 7-5-3 tuổi",
    "rootKanji": [
      "七",
      "五",
      "三"
    ]
  },
  {
    "id": "kc_01_024",
    "lesson": 1,
    "word": "八つ",
    "reading": "やっつ",
    "hanViet": "BÁT",
    "meaning": "8 cái (vật trung)",
    "rootKanji": [
      "八"
    ]
  },
  {
    "id": "kc_01_025",
    "lesson": 1,
    "word": "八月",
    "reading": "はちがつ",
    "hanViet": "BÁT NGUYỆT",
    "meaning": "Tháng 8",
    "rootKanji": [
      "八",
      "月"
    ]
  },
  {
    "id": "kc_01_026",
    "lesson": 1,
    "word": "八本",
    "reading": "はっぽん",
    "hanViet": "BÁT BỔN",
    "meaning": "8 cây, 8 chai (vật dài)",
    "rootKanji": [
      "八",
      "本"
    ]
  },
  {
    "id": "kc_01_027",
    "lesson": 1,
    "word": "九つ",
    "reading": "ここのつ",
    "hanViet": "CỬU",
    "meaning": "9 cái (vật trung)",
    "rootKanji": [
      "九"
    ]
  },
  {
    "id": "kc_01_028",
    "lesson": 1,
    "word": "九時",
    "reading": "くじ",
    "hanViet": "CỬU THỜI",
    "meaning": "9 giờ",
    "rootKanji": [
      "九",
      "時"
    ]
  },
  {
    "id": "kc_01_029",
    "lesson": 1,
    "word": "九人",
    "reading": "きゅうにん",
    "hanViet": "CỬU NHÂN",
    "meaning": "9 người",
    "rootKanji": [
      "九",
      "人"
    ]
  },
  {
    "id": "kc_01_030",
    "lesson": 1,
    "word": "九月",
    "reading": "くがつ",
    "hanViet": "CỬU NGUYỆT",
    "meaning": "Tháng 9",
    "rootKanji": [
      "九",
      "月"
    ]
  },
  {
    "id": "kc_01_031",
    "lesson": 1,
    "word": "十時",
    "reading": "じゅうじ",
    "hanViet": "THẬP THỜI",
    "meaning": "10 giờ",
    "rootKanji": [
      "十",
      "時"
    ]
  },
  {
    "id": "kc_01_032",
    "lesson": 1,
    "word": "十日",
    "reading": "とおか",
    "hanViet": "THẬP NHẬT",
    "meaning": "Ngày 10, 10 ngày",
    "rootKanji": [
      "十",
      "日"
    ]
  },
  {
    "id": "kc_01_033",
    "lesson": 1,
    "word": "二十分",
    "reading": "にじゅっぷん",
    "hanViet": "NHỊ THẬP PHÂN",
    "meaning": "20 phút",
    "rootKanji": [
      "二",
      "十",
      "分"
    ]
  },
  {
    "id": "kc_01_034",
    "lesson": 1,
    "word": "百人",
    "reading": "ひゃくにん",
    "hanViet": "BÁCH NHÂN",
    "meaning": "100 người",
    "rootKanji": [
      "百",
      "人"
    ]
  },
  {
    "id": "kc_01_035",
    "lesson": 1,
    "word": "三百六十五",
    "reading": "さんびゃくろくじゅうご",
    "hanViet": "TAM BÁCH LỤC THẬP NGŨ",
    "meaning": "365 (số ngày trong năm)",
    "rootKanji": [
      "三",
      "百",
      "六",
      "十",
      "五"
    ]
  },
  {
    "id": "kc_01_036",
    "lesson": 1,
    "word": "五百",
    "reading": "ごひゃく",
    "hanViet": "NGŨ BÁCH",
    "meaning": "500",
    "rootKanji": [
      "五",
      "百"
    ]
  },
  {
    "id": "kc_01_037",
    "lesson": 1,
    "word": "千円札",
    "reading": "せんえんさつ",
    "hanViet": "THIÊN VIÊN TRÁT",
    "meaning": "Tờ tiền 1 ngàn yên",
    "rootKanji": [
      "千",
      "円",
      "札"
    ]
  },
  {
    "id": "kc_01_038",
    "lesson": 1,
    "word": "九千八百円",
    "reading": "きゅうせんはっぴゃくえん",
    "hanViet": "CỬU THIÊN BÁT BÁCH VIÊN",
    "meaning": "9,800 yên",
    "rootKanji": [
      "九",
      "千",
      "八",
      "百",
      "円"
    ]
  },
  {
    "id": "kc_01_039",
    "lesson": 1,
    "word": "三千円",
    "reading": "さんぜんえん",
    "hanViet": "TAM THIÊN VIÊN",
    "meaning": "3,000 yên",
    "rootKanji": [
      "三",
      "千",
      "円"
    ]
  },
  {
    "id": "kc_01_040",
    "lesson": 1,
    "word": "一万九千",
    "reading": "いちまんきゅうせん",
    "hanViet": "NHẤT VẠN CỬU THIÊN",
    "meaning": "19,000",
    "rootKanji": [
      "一",
      "万",
      "九",
      "千"
    ]
  },
  {
    "id": "kc_01_041",
    "lesson": 1,
    "word": "七百万人",
    "reading": "ななひゃくまんにん",
    "hanViet": "THẤT BÁCH VẠN NHÂN",
    "meaning": "7 triệu người (700 vạn người)",
    "rootKanji": [
      "七",
      "百",
      "万",
      "人"
    ]
  },
  {
    "id": "kc_01_042",
    "lesson": 1,
    "word": "三百万円",
    "reading": "さんびゃくまんえん",
    "hanViet": "TAM BÁCH VẠN VIÊN",
    "meaning": "3,000,000 yên",
    "rootKanji": [
      "三",
      "百",
      "万",
      "円"
    ]
  },
  {
    "id": "kc_01_043",
    "lesson": 1,
    "word": "円",
    "reading": "えん",
    "hanViet": "VIÊN",
    "meaning": "Đồng Yên Nhật",
    "rootKanji": [
      "円"
    ]
  },
  {
    "id": "kc_02_044",
    "lesson": 2,
    "word": "月",
    "reading": "つき",
    "hanViet": "NGUYỆT",
    "meaning": "Mặt trăng",
    "rootKanji": [
      "月"
    ]
  },
  {
    "id": "kc_02_045",
    "lesson": 2,
    "word": "月曜日",
    "reading": "げつようび",
    "hanViet": "NGUYỆT DIỆU NHẬT",
    "meaning": "Thứ 2",
    "rootKanji": [
      "月",
      "曜",
      "日"
    ]
  },
  {
    "id": "kc_02_046",
    "lesson": 2,
    "word": "今月",
    "reading": "こんげつ",
    "hanViet": "KIM NGUYỆT",
    "meaning": "Tháng này",
    "rootKanji": [
      "今",
      "月"
    ]
  },
  {
    "id": "kc_02_047",
    "lesson": 2,
    "word": "火",
    "reading": "ひ",
    "hanViet": "HỎA",
    "meaning": "Lửa, ngọn lửa",
    "rootKanji": [
      "火"
    ]
  },
  {
    "id": "kc_02_048",
    "lesson": 2,
    "word": "水",
    "reading": "みず",
    "hanViet": "THỦY",
    "meaning": "Nước",
    "rootKanji": [
      "水"
    ]
  },
  {
    "id": "kc_02_049",
    "lesson": 2,
    "word": "水曜日",
    "reading": "すいようび",
    "hanViet": "THỦY DIỆU NHẬT",
    "meaning": "Thứ 4",
    "rootKanji": [
      "水",
      "曜",
      "日"
    ]
  },
  {
    "id": "kc_02_050",
    "lesson": 2,
    "word": "桜の木",
    "reading": "さくらのき",
    "hanViet": "ANH MỘC",
    "meaning": "Cây hoa anh đào",
    "rootKanji": [
      "桜",
      "木"
    ]
  },
  {
    "id": "kc_02_051",
    "lesson": 2,
    "word": "大木",
    "reading": "たいぼく",
    "hanViet": "ĐẠI MỘC",
    "meaning": "Cây cổ thụ, cây lớn",
    "rootKanji": [
      "大",
      "木"
    ]
  },
  {
    "id": "kc_02_052",
    "lesson": 2,
    "word": "木曜日",
    "reading": "もくようび",
    "hanViet": "MỘC DIỆU NHẬT",
    "meaning": "Thứ 5",
    "rootKanji": [
      "木",
      "曜",
      "日"
    ]
  },
  {
    "id": "kc_02_053",
    "lesson": 2,
    "word": "お金",
    "reading": "おかね",
    "hanViet": "KIM",
    "meaning": "Tiền, tiền bạc",
    "rootKanji": [
      "金"
    ]
  },
  {
    "id": "kc_02_054",
    "lesson": 2,
    "word": "金曜日",
    "reading": "きんようび",
    "hanViet": "KIM DIỆU NHẬT",
    "meaning": "Thứ 6",
    "rootKanji": [
      "金",
      "曜",
      "日"
    ]
  },
  {
    "id": "kc_02_055",
    "lesson": 2,
    "word": "土",
    "reading": "つち",
    "hanViet": "THỔ",
    "meaning": "Đất, chất đất",
    "rootKanji": [
      "土"
    ]
  },
  {
    "id": "kc_02_056",
    "lesson": 2,
    "word": "土曜日",
    "reading": "どようび",
    "hanViet": "THỔ DIỆU NHẬT",
    "meaning": "Thứ 7",
    "rootKanji": [
      "土",
      "曜",
      "日"
    ]
  },
  {
    "id": "kc_02_057",
    "lesson": 2,
    "word": "日曜日",
    "reading": "にちようび",
    "hanViet": "NHẬT DIỆU NHẬT",
    "meaning": "Chủ nhật",
    "rootKanji": [
      "日",
      "曜"
    ]
  },
  {
    "id": "kc_02_058",
    "lesson": 2,
    "word": "日",
    "reading": "ひ",
    "hanViet": "NHẬT",
    "meaning": "Ngày, mặt trời",
    "rootKanji": [
      "日"
    ]
  },
  {
    "id": "kc_02_059",
    "lesson": 2,
    "word": "生年月日",
    "reading": "せいねんがっぴ",
    "hanViet": "SINH NIÊN NGUYỆT NHẬT",
    "meaning": "Ngày tháng năm sinh",
    "rootKanji": [
      "生",
      "年",
      "月",
      "日"
    ]
  },
  {
    "id": "kc_02_060",
    "lesson": 2,
    "word": "七月七日",
    "reading": "しちがつなのか",
    "hanViet": "THẤT NGUYỆT THẤT NHẬT",
    "meaning": "Ngày 7 tháng 7",
    "rootKanji": [
      "七",
      "月",
      "日"
    ]
  },
  {
    "id": "kc_02_061",
    "lesson": 2,
    "word": "毎年",
    "reading": "まいとし",
    "hanViet": "MỖI NIÊN",
    "meaning": "Mỗi năm, hàng năm",
    "rootKanji": [
      "毎",
      "年"
    ]
  },
  {
    "id": "kc_02_062",
    "lesson": 2,
    "word": "2年前",
    "reading": "にねんまえ",
    "hanViet": "NHỊ NIÊN TIỀN",
    "meaning": "2 năm trước",
    "rootKanji": [
      "年",
      "前"
    ]
  },
  {
    "id": "kc_03_063",
    "lesson": 3,
    "word": "人",
    "reading": "ひと",
    "hanViet": "NHÂN",
    "meaning": "Người, con người",
    "rootKanji": [
      "人"
    ]
  },
  {
    "id": "kc_03_064",
    "lesson": 3,
    "word": "日本人",
    "reading": "にほんじん",
    "hanViet": "NHẬT BẢN NHÂN",
    "meaning": "Người Nhật Bản",
    "rootKanji": [
      "日",
      "本",
      "人"
    ]
  },
  {
    "id": "kc_03_065",
    "lesson": 3,
    "word": "何人",
    "reading": "なんにん",
    "hanViet": "HÀ NHÂN",
    "meaning": "Mấy người?",
    "rootKanji": [
      "何",
      "人"
    ]
  },
  {
    "id": "kc_03_066",
    "lesson": 3,
    "word": "口",
    "reading": "くち",
    "hanViet": "KHẨU",
    "meaning": "Miệng",
    "rootKanji": [
      "口"
    ]
  },
  {
    "id": "kc_03_067",
    "lesson": 3,
    "word": "人口",
    "reading": "じんこう",
    "hanViet": "KHẨU NHÂN",
    "meaning": "Dân số",
    "rootKanji": [
      "人",
      "口"
    ]
  },
  {
    "id": "kc_03_068",
    "lesson": 3,
    "word": "目",
    "reading": "め",
    "hanViet": "MỤC",
    "meaning": "Mắt",
    "rootKanji": [
      "目"
    ]
  },
  {
    "id": "kc_03_069",
    "lesson": 3,
    "word": "いくつ目",
    "reading": "いくつめ",
    "hanViet": "MỤC",
    "meaning": "Cái thứ mấy",
    "rootKanji": [
      "目"
    ]
  },
  {
    "id": "kc_03_070",
    "lesson": 3,
    "word": "目的",
    "reading": "もくてき",
    "hanViet": "MỤC ĐÍCH",
    "meaning": "Mục đích",
    "rootKanji": [
      "目",
      "的"
    ]
  },
  {
    "id": "kc_03_071",
    "lesson": 3,
    "word": "耳",
    "reading": "みみ",
    "hanViet": "NHĨ",
    "meaning": "Tai, lỗ tai",
    "rootKanji": [
      "耳"
    ]
  },
  {
    "id": "kc_03_072",
    "lesson": 3,
    "word": "耳鼻科",
    "reading": "じびか",
    "hanViet": "NHĨ TỊ KHOA",
    "meaning": "Khoa tai mũi họng",
    "rootKanji": [
      "耳",
      "鼻",
      "科"
    ]
  },
  {
    "id": "kc_03_073",
    "lesson": 3,
    "word": "手",
    "reading": "て",
    "hanViet": "THỦ",
    "meaning": "Bàn tay, tay",
    "rootKanji": [
      "手"
    ]
  },
  {
    "id": "kc_03_074",
    "lesson": 3,
    "word": "手紙",
    "reading": "てがみ",
    "hanViet": "THỦ CHỈ",
    "meaning": "Lá thư",
    "rootKanji": [
      "手",
      "紙"
    ]
  },
  {
    "id": "kc_03_075",
    "lesson": 3,
    "word": "切手",
    "reading": "きって",
    "hanViet": "THIẾT THỦ",
    "meaning": "Con tem",
    "rootKanji": [
      "切",
      "手"
    ]
  },
  {
    "id": "kc_03_076",
    "lesson": 3,
    "word": "足",
    "reading": "あし",
    "hanViet": "TÚC",
    "meaning": "Chân, bàn chân",
    "rootKanji": [
      "足"
    ]
  },
  {
    "id": "kc_03_077",
    "lesson": 3,
    "word": "三十足",
    "reading": "さんじゅっそく",
    "hanViet": "TAM THẬP TÚC",
    "meaning": "30 đôi (giày/tất)",
    "rootKanji": [
      "三",
      "十",
      "足"
    ]
  },
  {
    "id": "kc_03_078",
    "lesson": 3,
    "word": "足します",
    "reading": "たします",
    "hanViet": "TÚC",
    "meaning": "Thêm vào, cộng vào",
    "rootKanji": [
      "足"
    ]
  },
  {
    "id": "kc_03_079",
    "lesson": 3,
    "word": "力",
    "reading": "ちから",
    "hanViet": "LỰC",
    "meaning": "Sức lực, sức mạnh",
    "rootKanji": [
      "力"
    ]
  },
  {
    "id": "kc_03_080",
    "lesson": 3,
    "word": "火力",
    "reading": "かりょく",
    "hanViet": "HỎA LỰC",
    "meaning": "Sức lửa, nhiệt năng",
    "rootKanji": [
      "火",
      "力"
    ]
  },
  {
    "id": "kc_03_081",
    "lesson": 3,
    "word": "協力",
    "reading": "きょうりょく",
    "hanViet": "HIỆP LỰC",
    "meaning": "Hiệp lực, hợp tác",
    "rootKanji": [
      "協",
      "力"
    ]
  },
  {
    "id": "kc_03_082",
    "lesson": 3,
    "word": "視力",
    "reading": "しりょく",
    "hanViet": "THỊ LỰC",
    "meaning": "Thị lực",
    "rootKanji": [
      "視",
      "力"
    ]
  },
  {
    "id": "kc_04_083",
    "lesson": 4,
    "word": "山",
    "reading": "やま",
    "hanViet": "SƠN",
    "meaning": "Núi, ngọn núi",
    "rootKanji": [
      "山"
    ]
  },
  {
    "id": "kc_04_084",
    "lesson": 4,
    "word": "富士山",
    "reading": "ふじさん",
    "hanViet": "PHÚ SĨ SƠN",
    "meaning": "Núi Phú Sĩ",
    "rootKanji": [
      "富",
      "士",
      "山"
    ]
  },
  {
    "id": "kc_04_085",
    "lesson": 4,
    "word": "毎日",
    "reading": "まいにち",
    "hanViet": "MỖI NHẬT",
    "meaning": "Mỗi ngày, hàng ngày",
    "rootKanji": [
      "毎",
      "日"
    ]
  },
  {
    "id": "kc_04_086",
    "lesson": 4,
    "word": "山の手線",
    "reading": "やまのてせん",
    "hanViet": "SƠN THỦ TUYẾN",
    "meaning": "Tuyến tàu điện Yamanote quanh Tokyo",
    "rootKanji": [
      "山",
      "手",
      "線"
    ]
  },
  {
    "id": "kc_04_087",
    "lesson": 4,
    "word": "川",
    "reading": "かわ",
    "hanViet": "XUYÊN",
    "meaning": "Sông, con sông",
    "rootKanji": [
      "川"
    ]
  },
  {
    "id": "kc_04_088",
    "lesson": 4,
    "word": "ナイル川",
    "reading": "ナイルがわ",
    "hanViet": "XUYÊN",
    "meaning": "Sông Nile",
    "rootKanji": [
      "川"
    ]
  },
  {
    "id": "kc_04_089",
    "lesson": 4,
    "word": "一番",
    "reading": "いちばん",
    "hanViet": "NHẤT PHIÊN",
    "meaning": "Thứ nhất, số một, nhất",
    "rootKanji": [
      "一",
      "番"
    ]
  },
  {
    "id": "kc_04_090",
    "lesson": 4,
    "word": "田んぼ",
    "reading": "たんぼ",
    "hanViet": "ĐIỀN",
    "meaning": "Ruộng lúa, đồng ruộng",
    "rootKanji": [
      "田"
    ]
  },
  {
    "id": "kc_04_091",
    "lesson": 4,
    "word": "水田",
    "reading": "すいでん",
    "hanViet": "THỦY ĐIỀN",
    "meaning": "Ruộng lúa nước",
    "rootKanji": [
      "水",
      "田"
    ]
  },
  {
    "id": "kc_04_092",
    "lesson": 4,
    "word": "小石",
    "reading": "こいし",
    "hanViet": "TIỂU THẠCH",
    "meaning": "Hòn đá nhỏ, sỏi",
    "rootKanji": [
      "小",
      "石"
    ]
  },
  {
    "id": "kc_04_093",
    "lesson": 4,
    "word": "宝石",
    "reading": "ほうせき",
    "hanViet": "BẢO THẠCH",
    "meaning": "Đá quý",
    "rootKanji": [
      "宝",
      "石"
    ]
  },
  {
    "id": "kc_04_094",
    "lesson": 4,
    "word": "石",
    "reading": "いし",
    "hanViet": "THẠCH",
    "meaning": "Đá, hòn đá",
    "rootKanji": [
      "石"
    ]
  },
  {
    "id": "kc_04_095",
    "lesson": 4,
    "word": "花瓶",
    "reading": "かびん",
    "hanViet": "HOA BÌNH",
    "meaning": "Bình hoa, lọ hoa",
    "rootKanji": [
      "花",
      "瓶"
    ]
  },
  {
    "id": "kc_04_096",
    "lesson": 4,
    "word": "花",
    "reading": "はな",
    "hanViet": "HOA",
    "meaning": "Hoa, bông hoa",
    "rootKanji": [
      "花"
    ]
  },
  {
    "id": "kc_04_097",
    "lesson": 4,
    "word": "花束",
    "reading": "はなたば",
    "hanViet": "HOA THÚC",
    "meaning": "Bó hoa",
    "rootKanji": [
      "花",
      "束"
    ]
  },
  {
    "id": "kc_04_098",
    "lesson": 4,
    "word": "花火",
    "reading": "はなび",
    "hanViet": "HOA HỎA",
    "meaning": "Pháo hoa",
    "rootKanji": [
      "花",
      "火"
    ]
  },
  {
    "id": "kc_04_099",
    "lesson": 4,
    "word": "竹",
    "reading": "たけ",
    "hanViet": "TRÚC",
    "meaning": "Cây tre, trúc",
    "rootKanji": [
      "竹"
    ]
  },
  {
    "id": "kc_04_100",
    "lesson": 4,
    "word": "雨",
    "reading": "あめ",
    "hanViet": "VŨ",
    "meaning": "Mưa, cơn mưa",
    "rootKanji": [
      "雨"
    ]
  },
  {
    "id": "kc_04_101",
    "lesson": 4,
    "word": "大雨",
    "reading": "おおあめ",
    "hanViet": "ĐẠI VŨ",
    "meaning": "Mưa to, mưa lớn",
    "rootKanji": [
      "大",
      "雨"
    ]
  },
  {
    "id": "kc_04_102",
    "lesson": 4,
    "word": "雨天",
    "reading": "うてん",
    "hanViet": "VŨ THIÊN",
    "meaning": "Trời mưa",
    "rootKanji": [
      "雨",
      "天"
    ]
  },
  {
    "id": "kc_05_103",
    "lesson": 5,
    "word": "上",
    "reading": "うえ",
    "hanViet": "THƯỢNG",
    "meaning": "Phía trên, bên trên",
    "rootKanji": [
      "上"
    ]
  },
  {
    "id": "kc_05_104",
    "lesson": 5,
    "word": "下",
    "reading": "した",
    "hanViet": "HẠ",
    "meaning": "Phía dưới, bên dưới",
    "rootKanji": [
      "下"
    ]
  },
  {
    "id": "kc_05_105",
    "lesson": 5,
    "word": "四階",
    "reading": "よんかい",
    "hanViet": "TỨ HỒI",
    "meaning": "Tầng 4",
    "rootKanji": [
      "四",
      "階"
    ]
  },
  {
    "id": "kc_05_106",
    "lesson": 5,
    "word": "上がります",
    "reading": "あがります",
    "hanViet": "THƯỢNG",
    "meaning": "Tăng lên, đi lên",
    "rootKanji": [
      "上"
    ]
  },
  {
    "id": "kc_05_107",
    "lesson": 5,
    "word": "下がります",
    "reading": "さがります",
    "hanViet": "HẠ",
    "meaning": "Giảm xuống, hạ xuống",
    "rootKanji": [
      "下"
    ]
  },
  {
    "id": "kc_05_108",
    "lesson": 5,
    "word": "水上",
    "reading": "すいじょう",
    "hanViet": "THỦY THƯỢNG",
    "meaning": "Trên mặt nước",
    "rootKanji": [
      "水",
      "上"
    ]
  },
  {
    "id": "kc_05_109",
    "lesson": 5,
    "word": "五度",
    "reading": "ごど",
    "hanViet": "NGŨ ĐỘ",
    "meaning": "5 độ",
    "rootKanji": [
      "五",
      "度"
    ]
  },
  {
    "id": "kc_05_110",
    "lesson": 5,
    "word": "十度",
    "reading": "じゅうど",
    "hanViet": "THẬP ĐỘ",
    "meaning": "10 độ",
    "rootKanji": [
      "十",
      "度"
    ]
  },
  {
    "id": "kc_05_111",
    "lesson": 5,
    "word": "下ります",
    "reading": "くだります",
    "hanViet": "HẠ",
    "meaning": "Đi xuống",
    "rootKanji": [
      "下"
    ]
  },
  {
    "id": "kc_05_112",
    "lesson": 5,
    "word": "右",
    "reading": "みぎ",
    "hanViet": "HỮU",
    "meaning": "Bên phải",
    "rootKanji": [
      "右"
    ]
  },
  {
    "id": "kc_05_113",
    "lesson": 5,
    "word": "左",
    "reading": "ひだり",
    "hanViet": "TẢ",
    "meaning": "Bên trái",
    "rootKanji": [
      "左"
    ]
  },
  {
    "id": "kc_05_114",
    "lesson": 5,
    "word": "右利き",
    "reading": "みぎきき",
    "hanViet": "HỮU LỢI",
    "meaning": "Thuận tay phải",
    "rootKanji": [
      "右",
      "利"
    ]
  },
  {
    "id": "kc_05_115",
    "lesson": 5,
    "word": "左利き",
    "reading": "ひだりきき",
    "hanViet": "TẢ LỢI",
    "meaning": "Thuận tay trái",
    "rootKanji": [
      "左",
      "利"
    ]
  },
  {
    "id": "kc_05_116",
    "lesson": 5,
    "word": "右側",
    "reading": "みぎがわ",
    "hanViet": "HỮU TRẮC",
    "meaning": "Phía bên phải",
    "rootKanji": [
      "右",
      "側"
    ]
  },
  {
    "id": "kc_05_117",
    "lesson": 5,
    "word": "左側",
    "reading": "ひだりがわ",
    "hanViet": "TẢ TRẮC",
    "meaning": "Phía bên trái",
    "rootKanji": [
      "左",
      "側"
    ]
  },
  {
    "id": "kc_05_118",
    "lesson": 5,
    "word": "右折",
    "reading": "うせつ",
    "hanViet": "HỮU CHIẾT",
    "meaning": "Rẽ phải",
    "rootKanji": [
      "右",
      "折"
    ]
  },
  {
    "id": "kc_05_119",
    "lesson": 5,
    "word": "外",
    "reading": "そと",
    "hanViet": "NGOẠI",
    "meaning": "Bên ngoài",
    "rootKanji": [
      "外"
    ]
  },
  {
    "id": "kc_05_120",
    "lesson": 5,
    "word": "山口先生",
    "reading": "やまぐちせんせい",
    "hanViet": "SƠN KHẨU TIÊN SINH",
    "meaning": "Thầy/Cô Yamaguchi",
    "rootKanji": [
      "山",
      "口",
      "先",
      "生"
    ]
  },
  {
    "id": "kc_05_121",
    "lesson": 5,
    "word": "外出",
    "reading": "がいしゅつ",
    "hanViet": "NGOẠI XUẤT",
    "meaning": "Đi ra ngoài",
    "rootKanji": [
      "外",
      "出"
    ]
  },
  {
    "id": "kc_05_122",
    "lesson": 5,
    "word": "外国",
    "reading": "がいこく",
    "hanViet": "NGOẠI QUỐC",
    "meaning": "Nước ngoài",
    "rootKanji": [
      "外",
      "国"
    ]
  },
  {
    "id": "kc_05_123",
    "lesson": 5,
    "word": "内科",
    "reading": "ないか",
    "hanViet": "NỘI KHOA",
    "meaning": "Khoa nội",
    "rootKanji": [
      "内",
      "科"
    ]
  },
  {
    "id": "kc_05_124",
    "lesson": 5,
    "word": "中",
    "reading": "なか",
    "hanViet": "TRUNG",
    "meaning": "Bên trong, giữa",
    "rootKanji": [
      "中"
    ]
  },
  {
    "id": "kc_05_125",
    "lesson": 5,
    "word": "水中",
    "reading": "すいちゅう",
    "hanViet": "THỦY TRUNG",
    "meaning": "Trong nước, dưới nước",
    "rootKanji": [
      "水",
      "中"
    ]
  },
  {
    "id": "kc_05_126",
    "lesson": 5,
    "word": "会議中",
    "reading": "かいぎちゅう",
    "hanViet": "HỘI NGHỊ TRUNG",
    "meaning": "Đang trong cuộc họp",
    "rootKanji": [
      "会",
      "議",
      "中"
    ]
  },
  {
    "id": "kc_05_127",
    "lesson": 5,
    "word": "一日中",
    "reading": "いちにちじゅう",
    "hanViet": "NHẤT NHẬT TRUNG",
    "meaning": "Suốt một ngày",
    "rootKanji": [
      "一",
      "日",
      "中"
    ]
  },
  {
    "id": "kc_06_128",
    "lesson": 6,
    "word": "学校",
    "reading": "がっこう",
    "hanViet": "HỌC GIÁO",
    "meaning": "Trường học",
    "rootKanji": [
      "学",
      "校"
    ]
  },
  {
    "id": "kc_06_129",
    "lesson": 6,
    "word": "学びます",
    "reading": "まなびます",
    "hanViet": "HỌC",
    "meaning": "Học tập, học hỏi",
    "rootKanji": [
      "学"
    ]
  },
  {
    "id": "kc_06_130",
    "lesson": 6,
    "word": "大学",
    "reading": "だいがく",
    "hanViet": "ĐẠI HỌC",
    "meaning": "Trường đại học",
    "rootKanji": [
      "大",
      "学"
    ]
  },
  {
    "id": "kc_06_131",
    "lesson": 6,
    "word": "進学",
    "reading": "しんがく",
    "hanViet": "TIẾN HỌC",
    "meaning": "Học lên bậc học cao hơn",
    "rootKanji": [
      "進",
      "学"
    ]
  },
  {
    "id": "kc_06_132",
    "lesson": 6,
    "word": "入学式",
    "reading": "にゅうがくしき",
    "hanViet": "NHẬP HỌC THỨC",
    "meaning": "Lễ nhập học, lễ khai giảng",
    "rootKanji": [
      "入",
      "学",
      "式"
    ]
  },
  {
    "id": "kc_06_133",
    "lesson": 6,
    "word": "校長先生",
    "reading": "こうちょうせんせい",
    "hanViet": "GIÁO TRƯỜNG TIÊN SINH",
    "meaning": "Thầy/Cô hiệu trưởng",
    "rootKanji": [
      "校",
      "長",
      "先",
      "生"
    ]
  },
  {
    "id": "kc_06_134",
    "lesson": 6,
    "word": "学生",
    "reading": "がくせい",
    "hanViet": "HỌC SINH",
    "meaning": "Học sinh, sinh viên",
    "rootKanji": [
      "学",
      "生"
    ]
  },
  {
    "id": "kc_06_135",
    "lesson": 6,
    "word": "先に",
    "reading": "さきに",
    "hanViet": "TIÊN",
    "meaning": "Trước (làm trước, đi trước)",
    "rootKanji": [
      "先"
    ]
  },
  {
    "id": "kc_06_136",
    "lesson": 6,
    "word": "先週",
    "reading": "せんしゅう",
    "hanViet": "TIÊN CHU",
    "meaning": "Tuần trước",
    "rootKanji": [
      "先",
      "週"
    ]
  },
  {
    "id": "kc_06_137",
    "lesson": 6,
    "word": "先日",
    "reading": "せんじつ",
    "hanViet": "TIÊN NHẬT",
    "meaning": "Hôm trước, vài ngày trước",
    "rootKanji": [
      "先",
      "日"
    ]
  },
  {
    "id": "kc_06_138",
    "lesson": 6,
    "word": "生まれます",
    "reading": "うまれます",
    "hanViet": "SINH",
    "meaning": "Được sinh ra",
    "rootKanji": [
      "生"
    ]
  },
  {
    "id": "kc_06_139",
    "lesson": 6,
    "word": "名前",
    "reading": "なまえ",
    "hanViet": "DANH TIỀN",
    "meaning": "Tên, họ tên",
    "rootKanji": [
      "名",
      "前"
    ]
  },
  {
    "id": "kc_06_140",
    "lesson": 6,
    "word": "名字",
    "reading": "みょうじ",
    "hanViet": "DANH TỰ",
    "meaning": "Họ (tên họ)",
    "rootKanji": [
      "名",
      "字"
    ]
  },
  {
    "id": "kc_06_141",
    "lesson": 6,
    "word": "有名",
    "reading": "ゆうめい",
    "hanViet": "HỮU DANH",
    "meaning": "Nổi tiếng",
    "rootKanji": [
      "有",
      "名"
    ]
  },
  {
    "id": "kc_06_142",
    "lesson": 6,
    "word": "字",
    "reading": "じ",
    "hanViet": "TỰ",
    "meaning": "Chữ, chữ viết",
    "rootKanji": [
      "字"
    ]
  },
  {
    "id": "kc_06_143",
    "lesson": 6,
    "word": "漢字",
    "reading": "かんじ",
    "hanViet": "HÁN TỰ",
    "meaning": "Chữ Hán",
    "rootKanji": [
      "漢",
      "字"
    ]
  },
  {
    "id": "kc_06_144",
    "lesson": 6,
    "word": "一か月",
    "reading": "いっかげつ",
    "hanViet": "NHẤT NGUYỆT",
    "meaning": "1 tháng",
    "rootKanji": [
      "一",
      "月"
    ]
  },
  {
    "id": "kc_06_145",
    "lesson": 6,
    "word": "一年",
    "reading": "いちねん",
    "hanViet": "NHẤT NIÊN",
    "meaning": "1 năm",
    "rootKanji": [
      "一",
      "年"
    ]
  },
  {
    "id": "kc_06_146",
    "lesson": 6,
    "word": "山本さん",
    "reading": "やまもとさん",
    "hanViet": "SƠN BỔN",
    "meaning": "Anh/Chị Yamamoto",
    "rootKanji": [
      "山",
      "本"
    ]
  },
  {
    "id": "kc_06_147",
    "lesson": 6,
    "word": "お体",
    "reading": "おからだ",
    "hanViet": "THỂ",
    "meaning": "Cơ thể, thân thể, sức khỏe",
    "rootKanji": [
      "体"
    ]
  },
  {
    "id": "kc_06_148",
    "lesson": 6,
    "word": "体育",
    "reading": "たいいく",
    "hanViet": "THỂ DỤC",
    "meaning": "Môn thể dục",
    "rootKanji": [
      "体",
      "育"
    ]
  },
  {
    "id": "kc_06_149",
    "lesson": 6,
    "word": "体育館",
    "reading": "たいいくかん",
    "hanViet": "THỂ DỤC QUÁN",
    "meaning": "Nhà thi đấu thể dục thể thao",
    "rootKanji": [
      "体",
      "育",
      "館"
    ]
  },
  {
    "id": "kc_06_150",
    "lesson": 6,
    "word": "山川さん",
    "reading": "やまかわさん",
    "hanViet": "SƠN XUYÊN",
    "meaning": "Anh/Chị Yamakawa",
    "rootKanji": [
      "山",
      "川"
    ]
  },
  {
    "id": "kc_07_151",
    "lesson": 7,
    "word": "大きい",
    "reading": "おおきい",
    "hanViet": "ĐẠI",
    "meaning": "To, lớn",
    "rootKanji": [
      "大"
    ]
  },
  {
    "id": "kc_07_152",
    "lesson": 7,
    "word": "大好き",
    "reading": "だいすき",
    "hanViet": "ĐẠI HẢO",
    "meaning": "Rất thích",
    "rootKanji": [
      "大",
      "好"
    ]
  },
  {
    "id": "kc_07_153",
    "lesson": 7,
    "word": "大切",
    "reading": "たいせつ",
    "hanViet": "ĐẠI THIẾT",
    "meaning": "Quan trọng, quý giá",
    "rootKanji": [
      "大",
      "切"
    ]
  },
  {
    "id": "kc_07_154",
    "lesson": 7,
    "word": "小さい",
    "reading": "ちいさい",
    "hanViet": "TIỂU",
    "meaning": "Nhỏ, bé",
    "rootKanji": [
      "小"
    ]
  },
  {
    "id": "kc_07_155",
    "lesson": 7,
    "word": "小学生",
    "reading": "しょうがくせい",
    "hanViet": "TIỂU HỌC SINH",
    "meaning": "Học sinh tiểu học",
    "rootKanji": [
      "小",
      "学",
      "生"
    ]
  },
  {
    "id": "kc_07_156",
    "lesson": 7,
    "word": "石川さん",
    "reading": "いしかわさん",
    "hanViet": "THẠCH XUYÊN",
    "meaning": "Anh/Chị Ishikawa",
    "rootKanji": [
      "石",
      "川"
    ]
  },
  {
    "id": "kc_07_157",
    "lesson": 7,
    "word": "高い",
    "reading": "たかい",
    "hanViet": "CAO",
    "meaning": "Cao, đắt tiền",
    "rootKanji": [
      "高"
    ]
  },
  {
    "id": "kc_07_158",
    "lesson": 7,
    "word": "高校生",
    "reading": "こうこうせい",
    "hanViet": "CAO GIÁO SINH",
    "meaning": "Học sinh cấp 3",
    "rootKanji": [
      "高",
      "校",
      "生"
    ]
  },
  {
    "id": "kc_07_159",
    "lesson": 7,
    "word": "友達",
    "reading": "ともだち",
    "hanViet": "HỮU ĐẠT",
    "meaning": "Bạn bè",
    "rootKanji": [
      "友",
      "達"
    ]
  },
  {
    "id": "kc_07_160",
    "lesson": 7,
    "word": "親友",
    "reading": "しんゆう",
    "hanViet": "THÂN HỮU",
    "meaning": "Bạn thân, bạn tri kỷ",
    "rootKanji": [
      "親",
      "友"
    ]
  },
  {
    "id": "kc_07_161",
    "lesson": 7,
    "word": "入ります",
    "reading": "はいります",
    "hanViet": "NHẬP",
    "meaning": "Đi vào, bước vào",
    "rootKanji": [
      "入"
    ]
  },
  {
    "id": "kc_07_162",
    "lesson": 7,
    "word": "入口",
    "reading": "いりぐち",
    "hanViet": "NHẬP KHẨU",
    "meaning": "Cổng vào, lối vào",
    "rootKanji": [
      "入",
      "口"
    ]
  },
  {
    "id": "kc_07_163",
    "lesson": 7,
    "word": "出口",
    "reading": "でぐち",
    "hanViet": "XUẤT KHẨU",
    "meaning": "Cổng ra, lối ra",
    "rootKanji": [
      "出",
      "口"
    ]
  },
  {
    "id": "kc_07_164",
    "lesson": 7,
    "word": "出します",
    "reading": "だします",
    "hanViet": "XUẤT",
    "meaning": "Lấy ra, nộp, gửi",
    "rootKanji": [
      "出"
    ]
  },
  {
    "id": "kc_07_165",
    "lesson": 7,
    "word": "出かけます",
    "reading": "でかけます",
    "hanViet": "XUẤT",
    "meaning": "Đi ra ngoài",
    "rootKanji": [
      "出"
    ]
  },
  {
    "id": "kc_07_166",
    "lesson": 7,
    "word": "門",
    "reading": "もん",
    "hanViet": "MÔN",
    "meaning": "Cổng, cửa cổng",
    "rootKanji": [
      "門"
    ]
  },
  {
    "id": "kc_07_167",
    "lesson": 7,
    "word": "校門",
    "reading": "こうもん",
    "hanViet": "GIÁO MÔN",
    "meaning": "Cổng trường",
    "rootKanji": [
      "校",
      "門"
    ]
  },
  {
    "id": "kc_07_168",
    "lesson": 7,
    "word": "専門",
    "reading": "せんもん",
    "hanViet": "CHUYÊN MÔN",
    "meaning": "Chuyên môn",
    "rootKanji": [
      "専",
      "門"
    ]
  },
  {
    "id": "kc_07_169",
    "lesson": 7,
    "word": "入門書",
    "reading": "にゅうもんしょ",
    "hanViet": "NHẬP MÔN THƯ",
    "meaning": "Sách cho người mới bắt đầu (sách nhập môn)",
    "rootKanji": [
      "入",
      "門",
      "書"
    ]
  },
  {
    "id": "kc_08_170",
    "lesson": 8,
    "word": "父の日",
    "reading": "ちちのひ",
    "hanViet": "PHỤ NHẬT",
    "meaning": "Ngày của cha (Chủ nhật thứ 3 tháng 6)",
    "rootKanji": [
      "父",
      "日"
    ]
  },
  {
    "id": "kc_08_171",
    "lesson": 8,
    "word": "祖父",
    "reading": "そふ",
    "hanViet": "TỔ PHỤ",
    "meaning": "Ông (nội/ngoại của mình)",
    "rootKanji": [
      "祖",
      "父"
    ]
  },
  {
    "id": "kc_08_172",
    "lesson": 8,
    "word": "八十八歳",
    "reading": "はちじゅうはっさい",
    "hanViet": "BÁT THẬP BÁT TUẾ",
    "meaning": "88 tuổi",
    "rootKanji": [
      "八",
      "十",
      "歳"
    ]
  },
  {
    "id": "kc_08_173",
    "lesson": 8,
    "word": "母の日",
    "reading": "ははのひ",
    "hanViet": "MẪU NHẬT",
    "meaning": "Ngày của mẹ (Chủ nhật thứ 2 tháng 5)",
    "rootKanji": [
      "母",
      "日"
    ]
  },
  {
    "id": "kc_08_174",
    "lesson": 8,
    "word": "母語",
    "reading": "ぼご",
    "hanViet": "MẪU NGỮ",
    "meaning": "Tiếng mẹ đẻ",
    "rootKanji": [
      "母",
      "語"
    ]
  },
  {
    "id": "kc_08_175",
    "lesson": 8,
    "word": "母校",
    "reading": "ぼこう",
    "hanViet": "MẪU GIÁO",
    "meaning": "Trường cũ (trường từng theo học)",
    "rootKanji": [
      "母",
      "校"
    ]
  },
  {
    "id": "kc_08_176",
    "lesson": 8,
    "word": "子供",
    "reading": "こども",
    "hanViet": "TỬ CUNG",
    "meaning": "Con cái, trẻ em",
    "rootKanji": [
      "子",
      "供"
    ]
  },
  {
    "id": "kc_08_177",
    "lesson": 8,
    "word": "お子さん",
    "reading": "おこさん",
    "hanViet": "TỬ",
    "meaning": "Con (của người khác / cách gọi lịch sự)",
    "rootKanji": [
      "子"
    ]
  },
  {
    "id": "kc_08_178",
    "lesson": 8,
    "word": "男子学生",
    "reading": "だんしがくせい",
    "hanViet": "NAM TỬ HỌC SINH",
    "meaning": "Nam sinh viên, học sinh nam",
    "rootKanji": [
      "男",
      "子",
      "学",
      "生"
    ]
  },
  {
    "id": "kc_08_179",
    "lesson": 8,
    "word": "男の先生",
    "reading": "おとこのせんせい",
    "hanViet": "NAM TIÊN SINH",
    "meaning": "Thầy giáo nam",
    "rootKanji": [
      "男",
      "先",
      "生"
    ]
  },
  {
    "id": "kc_08_180",
    "lesson": 8,
    "word": "四人",
    "reading": "よにん",
    "hanViet": "TỨ NHÂN",
    "meaning": "4 người",
    "rootKanji": [
      "四",
      "人"
    ]
  },
  {
    "id": "kc_08_181",
    "lesson": 8,
    "word": "男性",
    "reading": "だんせい",
    "hanViet": "NAM TÍNH",
    "meaning": "Đàn ông, nam giới",
    "rootKanji": [
      "男",
      "性"
    ]
  },
  {
    "id": "kc_08_182",
    "lesson": 8,
    "word": "女の人",
    "reading": "おんなのひと",
    "hanViet": "NỮ NHÂN",
    "meaning": "Người phụ nữ, cô gái",
    "rootKanji": [
      "女",
      "人"
    ]
  },
  {
    "id": "kc_08_183",
    "lesson": 8,
    "word": "女の子",
    "reading": "おんなのこ",
    "hanViet": "NỮ TỬ",
    "meaning": "Bé gái",
    "rootKanji": [
      "女",
      "子"
    ]
  },
  {
    "id": "kc_08_184",
    "lesson": 8,
    "word": "一人",
    "reading": "ひとり",
    "hanViet": "NHẤT NHÂN",
    "meaning": "1 người, một mình",
    "rootKanji": [
      "一",
      "人"
    ]
  },
  {
    "id": "kc_08_185",
    "lesson": 8,
    "word": "二人",
    "reading": "ふたり",
    "hanViet": "NHỊ NHÂN",
    "meaning": "2 người",
    "rootKanji": [
      "二",
      "人"
    ]
  },
  {
    "id": "kc_08_186",
    "lesson": 8,
    "word": "女子",
    "reading": "じょし",
    "hanViet": "NỮ TỬ",
    "meaning": "Nữ giới, nữ nhi",
    "rootKanji": [
      "女",
      "子"
    ]
  },
  {
    "id": "kc_08_187",
    "lesson": 8,
    "word": "彼女",
    "reading": "かのじょ",
    "hanViet": "BỈ NỮ",
    "meaning": "Cô ấy, bạn gái",
    "rootKanji": [
      "彼",
      "女"
    ]
  },
  {
    "id": "kc_08_188",
    "lesson": 8,
    "word": "犬",
    "reading": "いぬ",
    "hanViet": "KHUYỂN",
    "meaning": "Con chó",
    "rootKanji": [
      "犬"
    ]
  },
  {
    "id": "kc_08_189",
    "lesson": 8,
    "word": "子犬",
    "reading": "こいぬ",
    "hanViet": "TỬ KHUYỂN",
    "meaning": "Chó con, cún con",
    "rootKanji": [
      "子",
      "犬"
    ]
  },
  {
    "id": "kc_08_190",
    "lesson": 8,
    "word": "鳥",
    "reading": "とり",
    "hanViet": "ĐIỂU",
    "meaning": "Con chim",
    "rootKanji": [
      "鳥"
    ]
  },
  {
    "id": "kc_08_191",
    "lesson": 8,
    "word": "白鳥",
    "reading": "はくちょう",
    "hanViet": "BẠCH ĐIỂU",
    "meaning": "Thiên nga, chim trắng",
    "rootKanji": [
      "白",
      "鳥"
    ]
  },
  {
    "id": "kc_08_192",
    "lesson": 8,
    "word": "小鳥",
    "reading": "ことり",
    "hanViet": "TIỂU ĐIỂU",
    "meaning": "Chim non, chim nhỏ",
    "rootKanji": [
      "小",
      "鳥"
    ]
  },
  {
    "id": "kc_09_193",
    "lesson": 9,
    "word": "立ちます",
    "reading": "たちます",
    "hanViet": "LẬP",
    "meaning": "Đứng, đứng lên",
    "rootKanji": [
      "立"
    ]
  },
  {
    "id": "kc_09_194",
    "lesson": 9,
    "word": "国立大学",
    "reading": "こくりつだいがく",
    "hanViet": "QUỐC LẬP ĐẠI HỌC",
    "meaning": "Trường đại học công lập",
    "rootKanji": [
      "国",
      "立",
      "大",
      "学"
    ]
  },
  {
    "id": "kc_09_195",
    "lesson": 9,
    "word": "土日",
    "reading": "どにち",
    "hanViet": "THỔ NHẬT",
    "meaning": "Thứ bảy và chủ nhật (cuối tuần)",
    "rootKanji": [
      "土",
      "日"
    ]
  },
  {
    "id": "kc_09_196",
    "lesson": 9,
    "word": "休み",
    "reading": "やすみ",
    "hanViet": "HƯU",
    "meaning": "Ngày nghỉ, giờ nghỉ",
    "rootKanji": [
      "休"
    ]
  },
  {
    "id": "kc_09_197",
    "lesson": 9,
    "word": "休みません",
    "reading": "やすみません",
    "hanViet": "HƯU",
    "meaning": "Không nghỉ ngơi",
    "rootKanji": [
      "休"
    ]
  },
  {
    "id": "kc_09_198",
    "lesson": 9,
    "word": "休日",
    "reading": "きゅうじつ",
    "hanViet": "HƯU NHẬT",
    "meaning": "Ngày nghỉ lễ",
    "rootKanji": [
      "休",
      "日"
    ]
  },
  {
    "id": "kc_09_199",
    "lesson": 9,
    "word": "見ます",
    "reading": "みます",
    "hanViet": "KIẾN",
    "meaning": "Xem, nhìn, ngắm",
    "rootKanji": [
      "見"
    ]
  },
  {
    "id": "kc_09_200",
    "lesson": 9,
    "word": "見せます",
    "reading": "みせます",
    "hanViet": "KIẾN",
    "meaning": "Cho xem, cho nhìn",
    "rootKanji": [
      "見"
    ]
  },
  {
    "id": "kc_09_201",
    "lesson": 9,
    "word": "新聞社",
    "reading": "しんぶんしゃ",
    "hanViet": "TÂN VĂN XÃ",
    "meaning": "Tòa soạn báo",
    "rootKanji": [
      "新",
      "聞",
      "社"
    ]
  },
  {
    "id": "kc_09_202",
    "lesson": 9,
    "word": "見学",
    "reading": "けんがく",
    "hanViet": "KIẾN HỌC",
    "meaning": "Tham quan học tập, kiến tập",
    "rootKanji": [
      "見",
      "学"
    ]
  },
  {
    "id": "kc_09_203",
    "lesson": 9,
    "word": "意見",
    "reading": "いけん",
    "hanViet": "Ý KIẾN",
    "meaning": "Ý kiến, quan điểm",
    "rootKanji": [
      "意",
      "見"
    ]
  },
  {
    "id": "kc_09_204",
    "lesson": 9,
    "word": "聞きます",
    "reading": "ききます",
    "hanViet": "VĂN",
    "meaning": "Nghe, hỏi",
    "rootKanji": [
      "聞"
    ]
  },
  {
    "id": "kc_09_205",
    "lesson": 9,
    "word": "大阪",
    "reading": "おおさか",
    "hanViet": "ĐẠI PHẢN",
    "meaning": "Thành phố Osaka",
    "rootKanji": [
      "大",
      "阪"
    ]
  },
  {
    "id": "kc_09_206",
    "lesson": 9,
    "word": "行きます",
    "reading": "いきます",
    "hanViet": "HÀNH",
    "meaning": "Đi",
    "rootKanji": [
      "行"
    ]
  },
  {
    "id": "kc_09_207",
    "lesson": 9,
    "word": "行列",
    "reading": "ぎょうれつ",
    "hanViet": "HÀNH LIỆT",
    "meaning": "Đoàn người xếp hàng",
    "rootKanji": [
      "行",
      "列"
    ]
  },
  {
    "id": "kc_09_208",
    "lesson": 9,
    "word": "行います",
    "reading": "おこないます",
    "hanViet": "HÀNH",
    "meaning": "Tổ chức, tiến hành, thực hiện",
    "rootKanji": [
      "行"
    ]
  },
  {
    "id": "kc_09_209",
    "lesson": 9,
    "word": "来ません",
    "reading": "きません",
    "hanViet": "LAI",
    "meaning": "Không đến",
    "rootKanji": [
      "来"
    ]
  },
  {
    "id": "kc_09_210",
    "lesson": 9,
    "word": "来日します",
    "reading": "らいにちします",
    "hanViet": "LAI NHẬT",
    "meaning": "Đến Nhật Bản",
    "rootKanji": [
      "来",
      "日"
    ]
  },
  {
    "id": "kc_09_211",
    "lesson": 9,
    "word": "帰ります",
    "reading": "かえります",
    "hanViet": "QUY",
    "meaning": "Về, trở về nhà",
    "rootKanji": [
      "帰"
    ]
  },
  {
    "id": "kc_09_212",
    "lesson": 9,
    "word": "帰って",
    "reading": "かえって",
    "hanViet": "QUY",
    "meaning": "Trở về (thể te)",
    "rootKanji": [
      "帰"
    ]
  },
  {
    "id": "kc_09_213",
    "lesson": 9,
    "word": "来年",
    "reading": "らいねん",
    "hanViet": "LAI NIÊN",
    "meaning": "Năm sau, sang năm",
    "rootKanji": [
      "来",
      "年"
    ]
  },
  {
    "id": "kc_09_214",
    "lesson": 9,
    "word": "帰国します",
    "reading": "きこくします",
    "hanViet": "HỒI QUỐC",
    "meaning": "Về nước",
    "rootKanji": [
      "帰",
      "国"
    ]
  },
  {
    "id": "kc_10_215",
    "lesson": 10,
    "word": "米",
    "reading": "こめ",
    "hanViet": "MỄ",
    "meaning": "Gạo",
    "rootKanji": [
      "米"
    ]
  },
  {
    "id": "kc_10_216",
    "lesson": 10,
    "word": "白米",
    "reading": "はくまい",
    "hanViet": "BẠCH MỄ",
    "meaning": "Gạo trắng",
    "rootKanji": [
      "白",
      "米"
    ]
  },
  {
    "id": "kc_10_217",
    "lesson": 10,
    "word": "玄米",
    "reading": "げんまい",
    "hanViet": "HUYỀN MỄ",
    "meaning": "Gạo lứt (chưa xay xát kỹ)",
    "rootKanji": [
      "玄",
      "米"
    ]
  },
  {
    "id": "kc_10_218",
    "lesson": 10,
    "word": "お茶",
    "reading": "おちゃ",
    "hanViet": "TRÀ",
    "meaning": "Trà, nước chè",
    "rootKanji": [
      "茶"
    ]
  },
  {
    "id": "kc_10_219",
    "lesson": 10,
    "word": "紅茶",
    "reading": "こうちゃ",
    "hanViet": "HỒNG TRÀ",
    "meaning": "Trà đen, hồng trà",
    "rootKanji": [
      "紅",
      "茶"
    ]
  },
  {
    "id": "kc_10_220",
    "lesson": 10,
    "word": "日本茶",
    "reading": "にほんちゃ",
    "hanViet": "NHẬT BẢN TRÀ",
    "meaning": "Trà truyền thống Nhật Bản",
    "rootKanji": [
      "日",
      "本",
      "茶"
    ]
  },
  {
    "id": "kc_10_221",
    "lesson": 10,
    "word": "茶色",
    "reading": "ちゃいろ",
    "hanViet": "TRÀ SẮC",
    "meaning": "Màu nâu",
    "rootKanji": [
      "茶",
      "色"
    ]
  },
  {
    "id": "kc_10_222",
    "lesson": 10,
    "word": "牛",
    "reading": "うし",
    "hanViet": "NGƯU",
    "meaning": "Con bò",
    "rootKanji": [
      "牛"
    ]
  },
  {
    "id": "kc_10_223",
    "lesson": 10,
    "word": "牛乳",
    "reading": "ぎゅうにゅう",
    "hanViet": "NGƯU NHŨ",
    "meaning": "Sữa bò tươi",
    "rootKanji": [
      "牛",
      "乳"
    ]
  },
  {
    "id": "kc_10_224",
    "lesson": 10,
    "word": "牛肉",
    "reading": "ぎゅうにく",
    "hanViet": "NGƯU NHỤC",
    "meaning": "Thịt bò",
    "rootKanji": [
      "牛",
      "肉"
    ]
  },
  {
    "id": "kc_10_225",
    "lesson": 10,
    "word": "豚肉",
    "reading": "ぶたにく",
    "hanViet": "ĐỒN NHỤC",
    "meaning": "Thịt heo, thịt lợn",
    "rootKanji": [
      "豚",
      "肉"
    ]
  },
  {
    "id": "kc_10_226",
    "lesson": 10,
    "word": "焼肉",
    "reading": "やきにく",
    "hanViet": "THIÊU NHỤC",
    "meaning": "Thịt nướng kiểu Nhật",
    "rootKanji": [
      "焼",
      "肉"
    ]
  },
  {
    "id": "kc_10_227",
    "lesson": 10,
    "word": "鶏肉",
    "reading": "とりにく",
    "hanViet": "KÊ NHỤC",
    "meaning": "Thịt gà",
    "rootKanji": [
      "鶏",
      "肉"
    ]
  },
  {
    "id": "kc_10_228",
    "lesson": 10,
    "word": "魚市場",
    "reading": "うおいちば",
    "hanViet": "NGƯ THỊ TRÀNG",
    "meaning": "Chợ cá đầu mối",
    "rootKanji": [
      "魚",
      "市",
      "場"
    ]
  },
  {
    "id": "kc_10_229",
    "lesson": 10,
    "word": "魚屋",
    "reading": "さかなや",
    "hanViet": "NGƯ ỐC",
    "meaning": "Cửa hàng bán cá",
    "rootKanji": [
      "魚",
      "屋"
    ]
  },
  {
    "id": "kc_10_230",
    "lesson": 10,
    "word": "魚",
    "reading": "さかな",
    "hanViet": "NGƯ",
    "meaning": "Con cá",
    "rootKanji": [
      "魚"
    ]
  },
  {
    "id": "kc_10_231",
    "lesson": 10,
    "word": "人魚",
    "reading": "にんぎょ",
    "hanViet": "NHÂN NGƯ",
    "meaning": "Nàng tiên cá",
    "rootKanji": [
      "人",
      "魚"
    ]
  },
  {
    "id": "kc_10_232",
    "lesson": 10,
    "word": "貝",
    "reading": "かい",
    "hanViet": "BỐI",
    "meaning": "Con sò, con hến, nghêu, ốc",
    "rootKanji": [
      "貝"
    ]
  },
  {
    "id": "kc_10_233",
    "lesson": 10,
    "word": "赤貝",
    "reading": "あかがい",
    "hanViet": "XÍCH BỐI",
    "meaning": "Sò huyết",
    "rootKanji": [
      "赤",
      "貝"
    ]
  },
  {
    "id": "kc_10_234",
    "lesson": 10,
    "word": "焼き魚",
    "reading": "やきざかな",
    "hanViet": "THIÊU NGƯ",
    "meaning": "Cá nướng",
    "rootKanji": [
      "焼",
      "魚"
    ]
  },
  {
    "id": "kc_10_235",
    "lesson": 10,
    "word": "好き",
    "reading": "すき",
    "hanViet": "HẢO",
    "meaning": "Thích",
    "rootKanji": [
      "好"
    ]
  },
  {
    "id": "kc_10_236",
    "lesson": 10,
    "word": "大好物",
    "reading": "だいこうぶつ",
    "hanViet": "ĐẠI HẢO VẬT",
    "meaning": "Món ăn khoái khẩu nhất",
    "rootKanji": [
      "大",
      "好",
      "物"
    ]
  },
  {
    "id": "kc_10_237",
    "lesson": 10,
    "word": "買物",
    "reading": "かいもの",
    "hanViet": "MÃI VẬT",
    "meaning": "Mua sắm, đồ mua",
    "rootKanji": [
      "買",
      "物"
    ]
  },
  {
    "id": "kc_10_238",
    "lesson": 10,
    "word": "動物園",
    "reading": "どうぶつえん",
    "hanViet": "ĐỘNG VẬT VIÊN",
    "meaning": "Vườn bách thú, sở thú",
    "rootKanji": [
      "動",
      "物",
      "園"
    ]
  },
  {
    "id": "kc_10_239",
    "lesson": 10,
    "word": "物価",
    "reading": "ぶっか",
    "hanViet": "VẬT GIÁ",
    "meaning": "Giá cả hàng hóa, vật giá",
    "rootKanji": [
      "物",
      "価"
    ]
  },
  {
    "id": "kc_11_240",
    "lesson": 11,
    "word": "林",
    "reading": "はやし",
    "hanViet": "LÂM",
    "meaning": "Rừng nhỏ, lùm cây",
    "rootKanji": [
      "林"
    ]
  },
  {
    "id": "kc_11_241",
    "lesson": 11,
    "word": "竹林",
    "reading": "たけばやし",
    "hanViet": "TRÚC LÂM",
    "meaning": "Rừng tre, bụi tre",
    "rootKanji": [
      "竹",
      "林"
    ]
  },
  {
    "id": "kc_11_242",
    "lesson": 11,
    "word": "竹の子",
    "reading": "たけのこ",
    "hanViet": "TRÚC TỬ",
    "meaning": "Măng tre",
    "rootKanji": [
      "竹",
      "子"
    ]
  },
  {
    "id": "kc_11_243",
    "lesson": 11,
    "word": "森林",
    "reading": "しんりん",
    "hanViet": "SÂM LÂM",
    "meaning": "Rừng rậm nguyên sinh",
    "rootKanji": [
      "森",
      "林"
    ]
  },
  {
    "id": "kc_11_244",
    "lesson": 11,
    "word": "森の中",
    "reading": "もりのなか",
    "hanViet": "SÂM TRUNG",
    "meaning": "Ở trong rừng sâu",
    "rootKanji": [
      "森",
      "中"
    ]
  },
  {
    "id": "kc_11_245",
    "lesson": 11,
    "word": "青森県",
    "reading": "あおもりけん",
    "hanViet": "THANH SÂM HUYỆN",
    "meaning": "Tỉnh Aomori",
    "rootKanji": [
      "青",
      "森",
      "県"
    ]
  },
  {
    "id": "kc_11_246",
    "lesson": 11,
    "word": "畑",
    "reading": "はたけ",
    "hanViet": "HOÀN",
    "meaning": "Ruộng cạn, nương rẫy, cánh đồng hoa màu",
    "rootKanji": [
      "畑"
    ]
  },
  {
    "id": "kc_11_247",
    "lesson": 11,
    "word": "田畑",
    "reading": "たばたけ",
    "hanViet": "ĐIỀN HOÀN",
    "meaning": "Ruộng đồng (nước và cạn)",
    "rootKanji": [
      "田",
      "畑"
    ]
  },
  {
    "id": "kc_11_248",
    "lesson": 11,
    "word": "岩の上",
    "reading": "いわのうえ",
    "hanViet": "THƯỢNG NHAM",
    "meaning": "Ở trên tảng đá lớn",
    "rootKanji": [
      "岩",
      "上"
    ]
  },
  {
    "id": "kc_11_249",
    "lesson": 11,
    "word": "岩山",
    "reading": "いわやま",
    "hanViet": "NHAM SƠN",
    "meaning": "Núi đá gập ghềnh",
    "rootKanji": [
      "岩",
      "山"
    ]
  },
  {
    "id": "kc_11_250",
    "lesson": 11,
    "word": "溶岩",
    "reading": "ようがん",
    "hanViet": "DUNG NHAM",
    "meaning": "Dung nham núi lửa",
    "rootKanji": [
      "溶",
      "岩"
    ]
  },
  {
    "id": "kc_11_251",
    "lesson": 11,
    "word": "音",
    "reading": "おと",
    "hanViet": "ÂM",
    "meaning": "Âm thanh, tiếng động",
    "rootKanji": [
      "音"
    ]
  },
  {
    "id": "kc_11_252",
    "lesson": 11,
    "word": "音色",
    "reading": "ねいろ",
    "hanViet": "ÂM SẮC",
    "meaning": "Âm sắc, giai điệu",
    "rootKanji": [
      "音",
      "色"
    ]
  },
  {
    "id": "kc_11_253",
    "lesson": 11,
    "word": "発音",
    "reading": "はつおん",
    "hanViet": "PHÁT ÂM",
    "meaning": "Phát âm",
    "rootKanji": [
      "発",
      "音"
    ]
  },
  {
    "id": "kc_11_254",
    "lesson": 11,
    "word": "明るい",
    "reading": "あかるい",
    "hanViet": "MINH",
    "meaning": "Sáng sủa, vui vẻ, hoạt bát",
    "rootKanji": [
      "明"
    ]
  },
  {
    "id": "kc_11_255",
    "lesson": 11,
    "word": "明るくなります",
    "reading": "あかるくなります",
    "hanViet": "MINH",
    "meaning": "Trở nên sáng sủa",
    "rootKanji": [
      "明"
    ]
  },
  {
    "id": "kc_11_256",
    "lesson": 11,
    "word": "説明",
    "reading": "せつめい",
    "hanViet": "THUYẾT MINH",
    "meaning": "Giải thích, thuyết minh",
    "rootKanji": [
      "説",
      "明"
    ]
  },
  {
    "id": "kc_11_257",
    "lesson": 11,
    "word": "暗い",
    "reading": "くらい",
    "hanViet": "ÁM",
    "meaning": "Tối tăm, u ám",
    "rootKanji": [
      "暗"
    ]
  },
  {
    "id": "kc_11_258",
    "lesson": 11,
    "word": "暗記します",
    "reading": "あんきします",
    "hanViet": "ÁM KÍ",
    "meaning": "Ghi nhớ, học thuộc lòng",
    "rootKanji": [
      "暗",
      "記"
    ]
  },
  {
    "id": "kc_12_259",
    "lesson": 12,
    "word": "言ってください",
    "reading": "いってください",
    "hanViet": "NGÔN",
    "meaning": "Xin hãy nói",
    "rootKanji": [
      "言"
    ]
  },
  {
    "id": "kc_12_260",
    "lesson": 12,
    "word": "方言",
    "reading": "ほうげん",
    "hanViet": "PHƯƠNG NGÔN",
    "meaning": "Phương ngữ, tiếng địa phương",
    "rootKanji": [
      "方",
      "言"
    ]
  },
  {
    "id": "kc_12_261",
    "lesson": 12,
    "word": "伝言",
    "reading": "でんごん",
    "hanViet": "TRUYỀN NGÔN",
    "meaning": "Lời nhắn, tin nhắn lại",
    "rootKanji": [
      "伝",
      "言"
    ]
  },
  {
    "id": "kc_12_262",
    "lesson": 12,
    "word": "書いてください",
    "reading": "かいてください",
    "hanViet": "THƯ",
    "meaning": "Xin hãy viết",
    "rootKanji": [
      "書"
    ]
  },
  {
    "id": "kc_12_263",
    "lesson": 12,
    "word": "辞書",
    "reading": "じしょ",
    "hanViet": "TỪ THƯ",
    "meaning": "Cuốn từ điển",
    "rootKanji": [
      "辞",
      "書"
    ]
  },
  {
    "id": "kc_12_264",
    "lesson": 12,
    "word": "言葉",
    "reading": "ことば",
    "hanViet": "NGÔN DIỆP",
    "meaning": "Từ ngữ, tiếng nói, ngôn ngữ",
    "rootKanji": [
      "言",
      "葉"
    ]
  },
  {
    "id": "kc_12_265",
    "lesson": 12,
    "word": "読みます",
    "reading": "よみます",
    "hanViet": "ĐỘC",
    "meaning": "Đọc",
    "rootKanji": [
      "読"
    ]
  },
  {
    "id": "kc_12_266",
    "lesson": 12,
    "word": "読書",
    "reading": "どくしょ",
    "hanViet": "ĐỘC THƯ",
    "meaning": "Việc đọc sách",
    "rootKanji": [
      "読",
      "書"
    ]
  },
  {
    "id": "kc_12_267",
    "lesson": 12,
    "word": "話しました",
    "reading": "はなしました",
    "hanViet": "THOẠI",
    "meaning": "Đã nói chuyện",
    "rootKanji": [
      "話"
    ]
  },
  {
    "id": "kc_12_268",
    "lesson": 12,
    "word": "話",
    "reading": "はなし",
    "hanViet": "THOẠI",
    "meaning": "Câu chuyện, lời nói",
    "rootKanji": [
      "話"
    ]
  },
  {
    "id": "kc_12_269",
    "lesson": 12,
    "word": "会話",
    "reading": "かいわ",
    "hanViet": "HỘI THOẠI",
    "meaning": "Đàm thoại, hội thoại",
    "rootKanji": [
      "会",
      "話"
    ]
  },
  {
    "id": "kc_12_270",
    "lesson": 12,
    "word": "食べました",
    "reading": "たべました",
    "hanViet": "THỰC",
    "meaning": "Đã ăn",
    "rootKanji": [
      "食"
    ]
  },
  {
    "id": "kc_12_271",
    "lesson": 12,
    "word": "食事",
    "reading": "しょくじ",
    "hanViet": "THỰC SỰ",
    "meaning": "Bữa ăn, dùng bữa",
    "rootKanji": [
      "食",
      "事"
    ]
  },
  {
    "id": "kc_12_272",
    "lesson": 12,
    "word": "食堂",
    "reading": "しょくどう",
    "hanViet": "THỰC ĐƯỜNG",
    "meaning": "Nhà ăn, căn tin",
    "rootKanji": [
      "食",
      "堂"
    ]
  },
  {
    "id": "kc_12_273",
    "lesson": 12,
    "word": "飲みます",
    "reading": "のみます",
    "hanViet": "ẨM",
    "meaning": "Uống",
    "rootKanji": [
      "飲"
    ]
  },
  {
    "id": "kc_12_274",
    "lesson": 12,
    "word": "飲食店",
    "reading": "いんしょくてん",
    "hanViet": "ẨM THỰC ĐIẾM",
    "meaning": "Quán ăn, nhà hàng ăn uống",
    "rootKanji": [
      "飲",
      "食",
      "店"
    ]
  },
  {
    "id": "kc_12_275",
    "lesson": 12,
    "word": "買いました",
    "reading": "かいました",
    "hanViet": "MÃI",
    "meaning": "Đã mua",
    "rootKanji": [
      "買"
    ]
  },
  {
    "id": "kc_12_276",
    "lesson": 12,
    "word": "買い物",
    "reading": "かいもの",
    "hanViet": "MÃI VẬT",
    "meaning": "Mua sắm, việc đi chợ",
    "rootKanji": [
      "買",
      "物"
    ]
  },
  {
    "id": "kc_13_277",
    "lesson": 13,
    "word": "町",
    "reading": "まち",
    "hanViet": "ĐINH",
    "meaning": "Thị trấn, khu phố",
    "rootKanji": [
      "町"
    ]
  },
  {
    "id": "kc_13_278",
    "lesson": 13,
    "word": "大きな",
    "reading": "おおきな",
    "hanViet": "ĐẠI",
    "meaning": "To lớn (đứng trước danh từ)",
    "rootKanji": [
      "大"
    ]
  },
  {
    "id": "kc_13_279",
    "lesson": 13,
    "word": "お寺",
    "reading": "おてら",
    "hanViet": "TỰ",
    "meaning": "Ngôi chùa",
    "rootKanji": [
      "寺"
    ]
  },
  {
    "id": "kc_13_280",
    "lesson": 13,
    "word": "町長",
    "reading": "ちょうちょう",
    "hanViet": "ĐINH TRƯỜNG",
    "meaning": "Thị trưởng thị trấn",
    "rootKanji": [
      "町",
      "長"
    ]
  },
  {
    "id": "kc_13_281",
    "lesson": 13,
    "word": "下町",
    "reading": "したまち",
    "hanViet": "HẠ ĐINH",
    "meaning": "Khu phố cổ, phố bình dân",
    "rootKanji": [
      "下",
      "町"
    ]
  },
  {
    "id": "kc_13_282",
    "lesson": 13,
    "word": "町内",
    "reading": "ちょうない",
    "hanViet": "ĐINH NỘI",
    "meaning": "Trong khu phố",
    "rootKanji": [
      "町",
      "内"
    ]
  },
  {
    "id": "kc_13_283",
    "lesson": 13,
    "word": "ほうりゅう寺",
    "reading": "ほうりゅうじ",
    "hanViet": "TỰ",
    "meaning": "Chùa Pháp Long (Houryuu-ji)",
    "rootKanji": [
      "寺"
    ]
  },
  {
    "id": "kc_13_284",
    "lesson": 13,
    "word": "電車",
    "reading": "でんしゃ",
    "hanViet": "ĐIỆN XA",
    "meaning": "Tàu điện",
    "rootKanji": [
      "電",
      "車"
    ]
  },
  {
    "id": "kc_13_285",
    "lesson": 13,
    "word": "電気",
    "reading": "でんき",
    "hanViet": "ĐIỆN KHÍ",
    "meaning": "Điện, đèn điện",
    "rootKanji": [
      "電",
      "気"
    ]
  },
  {
    "id": "kc_13_286",
    "lesson": 13,
    "word": "電話",
    "reading": "でんわ",
    "hanViet": "ĐIỆN THOẠI",
    "meaning": "Điện thoại",
    "rootKanji": [
      "電",
      "話"
    ]
  },
  {
    "id": "kc_13_287",
    "lesson": 13,
    "word": "車",
    "reading": "くるま",
    "hanViet": "XA",
    "meaning": "Xe ô tô, xe cộ",
    "rootKanji": [
      "車"
    ]
  },
  {
    "id": "kc_13_288",
    "lesson": 13,
    "word": "自転車",
    "reading": "じてんしゃ",
    "hanViet": "TỰ CHUYỂN XA",
    "meaning": "Xe đạp",
    "rootKanji": [
      "自",
      "転",
      "車"
    ]
  },
  {
    "id": "kc_13_289",
    "lesson": 13,
    "word": "東",
    "reading": "ひがし",
    "hanViet": "ĐÔNG",
    "meaning": "Phía đông",
    "rootKanji": [
      "東"
    ]
  },
  {
    "id": "kc_13_290",
    "lesson": 13,
    "word": "西",
    "reading": "にし",
    "hanViet": "TÂY",
    "meaning": "Phía tây",
    "rootKanji": [
      "西"
    ]
  },
  {
    "id": "kc_13_291",
    "lesson": 13,
    "word": "東京",
    "reading": "とうきょう",
    "hanViet": "ĐÔNG KINH",
    "meaning": "Thủ đô Tokyo",
    "rootKanji": [
      "東",
      "京"
    ]
  },
  {
    "id": "kc_13_292",
    "lesson": 13,
    "word": "西口",
    "reading": "にしぐち",
    "hanViet": "TÂY KHẨU",
    "meaning": "Cửa phía tây (nhà ga)",
    "rootKanji": [
      "西",
      "口"
    ]
  },
  {
    "id": "kc_13_293",
    "lesson": 13,
    "word": "北西",
    "reading": "ほくせい",
    "hanViet": "BẮC TÂY",
    "meaning": "Hướng Tây Bắc",
    "rootKanji": [
      "北",
      "西"
    ]
  },
  {
    "id": "kc_13_294",
    "lesson": 13,
    "word": "西日本",
    "reading": "にしにほん",
    "hanViet": "TÂY NHẬT BẢN",
    "meaning": "Miền Tây Nhật Bản",
    "rootKanji": [
      "西",
      "日",
      "本"
    ]
  },
  {
    "id": "kc_13_295",
    "lesson": 13,
    "word": "南アメリカ",
    "reading": "みなみアメリカ",
    "hanViet": "NAM",
    "meaning": "Khu vực Nam Mỹ",
    "rootKanji": [
      "南"
    ]
  },
  {
    "id": "kc_13_296",
    "lesson": 13,
    "word": "南国",
    "reading": "なんごく",
    "hanViet": "NAM QUỐC",
    "meaning": "Xứ nhiệt đới, miền nam",
    "rootKanji": [
      "南",
      "国"
    ]
  },
  {
    "id": "kc_13_297",
    "lesson": 13,
    "word": "北口",
    "reading": "きたぐち",
    "hanViet": "BẮC KHẨU",
    "meaning": "Cửa phía bắc (nhà ga)",
    "rootKanji": [
      "北",
      "口"
    ]
  },
  {
    "id": "kc_13_298",
    "lesson": 13,
    "word": "北海道",
    "reading": "ほっかいどう",
    "hanViet": "BẮC HẢI ĐẠO",
    "meaning": "Đảo Hokkaido (Bắc Hải Đạo)",
    "rootKanji": [
      "北",
      "海",
      "道"
    ]
  },
  {
    "id": "kc_13_299",
    "lesson": 13,
    "word": "北",
    "reading": "きた",
    "hanViet": "BẮC",
    "meaning": "Phía bắc",
    "rootKanji": [
      "北"
    ]
  },
  {
    "id": "kc_13_300",
    "lesson": 13,
    "word": "東北地方",
    "reading": "とうほくちほう",
    "hanViet": "ĐÔNG BẮC ĐỊA PHƯƠNG",
    "meaning": "Vùng Tohoku (Đông Bắc Nhật Bản)",
    "rootKanji": [
      "東",
      "北",
      "地",
      "方"
    ]
  },
  {
    "id": "kc_13_301",
    "lesson": 13,
    "word": "南",
    "reading": "みなみ",
    "hanViet": "NAM",
    "meaning": "Phía nam",
    "rootKanji": [
      "南"
    ]
  },
  {
    "id": "kc_13_302",
    "lesson": 13,
    "word": "南口",
    "reading": "みなみぐち",
    "hanViet": "NAM KHẨU",
    "meaning": "Cửa phía nam (nhà ga)",
    "rootKanji": [
      "南",
      "口"
    ]
  },
  {
    "id": "kc_14_303",
    "lesson": 14,
    "word": "時",
    "reading": "とき",
    "hanViet": "THỜI",
    "meaning": "Khi, lúc, thời điểm",
    "rootKanji": [
      "時"
    ]
  },
  {
    "id": "kc_14_304",
    "lesson": 14,
    "word": "金なり",
    "reading": "かねなり",
    "hanViet": "KIM",
    "meaning": "Là vàng (thời gian là vàng)",
    "rootKanji": [
      "金"
    ]
  },
  {
    "id": "kc_14_305",
    "lesson": 14,
    "word": "時間",
    "reading": "じかん",
    "hanViet": "THỜI GIAN",
    "meaning": "Thời gian, tiếng đồng hồ",
    "rootKanji": [
      "時",
      "間"
    ]
  },
  {
    "id": "kc_14_306",
    "lesson": 14,
    "word": "間",
    "reading": "あいだ",
    "hanViet": "GIAN",
    "meaning": "Khoảng cách, ở giữa",
    "rootKanji": [
      "間"
    ]
  },
  {
    "id": "kc_14_307",
    "lesson": 14,
    "word": "昼間",
    "reading": "ひるま",
    "hanViet": "TRÚ GIAN",
    "meaning": "Ban ngày",
    "rootKanji": [
      "昼",
      "間"
    ]
  },
  {
    "id": "kc_14_308",
    "lesson": 14,
    "word": "五時半",
    "reading": "ごじはん",
    "hanViet": "NGŨ THỜI BÁN",
    "meaning": "5 giờ rưỡi (5:30)",
    "rootKanji": [
      "五",
      "時",
      "半"
    ]
  },
  {
    "id": "kc_14_309",
    "lesson": 14,
    "word": "半年前",
    "reading": "はんとしまえ",
    "hanViet": "BÁN NIÊN TIỀN",
    "meaning": "Nửa năm trước",
    "rootKanji": [
      "半",
      "年",
      "前"
    ]
  },
  {
    "id": "kc_14_310",
    "lesson": 14,
    "word": "分けます",
    "reading": "わけます",
    "hanViet": "PHÂN",
    "meaning": "Chia ra, phân chia",
    "rootKanji": [
      "分"
    ]
  },
  {
    "id": "kc_14_311",
    "lesson": 14,
    "word": "半分",
    "reading": "はんぶん",
    "hanViet": "BÁN PHÂN",
    "meaning": "Một nửa (50%)",
    "rootKanji": [
      "半",
      "分"
    ]
  },
  {
    "id": "kc_14_312",
    "lesson": 14,
    "word": "四分の一",
    "reading": "よんぶんのいち",
    "hanViet": "TỨ PHÂN NHẤT",
    "meaning": "Một phần tư (1/4)",
    "rootKanji": [
      "四",
      "分",
      "一"
    ]
  },
  {
    "id": "kc_14_313",
    "lesson": 14,
    "word": "今",
    "reading": "いま",
    "hanViet": "KIM",
    "meaning": "Bây giờ, hiện tại",
    "rootKanji": [
      "今"
    ]
  },
  {
    "id": "kc_14_314",
    "lesson": 14,
    "word": "今月",
    "reading": "こんげつ",
    "hanViet": "KIM NGUYỆT",
    "meaning": "Tháng này",
    "rootKanji": [
      "今",
      "月"
    ]
  },
  {
    "id": "kc_14_315",
    "lesson": 14,
    "word": "雨の日",
    "reading": "あめのひ",
    "hanViet": "VŨ NHẬT",
    "meaning": "Ngày mưa",
    "rootKanji": [
      "雨",
      "日"
    ]
  },
  {
    "id": "kc_14_316",
    "lesson": 14,
    "word": "何",
    "reading": "なん",
    "hanViet": "HÀ",
    "meaning": "Cái gì, gì",
    "rootKanji": [
      "何"
    ]
  },
  {
    "id": "kc_14_317",
    "lesson": 14,
    "word": "何時",
    "reading": "なんじ",
    "hanViet": "HÀ THỜI",
    "meaning": "Mấy giờ",
    "rootKanji": [
      "何",
      "時"
    ]
  },
  {
    "id": "kc_14_318",
    "lesson": 14,
    "word": "何か",
    "reading": "なにか",
    "hanViet": "HÀ",
    "meaning": "Cái gì đó",
    "rootKanji": [
      "何"
    ]
  },
  {
    "id": "kc_14_319",
    "lesson": 14,
    "word": "夕日",
    "reading": "ゆうひ",
    "hanViet": "TỊCH NHẬT",
    "meaning": "Hoàng hôn, mặt trời chiều",
    "rootKanji": [
      "夕",
      "日"
    ]
  },
  {
    "id": "kc_14_320",
    "lesson": 14,
    "word": "夕方",
    "reading": "ゆうがた",
    "hanViet": "TỊCH PHƯƠNG",
    "meaning": "Chiều tối, lúc sẩm tối",
    "rootKanji": [
      "夕",
      "方"
    ]
  },
  {
    "id": "kc_14_321",
    "lesson": 14,
    "word": "夕食",
    "reading": "ゆうしょく",
    "hanViet": "TỊCH THỰC",
    "meaning": "Bữa cơm tối",
    "rootKanji": [
      "夕",
      "食"
    ]
  },
  {
    "id": "kc_14_322",
    "lesson": 14,
    "word": "読み方",
    "reading": "よみかた",
    "hanViet": "ĐỘC PHƯƠNG",
    "meaning": "Cách đọc",
    "rootKanji": [
      "読",
      "方"
    ]
  },
  {
    "id": "kc_14_323",
    "lesson": 14,
    "word": "方法",
    "reading": "ほうほう",
    "hanViet": "PHƯƠNG PHÁP",
    "meaning": "Phương pháp, cách thức",
    "rootKanji": [
      "方",
      "法"
    ]
  },
  {
    "id": "kc_15_324",
    "lesson": 15,
    "word": "新年",
    "reading": "しんねん",
    "hanViet": "TÂN NIÊN",
    "meaning": "Năm mới",
    "rootKanji": [
      "新",
      "年"
    ]
  },
  {
    "id": "kc_15_325",
    "lesson": 15,
    "word": "新聞",
    "reading": "しんぶん",
    "hanViet": "TÂN VĂN",
    "meaning": "Tờ báo, báo chí",
    "rootKanji": [
      "新",
      "聞"
    ]
  },
  {
    "id": "kc_15_326",
    "lesson": 15,
    "word": "新しい",
    "reading": "あたらしい",
    "hanViet": "TÂN",
    "meaning": "Mới",
    "rootKanji": [
      "新"
    ]
  },
  {
    "id": "kc_15_327",
    "lesson": 15,
    "word": "中古車",
    "reading": "ちゅうこしゃ",
    "hanViet": "TRUNG CỔ XA",
    "meaning": "Xe ô tô cũ đã qua sử dụng",
    "rootKanji": [
      "中",
      "古",
      "車"
    ]
  },
  {
    "id": "kc_15_328",
    "lesson": 15,
    "word": "古い",
    "reading": "ふるい",
    "hanViet": "CỔ",
    "meaning": "Cũ, cổ xưa",
    "rootKanji": [
      "古"
    ]
  },
  {
    "id": "kc_15_329",
    "lesson": 15,
    "word": "長い",
    "reading": "ながい",
    "hanViet": "TRƯỜNG",
    "meaning": "Dài",
    "rootKanji": [
      "長"
    ]
  },
  {
    "id": "kc_15_330",
    "lesson": 15,
    "word": "長男",
    "reading": "ちょうなん",
    "hanViet": "TRƯỜNG NAM",
    "meaning": "Con trai trưởng",
    "rootKanji": [
      "長",
      "男"
    ]
  },
  {
    "id": "kc_15_331",
    "lesson": 15,
    "word": "長女",
    "reading": "ちょうじょ",
    "hanViet": "TRƯỜNG NỮ",
    "meaning": "Con gái trưởng",
    "rootKanji": [
      "長",
      "女"
    ]
  },
  {
    "id": "kc_15_332",
    "lesson": 15,
    "word": "安い",
    "reading": "やすい",
    "hanViet": "AN",
    "meaning": "Rẻ",
    "rootKanji": [
      "安"
    ]
  },
  {
    "id": "kc_15_333",
    "lesson": 15,
    "word": "安心",
    "reading": "あんしん",
    "hanViet": "AN TÂM",
    "meaning": "An tâm, yên tâm",
    "rootKanji": [
      "安",
      "心"
    ]
  },
  {
    "id": "kc_15_334",
    "lesson": 15,
    "word": "多い",
    "reading": "おおい",
    "hanViet": "ĐA",
    "meaning": "Nhiều",
    "rootKanji": [
      "多"
    ]
  },
  {
    "id": "kc_15_335",
    "lesson": 15,
    "word": "多少",
    "reading": "たしょう",
    "hanViet": "ĐA THIỂU",
    "meaning": "Ít nhiều, phần nào",
    "rootKanji": [
      "多",
      "少"
    ]
  },
  {
    "id": "kc_15_336",
    "lesson": 15,
    "word": "多数",
    "reading": "たすう",
    "hanViet": "ĐA SỐ",
    "meaning": "Đa số, số lượng nhiều",
    "rootKanji": [
      "多",
      "数"
    ]
  },
  {
    "id": "kc_15_337",
    "lesson": 15,
    "word": "少ない",
    "reading": "すくない",
    "hanViet": "THIỂU",
    "meaning": "Ít",
    "rootKanji": [
      "少"
    ]
  },
  {
    "id": "kc_15_338",
    "lesson": 15,
    "word": "少し",
    "reading": "すこし",
    "hanViet": "THIỂU",
    "meaning": "Một chút, một ít",
    "rootKanji": [
      "少"
    ]
  },
  {
    "id": "kc_15_339",
    "lesson": 15,
    "word": "お元気",
    "reading": "おげんき",
    "hanViet": "NGUYÊN KHÍ",
    "meaning": "Khỏe mạnh (lời hỏi thăm)",
    "rootKanji": [
      "元",
      "気"
    ]
  },
  {
    "id": "kc_15_340",
    "lesson": 15,
    "word": "一月一日",
    "reading": "いちがつついたち",
    "hanViet": "NHẤT NGUYỆT NHẤT NHẬT",
    "meaning": "Ngày mùng 1 tháng 1",
    "rootKanji": [
      "一",
      "月",
      "日"
    ]
  },
  {
    "id": "kc_15_341",
    "lesson": 15,
    "word": "元日",
    "reading": "がんじつ",
    "hanViet": "NGUYÊN NHẬT",
    "meaning": "Ngày đầu năm mới (Mùng 1 Tết)",
    "rootKanji": [
      "元",
      "日"
    ]
  },
  {
    "id": "kc_15_342",
    "lesson": 15,
    "word": "大田さん",
    "reading": "おおたさん",
    "hanViet": "ĐẠI ĐIỀN",
    "meaning": "Ông/Bà Oota",
    "rootKanji": [
      "大",
      "田"
    ]
  },
  {
    "id": "kc_15_343",
    "lesson": 15,
    "word": "元",
    "reading": "もと",
    "hanViet": "NGUYÊN",
    "meaning": "Gốc, cội nguồn, nguyên khí",
    "rootKanji": [
      "元"
    ]
  },
  {
    "id": "kc_15_344",
    "lesson": 15,
    "word": "今日",
    "reading": "きょう",
    "hanViet": "KIM NHẬT",
    "meaning": "Hôm nay",
    "rootKanji": [
      "今",
      "日"
    ]
  },
  {
    "id": "kc_15_345",
    "lesson": 15,
    "word": "天気",
    "reading": "てんき",
    "hanViet": "THIÊN KHÍ",
    "meaning": "Thời tiết",
    "rootKanji": [
      "天",
      "気"
    ]
  },
  {
    "id": "kc_15_346",
    "lesson": 15,
    "word": "気分",
    "reading": "きぶん",
    "hanViet": "KHÍ PHÂN",
    "meaning": "Tâm trạng, cảm giác cơ thể",
    "rootKanji": [
      "気",
      "分"
    ]
  }
];

export function getCompoundsByLesson(lesson: number): KanjiCompound[] {
  return KANJI_COMPOUNDS.filter(c => c.lesson === lesson);
}

export function getAllCompounds(): KanjiCompound[] {
  return KANJI_COMPOUNDS;
}

export function getCompoundsByKanji(kanjiChar: string): KanjiCompound[] {
  return KANJI_COMPOUNDS.filter(c => c.rootKanji.includes(kanjiChar));
}
