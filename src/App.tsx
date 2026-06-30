import { useState, useMemo, useRef, useEffect } from 'react'

interface Example {
  word: string
  romaji: string
  meaning: string
}

interface Character {
  id: string
  char: string
  romaji: string
  strokeSteps: string[]
  strokeMarkers: { x: number; y: number }[]
  examples: Example[]
}

interface QuizQuestion {
  question: string
  word: string
  options: string[]
  answer: string
}

// DATABASE LENGKAP 46 HIRAGANA DENGAN TATA URUTAN PENULISAN, TITIK PENANDA & 4 CONTOH KOSA KATA
const HIRAGANA_DATA: Character[] = [
  { 
    id: 'h1', 
    char: 'あ', 
    romaji: 'a', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar dari kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal melengkung menembus garis pertama.',
      'Goresan 3: Tarik garis melingkar searah jarum jam dari tengah ke kanan bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 40 }, { x: 50, y: 22 }, { x: 44, y: 52 }],
    examples: [
      { word: 'あさ (Asa)', romaji: 'Asa', meaning: 'Pagi' },
      { word: 'あめ (Ame)', romaji: 'Ame', meaning: 'Hujan / Permen' },
      { word: 'あおい (Aoi)', romaji: 'Aoi', meaning: 'Biru' },
      { word: 'ありがとう (Arigatou)', romaji: 'Arigatou', meaning: 'Terima Kasih' },
      { word: 'あい (Ai)', romaji: 'Ai', meaning: 'Cinta' },
      { word: 'あka (Aka)', romaji: 'Aka', meaning: 'Merah' },
      { word: 'あさごはん (Asagohan)', romaji: 'Asagohan', meaning: 'Sarapan' }
    ] 
  },
  { 
    id: 'h2', 
    char: 'い', 
    romaji: 'i', 
    strokeSteps: [
      'Goresan 1: Tarik garis kiri melengkung ke bawah dengan kail di ujungnya.',
      'Goresan 2: Tarik garis kanan lebih pendek and melengkung ke bawah.'
    ],
    strokeMarkers: [{ x: 32, y: 28 }, { x: 68, y: 38 }],
    examples: [
      { word: 'いぬ (Inu)', romaji: 'Inu', meaning: 'Anjing' },
      { word: 'いえ (Ie)', romaji: 'Ie', meaning: 'Rumah' },
      { word: 'いち (Ichi)', romaji: 'Ichi', meaning: 'Satu' },
      { word: 'いす (Isu)', romaji: 'Isu', meaning: 'Kursi' },
      { word: 'いけ (Ike)', romaji: 'Ike', meaning: 'Kolam' },
      { word: 'いちご (Ichigo)', romaji: 'Ichigo', meaning: 'Stroberi' },
      { word: 'いと (Ito)', romaji: 'Ito', meaning: 'Benang' }
    ] 
  },
  { 
    id: 'h3', 
    char: 'う', 
    romaji: 'u', 
    strokeSteps: [
      'Goresan 1: Coretan miring pendek di bagian atas.',
      'Goresan 2: Tarik garis melengkung besar menyerupai C terbalik di bawahnya.'
    ],
    strokeMarkers: [{ x: 50, y: 24 }, { x: 38, y: 48 }],
    examples: [
      { word: 'うみ (Umi)', romaji: 'Umi', meaning: 'Laut' },
      { word: 'うた (Uta)', romaji: 'Uta', meaning: 'Lagu' },
      { word: 'うち (Uchi)', romaji: 'Uchi', meaning: 'Rumah / Dalam' },
      { word: 'うま (Uma)', romaji: 'Uma', meaning: 'Kuda' },
      { word: 'うさぎ (Usagi)', romaji: 'Usagi', meaning: 'Kelinci' },
      { word: 'うしろ (Ushiro)', romaji: 'Ushiro', meaning: 'Belakang' },
      { word: 'うどん (Udon)', romaji: 'Udon', meaning: 'Mie Udon' }
    ] 
  },
  { 
    id: 'h4', 
    char: 'え', 
    romaji: 'e', 
    strokeSteps: [
      'Goresan 1: Coretan miring pendek di bagian atas.',
      'Goresan 2: Tarik garis zig-zag mendatar lalu turun melengkung membentuk Z.'
    ],
    strokeMarkers: [{ x: 50, y: 24 }, { x: 38, y: 46 }],
    examples: [
      { word: 'えき (Eki)', romaji: 'Eki', meaning: 'Stasiun' },
      { word: 'えんぴつ (Enpitsu)', romaji: 'Enpitsu', meaning: 'Pensil' },
      { word: 'えほん (Ehon)', romaji: 'Ehon', meaning: 'Buku Bergambar' },
      { word: 'え (E)', romaji: 'E', meaning: 'Gambar / Lukisan' },
      { word: 'えだ (Eda)', romaji: 'Eda', meaning: 'Ranting' },
      { word: 'えがお (Egao)', romaji: 'Egao', meaning: 'Senyuman' },
      { word: 'えいが (Eiga)', romaji: 'Eiga', meaning: 'Film' }
    ] 
  },
  { 
    id: 'h5', 
    char: 'お', 
    romaji: 'o', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal memotong lalu melingkar besar ke kanan atas.',
      'Goresan 3: Coretan titik miring di kanan atas.'
    ],
    strokeMarkers: [{ x: 28, y: 40 }, { x: 48, y: 22 }, { x: 72, y: 34 }],
    examples: [
      { word: 'おちゃ (Ocha)', romaji: 'Ocha', meaning: 'Teh Hijau' },
      { word: 'おかね (Okane)', romaji: 'Okane', meaning: 'Uang' },
      { word: 'おいしい (Oishii)', romaji: 'Oishii', meaning: 'Enak / Lezat' },
      { word: 'おとconoko (Otokonoko)', romaji: 'Otokonoko', meaning: 'Anak Laki-laki' },
      { word: 'おにぎり (Onigiri)', romaji: 'Onigiri', meaning: 'Nasi Kepal' },
      { word: 'おもちゃ (Omocha)', romaji: 'Omocha', meaning: 'Mainan' },
      { word: 'おんがく (Ongaku)', romaji: 'Ongaku', meaning: 'Musik' }
    ] 
  },
  { 
    id: 'h6', 
    char: 'か', 
    romaji: 'ka', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal lalu menekuk melengkung dengan kail.',
      'Goresan 2: Tarik garis vertikal miring memotong goresan pertama.',
      'Goresan 3: Coretan titik miring di kanan luar.'
    ],
    strokeMarkers: [{ x: 30, y: 42 }, { x: 48, y: 24 }, { x: 74, y: 38 }],
    examples: [
      { word: 'かさ (Kasa)', romaji: 'Kasa', meaning: 'Payung' },
      { word: 'かばん (Kaban)', romaji: 'Kaban', meaning: 'Tas' },
      { word: 'かじ (Kaji)', romaji: 'Kaji', meaning: 'Kebakaran' },
      { word: 'かめ (Kame)', romaji: 'Kame', meaning: 'Kura-kura' },
      { word: 'かぎ (Kagi)', romaji: 'Kagi', meaning: 'Kunci' },
      { word: 'かべ (Kabe)', romaji: 'Kabe', meaning: 'Dinding' },
      { word: 'からい (Karai)', romaji: 'Karai', meaning: 'Pedas' }
    ] 
  },
  { 
    id: 'h7', 
    char: 'き', 
    romaji: 'ki', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar bagian atas.',
      'Goresan 2: Tarik garis horizontal mendatar sejajar di bawahnya.',
      'Goresan 3: Tarik garis vertikal memotong melengkung ke kanan.',
      'Goresan 4: Coretan melengkung mendatar terpisah di bawah.'
    ],
    strokeMarkers: [{ x: 32, y: 34 }, { x: 30, y: 48 }, { x: 50, y: 22 }, { x: 38, y: 78 }],
    examples: [
      { word: 'きっぷ (Kippu)', romaji: 'Kippu', meaning: 'Tiket' },
      { word: 'きのう (Kinou)', romaji: 'Kinou', meaning: 'Kemarin' },
      { word: 'きつね (Kitsune)', romaji: 'Kitsune', meaning: 'Rubah' },
      { word: 'きもの (Kimono)', romaji: 'Kimono', meaning: 'Baju Kimono' },
      { word: 'きいろ (Kiiro)', romaji: 'Kiiro', meaning: 'Kuning' },
      { word: 'き (Ki)', romaji: 'Ki', meaning: 'Pohon' },
      { word: 'きょう (Kyou)', romaji: 'Kyou', meaning: 'Hari Ini' }
    ] 
  },
  { 
    id: 'h8', 
    char: 'く', 
    romaji: 'ku', 
    strokeSteps: [
      'Goresan 1: Tarik garis membentuk sudut lancip menghadap ke kiri (<).'
    ],
    strokeMarkers: [{ x: 62, y: 32 }],
    examples: [
      { word: 'くるま (Kuruma)', romaji: 'Kuruma', meaning: 'Mobil' },
      { word: 'くつ (Kutsu)', romaji: 'Kutsu', meaning: 'Sepatu' },
      { word: 'くだもの (Kudamono)', romaji: 'Kudamono', meaning: 'Buah' },
      { word: 'くも (Kumo)', romaji: 'Kumo', meaning: 'Awan / Laba-laba' },
      { word: 'くち (Kuchi)', romaji: 'Kuchi', meaning: 'Mulut' },
      { word: 'くび (Kubi)', romaji: 'Kubi', meaning: 'Leher' },
      { word: 'くろい (Kuroi)', romaji: 'Kuroi', meaning: 'Hitam' }
    ] 
  },
  { 
    id: 'h9', 
    char: 'け', 
    romaji: 'ke', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal melengkung di sebelah kiri dengan kail.',
      'Goresan 2: Tarik garis horizontal pendek di kanan atas.',
      'Goresan 3: Tarik garis vertikal memotong garis kedua memanjang ke kiri bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 25 }, { x: 50, y: 40 }, { x: 62, y: 22 }],
    examples: [
      { word: 'けいたい (Keitai)', romaji: 'Keitai', meaning: 'HP' },
      { word: 'けしごむ (Keshigomu)', romaji: 'Keshigomu', meaning: 'Penghapus' },
      { word: 'けむり (Kemuri)', romaji: 'Kemuri', meaning: 'Asap' },
      { word: 'keenka (Kenka)', romaji: 'Kenka', meaning: 'Pertengkaran' },
      { word: 'けいさつ (Keisatsu)', romaji: 'Keisatsu', meaning: 'Polisi' },
      { word: 'けさ (Kesa)', romaji: 'Kesa', meaning: 'Pagi ini' },
      { word: 'けっこん (Kekkon)', romaji: 'Kekkon', meaning: 'Pernikahan' }
    ] 
  },
  { 
    id: 'h10', 
    char: 'こ', 
    romaji: 'ko', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal melengkung di atas dengan kail kanan.',
      'Goresan 2: Tarik garis melengkung sejajar di bagian bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 38 }, { x: 32, y: 68 }],
    examples: [
      { word: 'こえ (Koe)', romaji: 'Koe', meaning: 'Suara' },
      { word: 'こども (Kodomo)', romaji: 'Kodomo', meaning: 'Anak-anak' },
      { word: 'koうえん (Kouen)', romaji: 'Kouen', meaning: 'Taman' },
      { word: 'こめ (Kome)', romaji: 'Kome', meaning: 'Beras' },
      { word: 'ここ (Koko)', romaji: 'Koko', meaning: 'Di Sini' },
      { word: 'こころ (Kokoro)', romaji: 'Kokoro', meaning: 'Hati' },
      { word: 'こうてい (Koutei)', romaji: 'Koutei', meaning: 'Halaman sekolah' }
    ] 
  },
  { 
    id: 'h11', 
    char: 'さ', 
    romaji: 'sa', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal miring memotong lalu melengkung ke kanan.',
      'Goresan 3: Coretan melengkung terpisah di bagian bawah.'
    ],
    strokeMarkers: [{ x: 28, y: 38 }, { x: 50, y: 22 }, { x: 38, y: 76 }],
    examples: [
      { word: 'さかな (Sakana)', romaji: 'Sakana', meaning: 'Ikan' },
      { word: 'さくら (Sakura)', romaji: 'Sakura', meaning: 'Sakura' },
      { word: 'さいふ (Saifu)', romaji: 'Saifu', meaning: 'Dompet' },
      { word: 'さる (Saru)', romaji: 'Saru', meaning: 'Monyet' },
      { word: 'さとう (Satou)', romaji: 'Satou', meaning: 'Gula' },
      { word: 'さいご (Saigo)', romaji: 'Saigo', meaning: 'Terakhir' },
      { word: 'さむい (Samui)', romaji: 'Samui', meaning: 'Dingin' }
    ] 
  },
  { 
    id: 'h12', 
    char: 'し', 
    romaji: 'shi', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal lurus ke bawah lalu melengkung ke kanan atas.'
    ],
    strokeMarkers: [{ x: 48, y: 22 }],
    examples: [
      { word: 'しお (Shio)', romaji: 'Shio', meaning: 'Garam' },
      { word: 'しんぶん (Shinbun)', romaji: 'Shinbun', meaning: 'Koran' },
      { word: 'しあわせ (Shiawase)', romaji: 'Shiawase', meaning: 'Bahagia' },
      { word: 'しか (Shika)', romaji: 'Shika', meaning: 'Rusa' },
      { word: 'しろい (Shiroi)', romaji: 'Shiroi', meaning: 'Putih' },
      { word: 'しぬ (Shinu)', romaji: 'Shinu', meaning: 'Meninggal' },
      { word: 'しごと (Shigoto)', romaji: 'Shigoto', meaning: 'Pekerjaan' }
    ] 
  },
  { 
    id: 'h13', 
    char: 'す', 
    romaji: 'su', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal memotong, melingkar di tengah, menjuntai ke bawah.'
    ],
    strokeMarkers: [{ x: 26, y: 35 }, { x: 52, y: 20 }],
    examples: [
      { word: 'すし (Sushi)', romaji: 'Sushi', meaning: 'Sushi' },
      { word: 'すいか (Suika)', romaji: 'Suika', meaning: 'Semangka' },
      { word: 'すずしい (Suzushii)', romaji: 'Suzushii', meaning: 'Sejuk' },
      { word: 'すず (Suzu)', romaji: 'Suzu', meaning: 'Lonceng' },
      { word: 'すき (Suki)', romaji: 'Suki', meaning: 'Suka' },
      { word: 'すこし (Sukoshi)', romaji: 'Sukoshi', meaning: 'Sedikit' },
      { word: 'すな (Suna)', romaji: 'Suna', meaning: 'Pasir' }
    ] 
  },
  { 
    id: 'h14', 
    char: 'せ', 
    romaji: 'se', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar panjang.',
      'Goresan 2: Tarik garis vertikal kanan pendek dengan sudut menekuk.',
      'Goresan 3: Tarik garis vertikal kiri panjang membelok mendatar ke kanan.'
    ],
    strokeMarkers: [{ x: 24, y: 44 }, { x: 68, y: 24 }, { x: 46, y: 22 }],
    examples: [
      { word: 'せんせい (Sensei)', romaji: 'Sensei', meaning: 'Guru' },
      { word: 'せんぷうき (Senpuuki)', romaji: 'Senpuuki', meaning: 'Kipas Angin' },
      { word: 'せかい (Sekai)', romaji: 'Sekai', meaning: 'Dunia' },
      { word: 'せなか (Senaka)', romaji: 'Senaka', meaning: 'Punggung' },
      { word: 'せいto (Seito)', romaji: 'Seito', meaning: 'Murid' },
      { word: 'せんたく (Sentaku)', romaji: 'Sentaku', meaning: 'Cucian' },
      { word: 'せっけん (Sekken)', romaji: 'Sekken', meaning: 'Sabun Mandi' }
    ] 
  },
  { 
    id: 'h15', 
    char: 'そ', 
    romaji: 'so', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal-diagonal zig-zag tajam lalu melengkung bawah.'
    ],
    strokeMarkers: [{ x: 28, y: 24 }],
    examples: [
      { word: 'そら (Sora)', romaji: 'Sora', meaning: 'Langit' },
      { word: 'そうじ (Souji)', romaji: 'Souji', meaning: 'Bersih-bersih' },
      { word: 'そと (Soto)', romaji: 'Soto', meaning: 'Luar' },
      { word: 'そば (Soba)', romaji: 'Soba', meaning: 'Mie Soba' },
      { word: 'そふ (Sofu)', romaji: 'Sofu', meaning: 'Kakek' },
      { word: 'そぼ (Sobo)', romaji: 'Sobo', meaning: 'Nenek' },
      { word: 'そつぎょう (Sotsugyou)', romaji: 'Sotsugyou', meaning: 'Kelulusan' }
    ] 
  },
  { 
    id: 'h16', 
    char: 'た', 
    romaji: 'ta', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal miring memotong goresan pertama.',
      'Goresan 3: Tarik garis melengkung atas di sebelah kanan.',
      'Goresan 4: Tarik garis melengkung bawah sejajar di sebelah kanan.'
    ],
    strokeMarkers: [{ x: 24, y: 42 }, { x: 42, y: 22 }, { x: 60, y: 38 }, { x: 60, y: 64 }],
    examples: [
      { word: 'たまご (Tamago)', romaji: 'Tamago', meaning: 'Telur' },
      { word: 'たべもの (Tabemono)', romaji: 'Tabemono', meaning: 'Makanan' },
      { word: 'たいよう (Taiyou)', romaji: 'Taiyou', meaning: 'Matahari' },
      { word: 'たかい (Takai)', romaji: 'Takai', meaning: 'Tinggi / Mahal' },
      { word: 'たのしい (Tanoshii)', romaji: 'Tanoshii', meaning: 'Menyenangkan' },
      { word: 'たび (Tabi)', romaji: 'Tabi', meaning: 'Perjalanan' },
      { word: 'たてもの (Tatemono)', romaji: 'Tatemono', meaning: 'Bangunan' }
    ] 
  },
  { 
    id: 'h17', 
    char: 'ち', 
    romaji: 'chi', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal pendek dari kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal memotong dilanjutkan melengkung membulat di bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 34 }, { x: 50, y: 20 }],
    examples: [
      { word: 'ちず (Chizu)', romaji: 'Chizu', meaning: 'Peta' },
      { word: 'ちかてつ (Chikatetsu)', romaji: 'Chikatetsu', meaning: 'Subway' },
      { word: 'ちち (Chichi)', romaji: 'Chichi', meaning: 'Ayah' },
      { word: 'ちいさい (Chiisai)', romaji: 'Chiisai', meaning: 'Kecil' },
      { word: 'ちかい (Chikai)', romaji: 'Chikai', meaning: 'Dekat' },
      { word: 'ちゅうごく (Chuugoku)', romaji: 'Chuugoku', meaning: 'China' },
      { word: 'ち (Chi)', romaji: 'Chi', meaning: 'Darah' }
    ] 
  },
  { 
    id: 'h18', 
    char: 'つ', 
    romaji: 'tsu', 
    strokeSteps: [
      'Goresan 1: Tarik garis melengkung horizontal atas membulat besar ke kanan bawah.'
    ],
    strokeMarkers: [{ x: 26, y: 38 }],
    examples: [
      { word: 'つくえ (Tsukue)', romaji: 'Tsukue', meaning: 'Meja' },
      { word: 'つばさ (Tsubasa)', romaji: 'Tsubasa', meaning: 'Sayap' },
      { word: 'つき (Tsuki)', romaji: 'Tsuki', meaning: 'Bulan' },
      { word: 'つめたい (Tsumetai)', romaji: 'Tsumetai', meaning: 'Dingin' },
      { word: 'つち (Tsuchi)', romaji: 'Tsuchi', meaning: 'Tanah' },
      { word: 'つよい (Tsuyoi)', romaji: 'Tsuyoi', meaning: 'Kuat' },
      { word: 'つる (Tsuru)', romaji: 'Tsuru', meaning: 'Bangau' }
    ] 
  },
  { 
    id: 'h19', 
    char: 'て', 
    romaji: 'te', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal lalu berbalik melengkung besar ke kanan bawah.'
    ],
    strokeMarkers: [{ x: 28, y: 35 }],
    examples: [
      { word: 'てがみ (Tegami)', romaji: 'Tegami', meaning: 'Surat' },
      { word: 'てんき (Tenki)', romaji: 'Tenki', meaning: 'Cuaca' },
      { word: 'て (Te)', romaji: 'Te', meaning: 'Tangan' },
      { word: 'てんぷら (Tenpura)', romaji: 'Tenpura', meaning: 'Tempura' },
      { word: 'てら (Tera)', romaji: 'Tera', meaning: 'Kuil' },
      { word: 'てつどう (Tetsudou)', romaji: 'Tetsudou', meaning: 'Kereta Api' },
      { word: 'てんごく (Tengoku)', romaji: 'Tengoku', meaning: 'Surga' }
    ] 
  },
  { 
    id: 'h20', 
    char: 'と', 
    romaji: 'to', 
    strokeSteps: [
      'Goresan 1: Coretan miring kecil di sebelah kiri atas.',
      'Goresan 2: Tarik garis melengkung membulat besar dari tengah ke bawah.'
    ],
    strokeMarkers: [{ x: 35, y: 28 }, { x: 50, y: 42 }],
    examples: [
      { word: 'ともだち (Tomodachi)', romaji: 'Tomodachi', meaning: 'Teman' },
      { word: 'とけい (Tokei)', romaji: 'Tokei', meaning: 'Jam' },
      { word: 'とり (Tori)', romaji: 'Tori', meaning: 'Burung' },
      { word: 'とら (Tora)', romaji: 'Tora', meaning: 'Harimau' },
      { word: 'としょかん (Toshokan)', romaji: 'Toshokan', meaning: 'Perpustakaan' },
      { word: 'とても (Totemo)', romaji: 'Totemo', meaning: 'Sangat' },
      { word: 'とoi (Tooi)', romaji: 'Tooi', meaning: 'Jauh' }
    ] 
  },
  { 
    id: 'h21', 
    char: 'な', 
    romaji: 'na', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar kiri ke kanan.',
      'Goresan 2: Tarik garis vertikal miring memotong garis pertama.',
      'Goresan 3: Coretan miring kecil di kanan atas.',
      'Goresan 4: Tarik garis vertikal membentuk simpul melingkar di kanan bawah.'
    ],
    strokeMarkers: [{ x: 24, y: 40 }, { x: 42, y: 22 }, { x: 62, y: 30 }, { x: 52, y: 52 }],
    examples: [
      { word: 'なつ (Natsu)', romaji: 'Natsu', meaning: 'Musim Panas' },
      { word: 'なまえ (Namae)', romaji: 'Namae', meaning: 'Nama' },
      { word: 'なみ (Nami)', romaji: 'Nami', meaning: 'Ombak' },
      { word: 'なす (Nasu)', romaji: 'Nasu', meaning: 'Terong' },
      { word: 'ながい (Nagai)', romaji: 'Nagai', meaning: 'Panjang' },
      { word: 'なく (Naku)', romaji: 'Naku', meaning: 'Menangis' },
      { word: 'なつかしい (Natsukashii)', romaji: 'Natsukashii', meaning: 'Rindu' }
    ] 
  },
  { 
    id: 'h22', 
    char: 'に', 
    romaji: 'ni', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal melengkung di kiri dengan kail.',
      'Goresan 2: Tarik garis horizontal pendek di kanan atas.',
      'Goresan 3: Tarik garis horizontal sejajar di bawahnya.'
    ],
    strokeMarkers: [{ x: 30, y: 26 }, { x: 52, y: 42 }, { x: 50, y: 64 }],
    examples: [
      { word: 'にく (Niku)', romaji: 'Niku', meaning: 'Daging' },
      { word: 'にほんご (Nihongo)', romaji: 'Nihongo', meaning: 'Bahasa Jepang' },
      { word: 'にし (Nishi)', romaji: 'Nishi', meaning: 'Barat' },
      { word: 'にんじん (Ninjin)', romaji: 'Ninjin', meaning: 'Wortel' },
      { word: 'にちようび (Nichiyoubi)', romaji: 'Nichiyoubi', meaning: 'Hari Minggu' },
      { word: 'にんぎょう (Ningyou)', romaji: 'Ningyou', meaning: 'Boneka' },
      { word: 'にじ (Niji)', romaji: 'Niji', meaning: 'Pelangi' }
    ] 
  },
  { 
    id: 'h23', 
    char: 'ぬ', 
    romaji: 'nu', 
    strokeSteps: [
      'Goresan 1: Tarik garis miring memanjang ke kanan bawah.',
      'Goresan 2: Tarik garis miring kiri memotong garis pertama, disimpul di tengah, diakhiri lingkaran kecil di kanan bawah.'
    ],
    strokeMarkers: [{ x: 32, y: 28 }, { x: 52, y: 22 }],
    examples: [
      { word: 'ぬいぐるみ', romaji: 'Nuigurumi', meaning: 'Boneka' },
      { word: 'ぬるまゆ (Nurumayu)', romaji: 'Nurumayu', meaning: 'Air Hangat' },
      { word: 'ぬる (Nuru)', romaji: 'Nuru', meaning: 'Mengecat' },
      { word: 'ぬの (Nuno)', romaji: 'Nuno', meaning: 'Kain' },
      { word: 'ぬすむ (Nusumu)', romaji: 'Nusumu', meaning: 'Mencuri' },
      { word: 'ぬれる (Nureru)', romaji: 'Nureru', meaning: 'Basah' },
      { word: 'ぬま (Numa)', romaji: 'Numa', meaning: 'Rawa' }
    ] 
  },
  { 
    id: 'h24', 
    char: 'ね', 
    romaji: 'ne', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal lurus ke bawah.',
      'Goresan 2: Tarik garis zig-zag tajam memotong garis pertama dan diakhiri simpul melingkar di kanan bawah.'
    ],
    strokeMarkers: [{ x: 32, y: 22 }, { x: 44, y: 28 }],
    examples: [
      { word: 'ねこ (Neko)', romaji: 'Neko', meaning: 'Kucing' },
      { word: 'ねつ (Netsu)', romaji: 'Netsu', meaning: 'Demam' },
      { word: 'ねんど (Nendo)', romaji: 'Nendo', meaning: 'Tanah Liat' },
      { word: 'ねむい (Nemui)', romaji: 'Nemui', meaning: 'Mengantuk' },
      { word: 'ねだん (Nedan)', romaji: 'Nedan', meaning: 'Harga' },
      { word: 'ねがい (Negai)', romaji: 'Negai', meaning: 'Harapan' },
      { word: 'ねずみ (Nezumi)', romaji: 'Nezumi', meaning: 'Tikus' }
    ] 
  },
  { 
    id: 'h25', 
    char: 'の', 
    romaji: 'no', 
    strokeSteps: [
      'Goresan 1: Tarik garis miring pendek lalu berputar melingkar lebar ke kanan.'
    ],
    strokeMarkers: [{ x: 46, y: 44 }],
    examples: [
      { word: 'ofの (Nomimono)', romaji: 'Nomimono', meaning: 'Minuman' },
      { word: 'のり (Nori)', romaji: 'Nori', meaning: 'Rumput Laut' },
      { word: 'のぼる (Noboru)', romaji: 'Noboru', meaning: 'Mendaki' },
      { word: 'のど (Nodo)', romaji: 'Nodo', meaning: 'Tenggorokan' },
      { word: 'のりもの (Norimono)', romaji: 'Norimono', meaning: 'Kendaraan' },
      { word: 'のうか (Nouka)', romaji: 'Nouka', meaning: 'Petani' },
      { word: 'のこぎり (Nokogiri)', romaji: 'Nokogiri', meaning: 'Gergaji' }
    ] 
  },
  { 
    id: 'h26', 
    char: 'は', 
    romaji: 'ha', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal melengkung di kiri dengan kail.',
      'Goresan 2: Tarik garis horizontal mendatar memotong di kanan atas.',
      'Goresan 3: Tarik garis vertikal lurus memotong garis kedua lalu disimpul bulat.'
    ],
    strokeMarkers: [{ x: 30, y: 25 }, { x: 50, y: 42 }, { x: 60, y: 22 }],
    examples: [
      { word: 'はな (Hana)', romaji: 'Hana', meaning: 'Bunga / Hidung' },
      { word: 'はし (Hashi)', romaji: 'Hashi', meaning: 'Sumpit' },
      { word: 'はい (Hai)', romaji: 'Hai', meaning: 'Ya' },
      { word: 'はこ (Hako)', romaji: 'Hako', meaning: 'Kotak' },
      { word: 'は (Ha)', romaji: 'Ha', meaning: 'Gigi' },
      { word: 'はいざら (Haizara)', romaji: 'Haizara', meaning: 'Asbak' },
      { word: 'はる (Haru)', romaji: 'Haru', meaning: 'Musim Semi' }
    ] 
  },
  { 
    id: 'h27', 
    char: 'ひ', 
    romaji: 'hi', 
    strokeSteps: [
      'Goresan 1: Tarik satu garis mendatar kecil, melengkung senyum membulat lebar, lalu meluncur ke kanan bawah.'
    ],
    strokeMarkers: [{ x: 28, y: 35 }],
    examples: [
      { word: 'ひkouki (Hikouki)', romaji: 'Hikouki', meaning: 'Pesawat' },
      { word: 'ひだり (Hidari)', romaji: 'Hidari', meaning: 'Kiri' },
      { word: 'ひつじ (Hitsuji)', romaji: 'Hitsuji', meaning: 'Domba' },
      { word: 'ひる (Hiru)', romaji: 'Hiru', meaning: 'Siang Hari' },
      { word: 'ひ (Hi)', romaji: 'Hi', meaning: 'Api' },
      { word: 'ひがし (Higashi)', romaji: 'Higashi', meaning: 'Timur' },
      { word: 'ひく (Hiku)', romaji: 'Hiku', meaning: 'Menarik' }
    ] 
  },
  { 
    id: 'h28', 
    char: 'ふ', 
    romaji: 'fu', 
    strokeSteps: [
      'Goresan 1: Coretan melengkung atas ke bawah di tengah.',
      'Goresan 2: Coretan melengkung panjang di sebelah kiri.',
      'Goresan 3: Coretan titik miring di kanan.',
      'Goresan 4: Coretan titik miring di bagian bawah.'
    ],
    strokeMarkers: [{ x: 52, y: 26 }, { x: 32, y: 52 }, { x: 68, y: 52 }, { x: 52, y: 78 }],
    examples: [
      { word: 'ふね (Fune)', romaji: 'Fune', meaning: 'Kapal Laut' },
      { word: 'ふじさん (Fujisan)', romaji: 'Fujisan', meaning: 'Gunung Fuji' },
      { word: 'ふゆ (Fuyu)', romaji: 'Fuyu', meaning: 'Musim Dingin' },
      { word: 'ふうせん (Fuusen)', romaji: 'Fuusen', meaning: 'Balon' },
      { word: 'ふく (Fuku)', romaji: 'Fuku', meaning: 'Baju' },
      { word: 'ふとい (Futoi)', romaji: 'Futoi', meaning: 'Tebal' },
      { word: 'ふるい (Furui)', romaji: 'Furui', meaning: 'Tua' }
    ] 
  },
  { 
    id: 'h29', 
    char: 'へ', 
    romaji: 'he', 
    strokeSteps: [
      'Goresan 1: Tarik satu garis menanjak lalu menurun memanjang ke kanan bawah.'
    ],
    strokeMarkers: [{ x: 26, y: 56 }],
    examples: [
      { word: 'へや (Heya)', romaji: 'Heya', meaning: 'Kamar' },
      { word: 'へび (Hebi)', romaji: 'Hebi', meaning: 'Ular' },
      { word: 'へん (Hen)', romaji: 'Hen', meaning: 'Aneh' },
      { word: 'へいせい (Heisei)', romaji: 'Heisei', meaning: 'Zaman Heisei' },
      { word: 'へいわ (Heiwa)', romaji: 'Heiwa', meaning: 'Damai' },
      { word: 'へた (Heta)', romaji: 'Heta', meaning: 'Tidak pandai' },
      { word: 'へる (Heru)', romaji: 'Heru', meaning: 'Berkurang' }
    ] 
  },
  { 
    id: 'h30', 
    char: 'ほ', 
    romaji: 'ho', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal melengkung di kiri dengan kail.',
      'Goresan 2: Tarik garis horizontal atas di kanan.',
      'Goresan 3: Tarik garis horizontal bawah sejajar.',
      'Goresan 4: Tarik garis vertikal menusuk memotong garis kedua lalu disimpul di bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 25 }, { x: 50, y: 38 }, { x: 48, y: 54 }, { x: 60, y: 22 }],
    examples: [
      { word: 'ほん (Hon)', romaji: 'Hon', meaning: 'Buku' },
      { word: 'ほし (Hoshi)', romaji: 'Hoshi', meaning: 'Bintang' },
      { word: 'ほんや (Honya)', romaji: 'Honya', meaning: 'Toko Buku' },
      { word: 'ほね (Hone)', romaji: 'Hone', meaning: 'Tulang' },
      { word: 'ほのお (Honoo)', romaji: 'Honoo', meaning: 'Api' },
      { word: 'ほしがる (Hoshigaru)', romaji: 'Hoshigaru', meaning: 'Ingin' },
      { word: 'ほほえむ (Hohoemu)', romaji: 'Hohoemu', meaning: 'Tersenyum' }
    ] 
  },
  { 
    id: 'h31', 
    char: 'ま', 
    romaji: 'ma', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar atas.',
      'Goresan 2: Tarik garis horizontal mendatar bawah sejajar.',
      'Goresan 3: Tarik garis vertikal menusuk memotong keduanya lalu disimpul membulat.'
    ],
    strokeMarkers: [{ x: 32, y: 36 }, { x: 30, y: 50 }, { x: 52, y: 22 }],
    examples: [
      { word: 'まち (Machi)', romaji: 'Machi', meaning: 'Kota' },
      { word: 'まど (Mado)', romaji: 'Mado', meaning: 'Jendela' },
      { word: 'まつ (Matsu)', romaji: 'Matsu', meaning: 'Menunggu' },
      { word: 'まんが (Manga)', romaji: 'Manga', meaning: 'Komik' },
      { word: 'まるい (Marui)', romaji: 'Marui', meaning: 'Bulat' },
      { word: 'まくら (Makura)', romaji: 'Makura', meaning: 'Bantal' },
      { word: 'まずい (Mazui)', romaji: 'Mazui', meaning: 'Tidak Enak' }
    ] 
  },
  { 
    id: 'h32', 
    char: 'み', 
    romaji: 'mi', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal, miring kiri bawah, disimpul membulat ke kanan.',
      'Goresan 2: Tarik garis vertikal miring memotong ujung kanan.'
    ],
    strokeMarkers: [{ x: 30, y: 34 }, { x: 64, y: 26 }],
    examples: [
      { word: 'みず (Mizu)', romaji: 'Mizu', meaning: 'Air' },
      { word: 'みkan (Mikan)', romaji: 'Mikan', meaning: 'Jeruk' },
      { word: 'みみ (Mimi)', romaji: 'Mimi', meaning: 'Telinga' },
      { word: 'みどり (Midori)', romaji: 'Midori', meaning: 'Hijau' },
      { word: 'みち (Michi)', romaji: 'Michi', meaning: 'Jalan' },
      { word: 'みなみ (Minami)', romaji: 'Minami', meaning: 'Selatan' },
      { word: 'みる (Miru)', romaji: 'Miru', meaning: 'Melihat' }
    ] 
  },
  { 
    id: 'h33', 
    char: 'む', 
    romaji: 'mu', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal pendek mendatar.',
      'Goresan 2: Tarik garis vertikal menusuk, disimpul di bawah ke kanan atas.',
      'Goresan 3: Coretan miring kecil di kanan atas.'
    ],
    strokeMarkers: [{ x: 30, y: 44 }, { x: 44, y: 22 }, { x: 74, y: 34 }],
    examples: [
      { word: 'むし (Mushi)', romaji: 'Mushi', meaning: 'Serangga' },
      { word: 'むすめ (Musume)', romaji: 'Musume', meaning: 'Anak Perempuan' },
      { word: 'むら (Mura)', romaji: 'Mura', meaning: 'Desa' },
      { word: 'むかし (Mukashi)', romaji: 'Mukashi', meaning: 'Zaman Dulu' },
      { word: 'むね (Mune)', romaji: 'Mune', meaning: 'Dada' },
      { word: 'むずかしい (Muzukashii)', romaji: 'Muzukashii', meaning: 'Sukar' },
      { word: 'むしば (Mushiba)', romaji: 'Mushiba', meaning: 'Gigi Berlubang' }
    ] 
  },
  { 
    id: 'h34', 
    char: 'め', 
    romaji: 'me', 
    strokeSteps: [
      'Goresan 1: Tarik garis miring pendek melengkung dari kiri atas ke kanan bawah.',
      'Goresan 2: Tarik garis melengkung panjang memotong lurus membulat besar ke kanan.'
    ],
    strokeMarkers: [{ x: 40, y: 28 }, { x: 48, y: 22 }],
    examples: [
      { word: 'めがね (Megane)', romaji: 'Megane', meaning: 'Kacamata' },
      { word: 'め (Me)', romaji: 'Me', meaning: 'Mata' },
      { word: 'めでたい (Medetai)', romaji: 'Medetai', meaning: 'Gembira' },
      { word: 'めいし (Meishi)', romaji: 'Meishi', meaning: 'Kartu Nama' },
      { word: 'めずらしい (Mezurashii)', romaji: 'Mezurashii', meaning: 'Langka' },
      { word: 'めいじ (Meiji)', romaji: 'Meiji', meaning: 'Era Meiji' },
      { word: 'めぐむ (Megumu)', romaji: 'Megumu', meaning: 'Berkah' }
    ] 
  },
  { 
    id: 'h35', 
    char: 'も', 
    romaji: 'mo', 
    strokeSteps: [
      'Goresan 1: Tarik garis lurus memanjang ke bawah melengkung ke kanan atas.',
      'Goresan 2: Tarik garis horizontal memotong bagian atas.',
      'Goresan 3: Tarik garis horizontal memotong bagian tengah.'
    ],
    strokeMarkers: [{ x: 48, y: 20 }, { x: 35, y: 42 }, { x: 35, y: 56 }],
    examples: [
      { word: 'もり (Mori)', romaji: 'Mori', meaning: 'Hutan' },
      { word: 'もち (Mochi)', romaji: 'Mochi', meaning: 'Kue Mochi' },
      { word: 'もも (Momo)', romaji: 'Momo', meaning: 'Persik' },
      { word: 'mono (Mono)', romaji: 'Mono', meaning: 'Barang' },
      { word: 'もんだい (Mondai)', romaji: 'Mondai', meaning: 'Masalah' },
      { word: 'もしもし (Moshimoshi)', romaji: 'Moshimoshi', meaning: 'Halo' },
      { word: 'もえる (Moeru)', romaji: 'Moeru', meaning: 'Terbakar' }
    ] 
  },
  { 
    id: 'h36', 
    char: 'や', 
    romaji: 'ya', 
    strokeSteps: [
      'Goresan 1: Tarik garis melengkung horizontal membulat besar ke kiri bawah.',
      'Goresan 2: Goresan miring kecil di atas punggung garis pertama.',
      'Goresan 3: Tarik garis miring panjang memotong garis horizontal.'
    ],
    strokeMarkers: [{ x: 32, y: 44 }, { x: 50, y: 25 }, { x: 62, y: 22 }],
    examples: [
      { word: 'やま (Yama)', romaji: 'Yama', meaning: 'Gunung' },
      { word: 'やさい (Yasai)', romaji: 'Yasai', meaning: 'Sayuran' },
      { word: 'やさしい (Yasashii)', romaji: 'Yasashii', meaning: 'Baik / Mudah' },
      { word: 'yakitori (Yakitori)', romaji: 'Yakitori', meaning: 'Sate Ayam' },
      { word: 'やくそく (Yakusoku)', romaji: 'Yakusoku', meaning: 'Janji' },
      { word: 'やすみ (Yasumi)', romaji: 'Yasumi', meaning: 'Libur' },
      { word: 'やね (Yane)', romaji: 'Yane', meaning: 'Atap' }
    ] 
  },
  { 
    id: 'h37', 
    char: 'ゆ', 
    romaji: 'yu', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal melingkar membulat ke kanan atas lalu turun.',
      'Goresan 2: Tarik garis vertikal memotong di tengah.'
    ],
    strokeMarkers: [{ x: 36, y: 28 }, { x: 60, y: 22 }],
    examples: [
      { word: 'ゆき (Yuki)', romaji: 'Yuki', meaning: 'Salju' },
      { word: 'ゆめ (Yume)', romaji: 'Yume', meaning: 'Mimpi' },
      { word: 'ゆかた (Yukata)', romaji: 'Yukata', meaning: 'Baju Yukata' },
      { word: 'yuubinkyoku (Yuubinkyoku)', romaji: 'Yuubinkyoku', meaning: 'Kantor Pos' },
      { word: 'ゆうやけ (Yuuyake)', romaji: 'Yuuyake', meaning: 'Senja' },
      { word: 'ゆび (Yubi)', romaji: 'Yubi', meaning: 'Jari' },
      { word: 'ゆreru (Yureru)', romaji: 'Yureru', meaning: 'Goyang' }
    ] 
  },
  { 
    id: 'h38', 
    char: 'よ', 
    romaji: 'yo', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar pendek.',
      'Goresan 2: Tarik garis vertikal memotong disimpul membulat di kanan bawah.'
    ],
    strokeMarkers: [{ x: 30, y: 45 }, { x: 52, y: 24 }],
    examples: [
      { word: 'よる (Yoru)', romaji: 'Yoru', meaning: 'Malam' },
      { word: 'youfuku (Youfuku)', romaji: 'Youfuku', meaning: 'Pakaian' },
      { word: 'よむ (Yomu)', romaji: 'Yomu', meaning: 'Membaca' },
      { word: 'よか (Yoka)', romaji: 'Yoka', meaning: 'Waktu Luang' },
      { word: 'よく (Yoku)', romaji: 'Yoku', meaning: 'Sering' },
      { word: 'よこ (Yoko)', romaji: 'Yoko', meaning: 'Samping' },
      { word: 'よわい (Yowai)', romaji: 'Yowai', meaning: 'Lemah' }
    ] 
  },
  { 
    id: 'h39', 
    char: 'ら', 
    romaji: 'ra', 
    strokeSteps: [
      'Goresan 1: Coretan miring pendek di kanan atas.',
      'Goresan 2: Tarik garis vertikal turun melengkung membulat di bawah.'
    ],
    strokeMarkers: [{ x: 45, y: 24 }, { x: 36, y: 45 }],
    examples: [
      { word: 'raigetsu (Raigetsu)', romaji: 'Raigetsu', meaning: 'Bulan Depan' },
      { word: 'らーめん (Raamen)', romaji: 'Raamen', meaning: 'Ramen' },
      { word: 'らいねん (Rainen)', romaji: 'Rainen', meaning: 'Tahun Depan' },
      { word: 'らkugo (Rakugo)', romaji: 'Rakugo', meaning: 'Humor' },
      { word: 'らいしゅう (Raishuu)', romaji: 'Raishuu', meaning: 'Minggu Depan' },
      { word: 'らっぱ (Rappa)', romaji: 'Rappa', meaning: 'Terompet' },
      { word: 'らいじゅう (Raijuu)', romaji: 'Raijuu', meaning: 'Hewan Petir' }
    ] 
  },
  { 
    id: 'h40', 
    char: 'り', 
    romaji: 'ri', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal pendek melengkung di kiri dengan kail.',
      'Goresan 2: Tarik garis vertikal panjang melengkung di kanan.'
    ],
    strokeMarkers: [{ x: 32, y: 28 }, { x: 68, y: 24 }],
    examples: [
      { word: 'りんご (Ringo)', romaji: 'Ringo', meaning: 'Apel' },
      { word: 'ryokou (Ryokou)', romaji: 'Ryokou', meaning: 'Traveling' },
      { word: 'りす (Risu)', romaji: 'Risu', meaning: 'Tupai' },
      { word: 'りゆう (Riyuu)', romaji: 'Riyuu', meaning: 'Alasan' },
      { word: 'りか (Rika)', romaji: 'Rika', meaning: 'Sains / IPA' },
      { word: 'りょうり (Ryouri)', romaji: 'Ryouri', meaning: 'Masakan' },
      { word: 'りゅう (Ryuu)', romaji: 'Ryuu', meaning: 'Naga' }
    ] 
  },
  { 
    id: 'h41', 
    char: 'る', 
    romaji: 'ru', 
    strokeSteps: [
      'Goresan 1: Tarik satu garis meliuk seperti angka 3 dengan akhiran simpul bulat.'
    ],
    strokeMarkers: [{ x: 32, y: 24 }],
    examples: [
      { word: 'rusuban (Rusuban)', romaji: 'Rusuban', meaning: 'Jaga Rumah' },
      { word: 'るり (Ruri)', romaji: 'Ruri', meaning: 'Lapis Lazuli' },
      { word: 'るい (Rui)', romaji: 'Rui', meaning: 'Kategori' },
      { word: 'るす (Rusu)', romaji: 'Rusu', meaning: 'Pergi Keluar' },
      { word: 'るつぼ (Rutsubo)', romaji: 'Rutsubo', meaning: 'Wadah Lebur' },
      { word: 'るーる (Ruuru)', romaji: 'Ruuru', meaning: 'Aturan' }
    ] 
  },
  { 
    id: 'h42', 
    char: 'れ', 
    romaji: 're', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal lurus ke bawah.',
      'Goresan 2: Tarik garis miring naik-turun zig-zag lalu membelok keluar ke kanan atas.'
    ],
    strokeMarkers: [{ x: 32, y: 22 }, { x: 44, y: 28 }],
    examples: [
      { word: 'reizouko (Reizouko)', romaji: 'Reizouko', meaning: 'Kulkas' },
      { word: 'れきし (Rekishi)', romaji: 'Rekishi', meaning: 'Sejarah' },
      { word: 'れんしゅう (Renshuu)', romaji: 'Renshuu', meaning: 'Latihan' },
      { word: 'れんこん (Renkon)', romaji: 'Renkon', meaning: 'Akar Teratai' },
      { word: 'rei (Rei)', romaji: 'Rei', meaning: 'Contoh / Nol' },
      { word: 'れんあい (Renai)', romaji: 'Renai', meaning: 'Asmara' }
    ] 
  },
  { 
    id: 'h43', 
    char: 'ろ', 
    romaji: 'ro', 
    strokeSteps: [
      'Goresan 1: Tarik satu garis meliuk seperti angka 3 tanpa simpul di bawah.'
    ],
    strokeMarkers: [{ x: 32, y: 24 }],
    examples: [
      { word: 'rousoku (Rousoku)', romaji: 'Rousoku', meaning: 'Lilin' },
      { word: 'ろく (Roku)', romaji: 'Roku', meaning: 'Enam' },
      { word: 'ろうか (Rouka)', romaji: 'Rouka', meaning: 'Koridor' },
      { word: 'ろば (Roba)', romaji: 'Roba', meaning: 'Keledai' },
      { word: 'ろくおん (Rokuon)', romaji: 'Rokuon', meaning: 'Rekam Suara' },
      { word: 'ろうじん (Roujin)', romaji: 'Roujin', meaning: 'Lansia' },
      { word: 'ろてんぶろ (Rotenburo)', romaji: 'Rotenburo', meaning: 'Pemandian Luar' }
    ] 
  },
  { 
    id: 'h44', 
    char: 'わ', 
    romaji: 'wa', 
    strokeSteps: [
      'Goresan 1: Tarik garis vertikal lurus ke bawah.',
      'Goresan 2: Tarik garis miring zig-zag lalu membulat melengkung besar ke dalam.'
    ],
    strokeMarkers: [{ x: 32, y: 22 }, { x: 44, y: 28 }],
    examples: [
      { word: 'わたし (Watashi)', romaji: 'Watashi', meaning: 'Saya' },
      { word: 'わに (Wani)', romaji: 'Wani', meaning: 'Buaya' },
      { word: 'わるい (Warui)', romaji: 'Warui', meaning: 'Buruk' },
      { word: 'わらう (Warau)', romaji: 'Warau', meaning: 'Tertawa' },
      { word: 'わごむ (Wagomu)', romaji: 'Wagomu', meaning: 'Karet Gelang' },
      { word: 'わしょく (Washoku)', romaji: 'Washoku', meaning: 'Makanan Jepang' },
      { word: 'わかつ (Wakatsu)', romaji: 'Wakatsu', meaning: 'Membagi' }
    ] 
  },
  { 
    id: 'h45', 
    char: 'を', 
    romaji: 'wo', 
    strokeSteps: [
      'Goresan 1: Tarik garis horizontal mendatar.',
      'Goresan 2: Tarik garis miring menembus ditarik mendatar ke kanan.',
      'Goresan 3: Tarik garis melengkung memotong di bawah.'
    ],
    strokeMarkers: [{ x: 26, y: 35 }, { x: 38, y: 44 }, { x: 50, y: 55 }],
    examples: [
      { word: 'honwoyomu (Hon wo yomu)', romaji: 'Hon wo yomu', meaning: 'Membaca Buku' },
      { word: 'ewokaku (E wo kaku)', romaji: 'E wo kaku', meaning: 'Menggambar Lukisan' },
      { word: 'ochawo(Ocha wo nomu)', romaji: 'Ocha wo nomu', meaning: 'Minum Teh' },
      { word: 'gohanwo(Gohan wo taberu)', romaji: 'Gohan wo taberu', meaning: 'Makan Nasi' }
    ] 
  },
  { 
    id: 'h46', 
    char: 'ん', 
    romaji: 'n', 
    strokeSteps: [
      'Goresan 1: Tarik satu garis naik miring, turun meliuk melengkung ke atas.'
    ],
    strokeMarkers: [{ x: 36, y: 24 }],
    examples: [
      { word: 'にほん (Nihon)', romaji: 'Nihon', meaning: 'Jepang' },
      { word: 'かんじ (Kanji)', romaji: 'Kanji', meaning: 'Kanji' },
      { word: 'しんせん (Shinsen)', romaji: 'Shinsen', meaning: 'Segar' },
      { word: 'てんき (Tenki)', romaji: 'Tenki', meaning: 'Cuaca' },
      { word: 'りんご (Ringo)', romaji: 'Ringo', meaning: 'Apel' },
      { word: 'ほん (Hon)', romaji: 'Hon', meaning: 'Buku' },
      { word: 'しんかんせん (Shinkansen)', romaji: 'Shinkansen', meaning: 'Kereta Shinkansen' }
    ] 
  }
];

const KATAKANA_DATA: Character[] = [
  { id: 'k1', char: 'ア', romaji: 'a', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk miring ke bawah.', 'Goresan 2: Tarik garis vertikal melengkung miring ke kiri.'], strokeMarkers: [{ x: 24, y: 32 }, { x: 50, y: 35 }], examples: [{ word: 'アメリカ', romaji: 'Amerika', meaning: 'Amerika' }, { word: 'アイス', romaji: 'Aisu', meaning: 'Es Krim' }, { word: 'アウト', romaji: 'Auto', meaning: 'Keluar / Out' }] },
  { id: 'k2', char: 'イ', romaji: 'i', strokeSteps: ['Goresan 1: Tarik garis miring ke kiri bawah.', 'Goresan 2: Tarik garis vertikal lurus memotong garis pertama di tengah.'], strokeMarkers: [{ x: 62, y: 22 }, { x: 50, y: 35 }], examples: [{ word: 'イギリス', romaji: 'Igirisu', meaning: 'Inggris' }, { word: 'インク', romaji: 'Inku', meaning: 'Tinta' }, { word: 'イラスト', romaji: 'Irasuto', meaning: 'Ilustrasi' }] },
  { id: 'k3', char: 'ウ', romaji: 'u', strokeSteps: ['Goresan 1: Coretan vertikal pendek di atas tengah.', 'Goresan 2: Coretan pendek vertikal di ujung kiri.', 'Goresan 3: Tarik garis horizontal menekuk miring ke kiri bawah.'], strokeMarkers: [{ x: 50, y: 22 }, { x: 30, y: 40 }, { x: 35, y: 44 }], examples: [{ word: 'ウイスキー', romaji: 'Uisukii', meaning: 'Wiski' }, { word: 'ウクライナ', romaji: 'Ukuraina', meaning: 'Ukraina' }, { word: 'ウサギ', romaji: 'Usagi', meaning: 'Kelinci' }] },
  { id: 'k4', char: 'エ', romaji: 'e', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar atas.', 'Goresan 2: Tarik garis vertikal di tengah.', 'Goresan 3: Tarik garis horizontal sejajar lebih panjang di bawah.'], strokeMarkers: [{ x: 30, y: 28 }, { x: 50, y: 30 }, { x: 22, y: 72 }], examples: [{ word: 'エアコン', romaji: 'Eakon', meaning: 'AC' }, { word: 'エレベーター', romaji: 'Erebeetaa', meaning: 'Lift' }, { word: 'エプロン', romaji: 'Epuron', meaning: 'Celemek' }] },
  { id: 'k5', char: 'オ', romaji: 'o', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar.', 'Goresan 2: Tarik garis vertikal menembus ke bawah ditekuk kail.', 'Goresan 3: Tarik goresan miring meluncur ke kiri bawah.'], strokeMarkers: [{ x: 26, y: 38 }, { x: 52, y: 22 }, { x: 44, y: 52 }], examples: [{ word: 'オレンジ', romaji: 'Orenji', meaning: 'Jeruk' }, { word: 'オーストラリア', romaji: 'Oosutoraria', meaning: 'Australia' }, { word: 'オフィス', romaji: 'Ofisu', meaning: 'Kantor' }] },
  
  { id: 'k6', char: 'カ', romaji: 'ka', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar menekuk miring ke kiri bawah.', 'Goresan 2: Tarik garis vertikal miring memotong garis pertama.'], strokeMarkers: [{ x: 28, y: 38 }, { x: 48, y: 22 }], examples: [{ word: 'カメラ', romaji: 'Kamera', meaning: 'Kamera' }, { word: 'カレー', romaji: 'Karee', meaning: 'Kari' }, { word: 'カード', romaji: 'Kaado', meaning: 'Kartu' }] },
  { id: 'k7', char: 'キ', romaji: 'ki', strokeSteps: ['Goresan 1: Tarik garis horizontal atas.', 'Goresan 2: Tarik garis horizontal bawah sejajar.', 'Goresan 3: Tarik garis miring memotong keduanya ke kiri bawah.'], strokeMarkers: [{ x: 30, y: 38 }, { x: 28, y: 52 }, { x: 50, y: 22 }], examples: [{ word: 'ギター', romaji: 'Gitaa', meaning: 'Gitar' }, { word: 'キャベツ', romaji: 'Kyabetsu', meaning: 'Kubis' }, { word: 'キャンプ', romaji: 'Kyanpu', meaning: 'Kemah' }] },
  { id: 'k8', char: 'ク', romaji: 'ku', strokeSteps: ['Goresan 1: Tarik goresan miring ke kiri bawah.', 'Goresan 2: Tarik garis horizontal atas menekuk miring ke kiri bawah.'], strokeMarkers: [{ x: 56, y: 24 }, { x: 46, y: 44 }], examples: [{ word: 'クラス', romaji: 'Kurasu', meaning: 'Kelas' }, { word: 'クリスマス', romaji: 'Kurisumasu', meaning: 'Hari Natal' }, { word: 'クリーム', romaji: 'Kuriimu', meaning: 'Krim' }] },
  { id: 'k9', char: 'ケ', romaji: 'ke', strokeSteps: ['Goresan 1: Tarik goresan miring ke kiri.', 'Goresan 2: Tarik garis horizontal memotong garis pertama.', 'Goresan 3: Tarik garis miring panjang dari tengah melengkung ke kiri.'], strokeMarkers: [{ x: 56, y: 24 }, { x: 32, y: 48 }, { x: 50, y: 48 }], examples: [{ word: 'ケーキ', romaji: 'Keeki', meaning: 'Kue' }, { word: 'ケニア', romaji: 'Kenia', meaning: 'Kenya' }, { word: 'ケース', romaji: 'Keesu', meaning: 'Wadah / Kotak' }] },
  { id: 'k10', char: 'コ', romaji: 'ko', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk lurus vertikal.', 'Goresan 2: Tarik garis horizontal bawah menutup.'], strokeMarkers: [{ x: 28, y: 36 }, { x: 28, y: 68 }], examples: [{ word: 'コーヒー', romaji: 'Koohii', meaning: 'Kopi' }, { word: 'コップ', romaji: 'Koppu', meaning: 'Gelas' }, { word: 'コイン', romaji: 'Koin', meaning: 'Koin' }] },
  
  { id: 'k11', char: 'サ', romaji: 'sa', strokeSteps: ['Goresan 1: Tarik garis horizontal panjang.', 'Goresan 2: Tarik garis vertikal pendek memotong di kiri.', 'Goresan 3: Tarik garis vertikal miring memotong di kanan.'], strokeMarkers: [{ x: 22, y: 44 }, { x: 42, y: 26 }, { x: 68, y: 22 }], examples: [{ word: 'サラダ', romaji: 'Sarada', meaning: 'Salad' }, { word: 'サイダー', romaji: 'Saidaa', meaning: 'Soda' }, { word: 'サイン', romaji: 'Sain', meaning: 'Tanda tangan' }] },
  { id: 'k12', char: 'シ', romaji: 'shi', strokeSteps: ['Goresan 1: Coretan titik miring pendek di kiri atas.', 'Goresan 2: Coretan titik miring sejajar di bawahnya.', 'Goresan 3: Tarik garis miring meluncur dari kiri bawah ke kanan atas.'], strokeMarkers: [{ x: 32, y: 30 }, { x: 28, y: 52 }, { x: 34, y: 78 }], examples: [{ word: 'シャツ', romaji: 'Shatsu', meaning: 'Kemeja' }, { word: 'シャンプー', romaji: 'Shanpuu', meaning: 'Sampo' }, { word: 'システム', romaji: 'Shisutemu', meaning: 'Sistem' }] },
  { id: 'k13', char: 'ス', romaji: 'su', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk miring ke kiri bawah.', 'Goresan 2: Tarik garis miring pendek melekat di punggung garis pertama.'], strokeMarkers: [{ x: 28, y: 36 }, { x: 50, y: 54 }], examples: [{ word: 'スポーツ', romaji: 'Supootsu', meaning: 'Olahraga' }, { word: 'スプーン', romaji: 'Supuun', meaning: 'Sendok' }, { word: 'スカート', romaji: 'Sukaato', meaning: 'Rok' }] },
  { id: 'k14', char: 'セ', romaji: 'se', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk lurus ke bawah.', 'Goresan 2: Tarik garis horizontal membelok mendatar ke kanan.'], strokeMarkers: [{ x: 26, y: 38 }, { x: 44, y: 22 }], examples: [{ word: 'セーター', romaji: 'Seetaa', meaning: 'Sweter' }, { word: 'セロテープ', romaji: 'Seroteepu', meaning: 'Selotip' }, { word: 'センス', romaji: 'Sensu', meaning: 'Kipas / Selera' }] },
  { id: 'k15', char: 'ソ', romaji: 'so', strokeSteps: ['Goresan 1: Coretan miring pendek di kiri atas.', 'Goresan 2: Tarik garis miring panjang meluncur ke kiri bawah.'], strokeMarkers: [{ x: 34, y: 28 }, { x: 64, y: 22 }], examples: [{ word: 'ソファー', romaji: 'Sofaa', meaning: 'Sofa' }, { word: 'ソース', romaji: 'Soosu', meaning: 'Saus' }, { word: 'ソフト', romaji: 'Sofuto', meaning: 'Lembut / Software' }] },
  
  { id: 'k16', char: 'タ', romaji: 'ta', strokeSteps: ['Goresan 1: Tarik garis miring pendek ke kiri.', 'Goresan 2: Tarik garis horizontal menekuk miring ke kiri bawah.', 'Goresan 3: Tarik garis horizontal pendek memotong bagian dalam.'], strokeMarkers: [{ x: 52, y: 24 }, { x: 44, y: 44 }, { x: 38, y: 62 }], examples: [{ word: 'タクシー', romaji: 'Takushii', meaning: 'Taksi' }, { word: 'タイ', romaji: 'Tai', meaning: 'Thailand' }, { word: 'タオル', romaji: 'Taoru', meaning: 'Handuk' }] },
  { id: 'k17', char: 'チ', romaji: 'chi', strokeSteps: ['Goresan 1: Tarik garis miring pendek meluncur ke kiri.', 'Goresan 2: Tarik garis horizontal memotong di tengah.', 'Goresan 3: Tarik garis vertikal lurus lalu menekuk ke kanan.'], strokeMarkers: [{ x: 66, y: 24 }, { x: 28, y: 48 }, { x: 48, y: 48 }], examples: [{ word: 'チーズ', romaji: 'Chiizu', meaning: 'Keju' }, { word: 'チーム', romaji: 'Chiimu', meaning: 'Tim' }, { word: 'チケット', romaji: 'Chiketto', meaning: 'Tiket' }] },
  { id: 'k18', char: 'ツ', romaji: 'tsu', strokeSteps: ['Goresan 1: Coretan vertikal pendek miring di kiri.', 'Goresan 2: Coretan sejajar di tengah.', 'Goresan 3: Tarik garis meluncur miring ke kiri bawah.'], strokeMarkers: [{ x: 30, y: 28 }, { x: 52, y: 28 }, { x: 74, y: 24 }], examples: [{ word: 'ツアー', romaji: 'Tsuaa', meaning: 'Tur Wisata' }, { word: 'T-シャツ (てぃーしゃつ)', romaji: 'Tii Shatsu', meaning: 'Kaos' }, { word: 'ツール', romaji: 'Tsuuru', meaning: 'Alat / Tool' }] },
  { id: 'k19', char: 'テ', romaji: 'te', strokeSteps: ['Goresan 1: Tarik garis horizontal pendek atas.', 'Goresan 2: Tarik garis horizontal lebih panjang sejajar.', 'Goresan 3: Tarik garis meluncur miring ke kiri bawah.'], strokeMarkers: [{ x: 32, y: 30 }, { x: 24, y: 48 }, { x: 50, y: 48 }], examples: [{ word: 'テレビ', romaji: 'Terebi', meaning: 'Televisi' }, { word: 'テスト', romaji: 'Tesuto', meaning: 'Ujian / Tes' }, { word: 'テーブル', romaji: 'Teeburu', meaning: 'Meja' }] },
  { id: 'k20', char: 'ト', romaji: 'to', strokeSteps: ['Goresan 1: Tarik garis vertikal lurus ke bawah.', 'Goresan 2: Tarik garis miring memotong dari tengah ke kanan bawah.'], strokeMarkers: [{ x: 46, y: 22 }, { x: 46, y: 48 }], examples: [{ word: 'トイレ', romaji: 'Toire', meaning: 'Toilet' }, { word: 'トマト', romaji: 'Tomato', meaning: 'Tomat' }, { word: 'ドア', romaji: 'Doa', meaning: 'Pintu' }] },
  
  { id: 'k21', char: 'ナ', romaji: 'na', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar.', 'Goresan 2: Tarik garis miring menyilang lurus ke kiri bawah.'], strokeMarkers: [{ x: 26, y: 44 }, { x: 50, y: 22 }], examples: [{ word: 'ナイフ', romaji: 'Naifu', meaning: 'Pisau' }, { word: 'ナイロン', romaji: 'Nairon', meaning: 'Nilon' }, { word: 'ナンバー', romaji: 'Nanbaa', meaning: 'Nomor' }] },
  { id: 'k22', char: 'ニ', romaji: 'ni', strokeSteps: ['Goresan 1: Tarik garis horizontal atas.', 'Goresan 2: Tarik garis horizontal bawah sejajar lebih panjang.'], strokeMarkers: [{ x: 30, y: 38 }, { x: 22, y: 64 }], examples: [{ word: 'ニュース', romaji: 'Nyuusu', meaning: 'Berita' }, { word: 'ニックネーム', romaji: 'Nikkuneemu', meaning: 'Nama Panggilan' }, { word: 'ニット', romaji: 'Nitto', meaning: 'Rajutan' }] },
  { id: 'k23', char: 'ヌ', romaji: 'nu', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk miring ke kiri.', 'Goresan 2: Tarik garis miring menyilang memotong garis pertama.'], strokeMarkers: [{ x: 28, y: 35 }, { x: 54, y: 22 }], examples: [{ word: 'ヌードル', romaji: 'Nuudoru', meaning: 'Mi' }, { word: 'ヌーボー', romaji: 'Nuuboo', meaning: 'Gaya Baru' }, { word: 'ヌマ', romaji: 'Numa', meaning: 'Rawa' }] },
  { id: 'k24', char: 'ネ', romaji: 'ne', strokeSteps: ['Goresan 1: Coretan miring pendek kiri atas.', 'Goresan 2: Tarik garis horizontal menekuk lurus vertikal.', 'Goresan 3: Tarik garis miring menyilang lurus.', 'Goresan 4: Coretan miring ke kanan bawah.'], strokeMarkers: [{ x: 32, y: 24 }, { x: 50, y: 32 }, { x: 42, y: 48 }, { x: 56, y: 56 }], examples: [{ word: 'ネクタイ', romaji: 'Nekutai', meaning: 'Dasi' }, { word: 'ネット', romaji: 'Netto', meaning: 'Internet' }, { word: 'ネックレス', romaji: 'Nekkuresu', meaning: 'Kalung' }] },
  { id: 'k25', char: 'ノ', romaji: 'no', strokeSteps: ['Goresan 1: Satu goresan meluncur miring memanjang ke kiri bawah.'], strokeMarkers: [{ x: 68, y: 22 }], examples: [{ word: 'ノート', romaji: 'Nooto', meaning: 'Buku Catatan' }, { word: 'ノルウェー', romaji: 'Noruwee', meaning: 'Norwegia' }, { word: 'ノートパソコン', romaji: 'Nooto Pasokon', meaning: 'Laptop' }] },
  
  { id: 'k26', char: 'ハ', romaji: 'ha', strokeSteps: ['Goresan 1: Tarik garis miring pendek meluncur ke kiri bawah.', 'Goresan 2: Tarik garis miring pendek meluncur ke kanan bawah.'], strokeMarkers: [{ x: 38, y: 32 }, { x: 62, y: 32 }], examples: [{ word: 'ハンバーグ', romaji: 'Hanbaagu', meaning: 'Burger' }, { word: 'ハム', romaji: 'Hamu', meaning: 'Ham' }, { word: 'ハンカチ', romaji: 'Hankachi', meaning: 'Sapu Tangan' }] },
  { id: 'k27', char: 'ヒ', romaji: 'hi', strokeSteps: ['Goresan 1: Tarik garis horizontal melengkung ke kanan.', 'Goresan 2: Tarik garis miring horizontal menyilang miring kiri.'], strokeMarkers: [{ x: 26, y: 32 }, { x: 46, y: 44 }], examples: [{ word: 'ヒーター', romaji: 'Hiitaa', meaning: 'Pemanas' }, { word: 'ヒーロー', romaji: 'Hiiroo', meaning: 'Pahlawan' }, { word: 'ヒント', romaji: 'Hinto', meaning: 'Petunjuk' }] },
  { id: 'k28', char: 'フ', romaji: 'fu', strokeSteps: ['Goresan 1: Tarik garis horizontal pendek menekuk melengkung miring ke kiri.'], strokeMarkers: [{ x: 32, y: 35 }], examples: [{ word: 'フォーク', romaji: 'Fooku', meaning: 'Garpu' }, { word: 'フランス', romaji: 'Furansu', meaning: 'Prancis' }, { word: 'フィルム', romaji: 'Firumu', meaning: 'Film' }] },
  { id: 'k29', char: 'ヘ', romaji: 'he', strokeSteps: ['Goresan 1: Tarik satu goresan menyerupai gunung landai.'], strokeMarkers: [{ x: 28, y: 56 }], examples: [{ word: 'ヘリコプター', romaji: 'Herikoputaa', meaning: 'Helikopter' }, { word: 'ペン', romaji: 'Pen', meaning: 'Pena' }, { word: 'ページ', romaji: 'Peeji', meaning: 'Halaman' }] },
  { id: 'k30', char: 'ホ', romaji: 'ho', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar.', 'Goresan 2: Tarik garis vertikal memotong di tengah bawah.', 'Goresan 3: Tarik goresan miring kiri.', 'Goresan 4: Tarik goresan miring kanan.'], strokeMarkers: [{ x: 24, y: 40 }, { x: 50, y: 22 }, { x: 35, y: 52 }, { x: 65, y: 52 }], examples: [{ word: 'ホテル', romaji: 'Hoteru', meaning: 'Hotel' }, { word: 'ホームラン', romaji: 'Hoomuran', meaning: 'Home Run' }, { word: 'ホース', romaji: 'Hoosu', meaning: 'Selang' }] },
  
  { id: 'k31', char: 'マ', romaji: 'ma', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk miring ke kiri.', 'Goresan 2: Tarik garis horizontal miring menyilang garis pertama.'], strokeMarkers: [{ x: 28, y: 36 }, { x: 44, y: 52 }], examples: [{ word: 'マフラー', romaji: 'Mafuraa', meaning: 'Syal Leher' }, { word: 'マレーシア', romaji: 'Mareeshia', meaning: 'Malaysia' }, { word: 'マスク', romaji: 'Masuku', meaning: 'Masker' }] },
  { id: 'k32', char: 'ミ', romaji: 'mi', strokeSteps: ['Goresan 1: Goresan miring pendek atas.', 'Goresan 2: Goresan miring sejajar tengah.', 'Goresan 3: Goresan miring sejajar bawah.'], strokeMarkers: [{ x: 32, y: 32 }, { x: 28, y: 50 }, { x: 24, y: 68 }], examples: [{ word: 'ミルク', romaji: 'Miruku', meaning: 'Susu' }, { word: 'ミシン', romaji: 'Mishin', meaning: 'Mesin Jahit' }, { word: 'ミニ', romaji: 'Mini', meaning: 'Mini' }] },
  { id: 'k33', char: 'ム', romaji: 'mu', strokeSteps: ['Goresan 1: Tarik garis horizontal miring menekuk memanjang.', 'Goresan 2: Coretan miring pendek sejajar di bagian dalam.'], strokeMarkers: [{ x: 28, y: 35 }, { x: 52, y: 56 }], examples: [{ word: 'ムービー', romaji: 'Muubii', meaning: 'Film' }, { word: 'ムード', romaji: 'Muudo', meaning: 'Mood' }, { word: 'ムカデ', romaji: 'Mukade', meaning: 'Kelabang' }] },
  { id: 'k34', char: 'メ', romaji: 'me', strokeSteps: ['Goresan 1: Tarik garis miring memanjang ke kanan bawah.', 'Goresan 2: Tarik garis miring menyilang memotong garis pertama.'], strokeMarkers: [{ x: 46, y: 28 }, { x: 54, y: 22 }], examples: [{ word: 'メール', romaji: 'Meeru', meaning: 'E-mail' }, { word: 'メロン', romaji: 'Meron', meaning: 'Melon' }, { word: 'メニュー', romaji: 'Menyuu', meaning: 'Menu' }] },
  { id: 'k35', char: 'モ', romaji: 'mo', strokeSteps: ['Goresan 1: Tarik garis horizontal pendek atas.', 'Goresan 2: Tarik garis horizontal sejajar tengah.', 'Goresan 3: Tarik garis vertikal menekuk menyilang ke kanan bawah.'], strokeMarkers: [{ x: 32, y: 35 }, { x: 30, y: 48 }, { x: 48, y: 22 }], examples: [{ word: 'モデル', romaji: 'Moderu', meaning: 'Model' }, { word: 'モニター', romaji: 'Monitaa', meaning: 'Monitor' }, { word: 'モーター', romaji: 'Mootaa', meaning: 'Motor' }] },
  
  { id: 'k36', char: 'ヤ', romaji: 'ya', strokeSteps: ['Goresan 1: Tarik garis horizontal membelok lurus miring memanjang.', 'Goresan 2: Tarik garis vertikal menyilang memotong garis pertama.'], strokeMarkers: [{ x: 26, y: 40 }, { x: 54, y: 22 }], examples: [{ word: 'ヤマハ', romaji: 'Yamaha', meaning: 'Yamaha' }, { word: 'ヤード', romaji: 'Yaado', meaning: 'Yard' }, { word: 'ヤシ', romaji: 'Yashi', meaning: 'Kelapa' }] },
  { id: 'k37', char: 'ユ', romaji: 'yu', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk lurus bawah.', 'Goresan 2: Tarik garis horizontal sejajar memotong ujung vertikal.'], strokeMarkers: [{ x: 26, y: 36 }, { x: 22, y: 66 }], examples: [{ word: 'ユニフォーム', romaji: 'Yunifoomu', meaning: 'Seragam' }, { word: 'ユーモア', romaji: 'Yuumoa', meaning: 'Humor' }, { word: 'ユーザー', romaji: 'Yuuzaa', meaning: 'User' }] },
  { id: 'k38', char: 'ヨ', romaji: 'yo', strokeSteps: ['Goresan 1: Tarik garis horizontal menekuk lurus bawah.', 'Goresan 2: Tarik garis horizontal memotong lurus di tengah.', 'Goresan 3: Tarik garis horizontal bawah menyilang lebih panjang.'], strokeMarkers: [{ x: 26, y: 32 }, { x: 26, y: 50 }, { x: 22, y: 68 }], examples: [{ word: 'ヨガ', romaji: 'Yoga', meaning: 'Yoga' }, { word: 'ヨーグルト', romaji: 'Yooguruto', meaning: 'Yoghurt' }, { word: 'ヨーロッパ', romaji: 'Yoo-roppa', meaning: 'Eropa' }] },
  
  { id: 'k39', char: 'ラ', romaji: 'ra', strokeSteps: ['Goresan 1: Tarik garis horizontal pendek mendatar.', 'Goresan 2: Tarik garis horizontal menekuk melengkung ke bawah.'], strokeMarkers: [{ x: 30, y: 32 }, { x: 26, y: 48 }], examples: [{ word: 'ラジオ', romaji: 'Rajio', meaning: 'Radio' }, { word: 'ライオン', romaji: 'Raion', meaning: 'Singa' }, { word: 'ライト', romaji: 'Raito', meaning: 'Lampu' }] },
  { id: 'k40', char: 'リ',
    romaji: 'ri', strokeSteps: ['Goresan 1: Tarik garis vertikal pendek melengkung miring kiri.', 'Goresan 2: Tarik garis vertikal panjang lurus melengkung.'], strokeMarkers: [{ x: 32, y: 28 }, { x: 68, y: 24 }], examples: [{ word: 'リンゴ', romaji: 'Ringo', meaning: 'Apel' }, { word: 'リボン', romaji: 'Ribon', meaning: 'Pita' }, { word: 'リスト', romaji: 'Risuto', meaning: 'Daftar' }] },
  { id: 'k41', char: 'ル', romaji: 'ru', strokeSteps: ['Goresan 1: Tarik garis miring membelok lurus.', 'Goresan 2: Tarik garis miring panjang meluncur menekuk kail.'], strokeMarkers: [{ x: 36, y: 24 }, { x: 62, y: 22 }], examples: [{ word: 'ルール', romaji: 'Ruuru', meaning: 'Aturan' }, { word: 'ルビー', romaji: 'Rubii', meaning: 'Ruby' }, { word: 'ルーム', romaji: 'Ruumu', meaning: 'Kamar' }] },
  { id: 'k42', char: 'レ', romaji: 're', strokeSteps: ['Goresan 1: Tarik garis vertikal lurus memanjang menekuk lurus miring memanjang.'], strokeMarkers: [{ x: 32, y: 22 }], examples: [{ word: 'レポート', romaji: 'Repooto', meaning: 'Laporan' }, { word: 'レモン', romaji: 'Remon', meaning: 'Lemon' }, { word: 'レース', romaji: 'Reesu', meaning: 'Balapan' }] },
  { id: 'k43', char: 'ロ', romaji: 'ro', strokeSteps: ['Goresan 1: Tarik garis vertikal kiri bawah.', 'Goresan 2: Tarik garis horizontal menekuk vertikal menyilang kanan.', 'Goresan 3: Tarik garis horizontal menutup kotak di bawah.'], strokeMarkers: [{ x: 30, y: 32 }, { x: 30, y: 32 }, { x: 26, y: 68 }], examples: [{ word: 'ロボット', romaji: 'Robotto', meaning: 'Robot' }, { word: 'ロケット', romaji: 'Roketto', meaning: 'Roket' }, { word: 'ロッカー', romaji: 'Rokkaa', meaning: 'Loker' }] },
  
  { id: 'k44', char: 'ワ', romaji: 'wa', strokeSteps: ['Goresan 1: Tarik garis vertikal pendek miring kiri.', 'Goresan 2: Tarik garis horizontal atas menekuk melengkung ke kiri.'], strokeMarkers: [{ x: 30, y: 32 }, { x: 30, y: 32 }], examples: [{ word: 'ワイン', romaji: 'Wain', meaning: 'Wine' }, { word: 'ワープロ', romaji: 'Waapuro', meaning: 'Mesin Ketik' }, { word: 'ワニ', romaji: 'Wani', meaning: 'Buaya' }] },
  { id: 'k45', char: 'ヲ', romaji: 'wo', strokeSteps: ['Goresan 1: Tarik garis horizontal mendatar atas.', 'Goresan 2: Tarik garis horizontal tengah sejajar.', 'Goresan 3: Tarik garis vertikal memotong melengkung miring lurus.'], strokeMarkers: [{ x: 28, y: 32 }, { x: 26, y: 48 }, { x: 44, y: 48 }], examples: [{ word: 'ヲタ芸 (をたげい)', romaji: 'Wotagei', meaning: 'Tarian Penggemar' }] },
  { id: 'k46', char: 'ン', romaji: 'n', strokeSteps: ['Goresan 1: Coretan miring pendek kiri atas.', 'Goresan 2: Tarik garis meluncur miring dari kiri bawah ke kanan atas.'], strokeMarkers: [{ x: 32, y: 30 }, { x: 34, y: 78 }], examples: [{ word: 'パン', romaji: 'Pan', meaning: 'Roti' }, { word: 'マンション', romaji: 'Manshon', meaning: 'Apartemen' }, { word: 'ナンバー', romaji: 'Nanbaa', meaning: 'Nomor' }] },
]

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Apa arti dari kata berikut?",
    word: "ありがとう (Arigatou)",
    options: ["Halo", "Terima kasih", "Selamat tinggal", "Maaf"],
    answer: "Terima kasih"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "こんにちは (Konnichiwa)",
    options: ["Selamat pagi", "Selamat siang / Halo", "Selamat malam", "Terima kasih"],
    answer: "Selamat siang / Halo"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "さようなら (Sayounara)",
    options: ["Sampai jumpa / Selamat tinggal", "Silakan", "Sama-sama", "Maaf"],
    answer: "Sampai jumpa / Selamat tinggal"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "すみません (Sumimasen)",
    options: ["Permisi / Maaf", "Ya", "Tidak", "Bagus"],
    answer: "Permisi / Maaf"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "おいしい (Oishii)",
    options: ["Panas", "Dingin", "Enak / Lezat", "Pahit"],
    answer: "Enak / Lezat"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "おちゃ (Ocha)",
    options: ["Kopi", "Teh Hijau", "Susu", "Air Putih"],
    answer: "Teh Hijau"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "いぬ (Inu)",
    options: ["Kucing", "Burung", "Anjing", "Kelinci"],
    answer: "Anjing"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "ねこ (Neko)",
    options: ["Tupai", "Kucing", "Rusa", "Buaya"],
    answer: "Kucing"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "くるま (Kuruma)",
    options: ["Kereta", "Mobil", "Sepeda", "Pesawat"],
    answer: "Mobil"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "せんせい (Sensei)",
    options: ["Murid", "Polisi", "Dokter", "Guru"],
    answer: "Guru"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "にく (Niku)",
    options: ["Daging", "Ikan", "Sayur", "Telur"],
    answer: "Daging"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "みず (Mizu)",
    options: ["Minyak", "Teh", "Air", "Jus"],
    answer: "Air"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "たまご (Tamago)",
    options: ["Nasi", "Telur", "Daging", "Roti"],
    answer: "Telur"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "えき (Eki)",
    options: ["Bandara", "Pelabuhan", "Taman", "Stasiun"],
    answer: "Stasiun"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "とけい (Tokei)",
    options: ["Cermin", "Kipas Angin", "Jam", "Kacamata"],
    answer: "Jam"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "さかな (Sakana)",
    options: ["Monyet", "Domba", "Ayam", "Ikan"],
    answer: "Ikan"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "ほん (Hon)",
    options: ["Buku", "Kertas", "Pensil", "Tas"],
    answer: "Buku"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "ともだち (Tomodachi)",
    options: ["Orang tua", "Musuh", "Teman", "Saudara"],
    answer: "Teman"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "わたし (Watashi)",
    options: ["Kamu", "Dia", "Mereka", "Saya"],
    answer: "Saya"
  },
  {
    question: "Apa arti dari kata berikut?",
    word: "にほん (Nihon)",
    options: ["China", "Jepang", "Korea", "Amerika"],
    answer: "Jepang"
  }
]

function App() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'vocabulary' | 'quiz'>('hiragana')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null)
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})
  const [unlockedCards, setUnlockedCards] = useState<Record<string, boolean>>({})
  const [savedDrawings, setSavedDrawings] = useState<Record<string, string>>({})

  // Vocabulary Tab Search State & Memo
  const [vocabSearchQuery, setVocabSearchQuery] = useState('')

  const allVocabList = useMemo(() => {
    const list: Array<{
      char: string
      charId: string
      charType: 'Hiragana' | 'Katakana'
      word: string
      romaji: string
      meaning: string
    }> = []

    HIRAGANA_DATA.forEach(charItem => {
      charItem.examples.forEach(ex => {
        list.push({
          char: charItem.char,
          charId: charItem.id,
          charType: 'Hiragana',
          word: ex.word,
          romaji: ex.romaji,
          meaning: ex.meaning
        })
      })
    })

    KATAKANA_DATA.forEach(charItem => {
      charItem.examples.forEach(ex => {
        list.push({
          char: charItem.char,
          charId: charItem.id,
          charType: 'Katakana',
          word: ex.word,
          romaji: ex.romaji,
          meaning: ex.meaning
        })
      })
    })

    return list
  }, [])

  const filteredVocabList = useMemo(() => {
    return allVocabList.filter(item => {
      if (!vocabSearchQuery) return true
      const q = vocabSearchQuery.toLowerCase().trim()
      return (
        item.word.toLowerCase().includes(q) ||
        item.romaji.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.char.toLowerCase().includes(q)
      )
    })
  }, [allVocabList, vocabSearchQuery])

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  // Writing Modal State
  const [writingTarget, setWritingTarget] = useState<any | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [drawingHistory, setDrawingHistory] = useState<string[]>([])
  const canvasRectRef = useRef<DOMRect | null>(null) // OPTIMASI LAG: Bounding Box Cache Ref

  // Vocabulary Detail Modal State
  const [vocabTarget, setVocabTarget] = useState<Character | null>(null)

  // OPTIMASI: Lock Body Scroll saat modal terbuka agar halaman belakang tidak ikut ter-scroll
  useEffect(() => {
    if (writingTarget || vocabTarget) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [writingTarget, vocabTarget])

  // Toggle card flip (only if unlocked)
  const handleCardClick = (item: Character) => {
    const isUnlocked = !!unlockedCards[item.id]
    if (!isUnlocked) {
      setWritingTarget(item)
    } else {
      setFlippedCards(prev => ({ ...prev, [item.id]: !prev[item.id] }))
    }
  }

  // Open writing modal directly for review
  const openWritingPracticeDirectly = (e: React.MouseEvent, item: Character) => {
    e.stopPropagation()
    setWritingTarget(item)
  }

  // Drawing Canvas Logic
  useEffect(() => {
    if (writingTarget && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
        setIsDrawing(false)
        setDrawingHistory([])
        canvasRectRef.current = null
      }
    }
  }, [writingTarget])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ambil bounding client rect dan simpan ke cache ref
    canvasRectRef.current = canvas.getBoundingClientRect()

    const coords = getCoordinates(e, canvas)
    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
    
    // Tentukan ketebalan goresan dinamis agar proporsional dengan ukuran huruf
    let brushWidth = 10
    if (writingTarget && writingTarget.isWord) {
      const N = writingTarget.word.length
      let charPx = 72
      if (N === 2) charPx = 136
      else if (N === 3) charPx = 104
      else if (N === 4) charPx = 88
      brushWidth = Number(((charPx / 160) * 10).toFixed(1))
    }
    ctx.lineWidth = brushWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#557a46' // Matcha green stroke color
    setIsDrawing(true)
    
    // OPTIMASI LAG: Set hasDrawn ke true hanya sekali di awal coretan
    if (!hasDrawn) {
      setHasDrawn(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const coords = getCoordinates(e, canvas)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false)
      try {
        const state = canvasRef.current.toDataURL()
        setDrawingHistory(prev => [...prev, state])
      } catch (err) {
        console.error("Gagal menyimpan riwayat coretan:", err)
      }
    } else {
      setIsDrawing(false)
    }
  }

  const undoDrawing = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const newHistory = [...drawingHistory]
    newHistory.pop() // Hapus state terakhir

    if (newHistory.length > 0) {
      const prevState = newHistory[newHistory.length - 1]
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = prevState
      setDrawingHistory(newHistory)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setDrawingHistory([])
      setHasDrawn(false)
    }
  }

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    // OPTIMASI LAG: Gunakan rect dari cache ref jika ada untuk meniadakan synchronous layouts
    const rect = canvasRectRef.current || canvas.getBoundingClientRect()
    
    // Hitung rasio resolusi internal canvas terhadap ukuran tampilan CSS
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 }
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const clearCanvas = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawn(false)
      setDrawingHistory([])
    }
  }

  const handleFinishWriting = () => {
    if (!writingTarget) return
    const target = writingTarget

    // Simpan coretan kanvas sebagai gambar base64
    if (canvasRef.current) {
      try {
        const drawingUrl = canvasRef.current.toDataURL()
        setSavedDrawings(prev => ({ ...prev, [target.id]: drawingUrl }))
      } catch (err) {
        console.error("Gagal menyimpan coretan:", err)
      }
    }

    if (!target.isWord) {
      setUnlockedCards(prev => ({ ...prev, [target.id]: true }))
      setFlippedCards(prev => ({ ...prev, [target.id]: true }))
      setWritingTarget(null)
      setVocabTarget(target)
    } else {
      // Jika latihan kata, langsung tutup saja setelah selesai
      setWritingTarget(null)
    }
  }

  // Helper untuk mendapatkan aksara dasar (tanpa dakuon/handakuon/small kana) agar stroke markers terpetakan
  // Helper untuk mendapatkan aksara dasar (tanpa dakuon/handakuon/small kana) agar stroke markers terpetakan
  const getBaseCharacter = (charStr: string): string => {
    const map: { [key: string]: string } = {
      'が': 'か',
      'ぎ': 'き',
      'ぐ': 'く',
      'げ': 'け',
      'ご': 'こ',
      'ざ': 'さ',
      'じ': 'し',
      'ず': 'す',
      'ぜ': 'せ',
      'ぞ': 'そ',
      'だ': 'た',
      'ぢ': 'ち',
      'づ': 'つ',
      'で': 'て',
      'ど': 'と',
      'ば': 'は',
      'び': 'ひ',
      'ぶ': 'ふ',
      'べ': 'へ',
      'ぼ': 'ほ',
      'ぱ': 'は',
      'ぴ': 'ひ',
      'ぷ': 'ふ',
      'ぺ': 'へ',
      'ぽ': 'ほ',
      'ぁ': 'あ',
      'ぃ': 'い',
      'ぅ': 'う',
      'ぇ': 'え',
      'ぉ': 'お',
      'っ': 'つ',
      'ゃ': 'や',
      'ゅ': 'ゆ',
      'ょ': 'よ',
      'ガ': 'カ',
      'ギ': 'キ',
      'グ': 'ク',
      'ゲ': 'ケ',
      'ゴ': 'コ',
      'ザ': 'サ',
      'ジ': 'シ',
      'ズ': 'ス',
      'ゼ': 'セ',
      'ゾ': 'ソ',
      'ダ': 'タ',
      'ヂ': 'チ',
      'ヅ': 'ツ',
      'デ': 'テ',
      'ド': 'ト',
      'バ': 'ハ',
      'ビ': 'ヒ',
      'ブ': 'フ',
      'ベ': 'ヘ',
      'ボ': 'ホ',
      'パ': 'ハ',
      'ピ': 'ヒ',
      'プ': 'フ',
      'ペ': 'ヘ',
      'ポ': 'ホ',
      'ァ': 'ア',
      'ィ': 'イ',
      'ゥ': 'ウ',
      'ェ': 'エ',
      'ォ': 'オ',
      'ッ': 'ツ',
      'ャ': 'ヤ',
      'ュ': 'ユ',
      'ョ': 'ヨ'
    };
    return map[charStr] || charStr;
  };

  const getWordCharacters = (wordText: string): Character[] => {
    const chars: Character[] = [];
    for (let i = 0; i < wordText.length; i++) {
      const charStr = wordText[i];
      const baseChar = getBaseCharacter(charStr);
      const found = HIRAGANA_DATA.find(c => c.char === baseChar) || KATAKANA_DATA.find(c => c.char === baseChar);
      
      if (found) {
        chars.push({
          ...found,
          char: charStr
        });
      } else {
        chars.push({
          id: 'temp-' + charStr,
          char: charStr,
          romaji: '',
          strokeSteps: ['Goresan bebas untuk aksara ini.'],
          strokeMarkers: [],
          examples: []
        });
      }
    }
    return chars;
  };

  const handleStartWordWriting = (wordTextWithRomaji: string, romaji: string, meaning: string) => {
    const cleanWord = wordTextWithRomaji.split(' ')[0] || wordTextWithRomaji
    const constituentChars = getWordCharacters(cleanWord)
    
    setWritingTarget({
      isWord: true,
      id: `word-${cleanWord}`,
      word: cleanWord,
      romaji: romaji,
      meaning: meaning,
      chars: constituentChars
    })
  }

  const handleDirectToVocabAndWrite = (ex: { word: string, romaji: string, meaning: string }) => {
    const cleanWord = ex.word.split(' ')[0] || ex.word
    setActiveTab('vocabulary')
    setVocabSearchQuery(cleanWord)
    setVocabTarget(null)
    // Langsung buka latihan menulis kata kosa kata penuh!
    handleStartWordWriting(ex.word, ex.romaji, ex.meaning)
  }

  // Reset progress
  const resetProgress = () => {
    setUnlockedCards({})
    setFlippedCards({})
    setSavedDrawings({})
    setScore(0)
    setCurrentQuizIndex(0)
    setQuizSubmitted(false)
    setSelectedAnswer(null)
  }

  // FITUR CARI KETAT + FILTER VOKAL
  const filteredHiragana = useMemo(() => {
    return HIRAGANA_DATA.filter(item => {
      // 1. Filter Cari Persis
      if (searchQuery) {
        const q = searchQuery.trim().toLowerCase()
        if (item.char !== q && item.romaji.toLowerCase() !== q) {
          return false
        }
      }
      // 2. Filter Vokal (ends with a, i, u, e, o)
      if (selectedVowel) {
        return item.romaji.toLowerCase().endsWith(selectedVowel)
      }
      return true
    })
  }, [searchQuery, selectedVowel])

  const filteredKatakana = useMemo(() => {
    return KATAKANA_DATA.filter(item => {
      // 1. Filter Cari Persis
      if (searchQuery) {
        const q = searchQuery.trim().toLowerCase()
        if (item.char !== q && item.romaji.toLowerCase() !== q) {
          return false
        }
      }
      // 2. Filter Vokal (ends with a, i, u, e, o)
      if (selectedVowel) {
        return item.romaji.toLowerCase().endsWith(selectedVowel)
      }
      return true
    })
  }, [searchQuery, selectedVowel])

  // Progress calculations
  const totalCards = HIRAGANA_DATA.length + KATAKANA_DATA.length
  const unlockedCount = Object.keys(unlockedCards).length
  const progressPercentage = Math.round((unlockedCount / totalCards) * 100)

  // Breakdown calculations
  const unlockedHiraganaCount = Object.keys(unlockedCards).filter(id => id.startsWith('h')).length
  const unlockedKatakanaCount = Object.keys(unlockedCards).filter(id => id.startsWith('k')).length
  const totalHiragana = HIRAGANA_DATA.length
  const totalKatakana = KATAKANA_DATA.length
  
  const hiraganaPercentage = totalHiragana > 0 ? Math.round((unlockedHiraganaCount / totalHiragana) * 100) : 0
  const katakanaPercentage = totalKatakana > 0 ? Math.round((unlockedKatakanaCount / totalKatakana) * 100) : 0

  // Quiz handler
  const handleAnswerSelect = (option: string) => {
    if (quizSubmitted) return
    setSelectedAnswer(option)
  }

  const handleQuizSubmit = () => {
    if (!selectedAnswer || quizSubmitted) return
    const isCorrect = selectedAnswer === QUIZ_QUESTIONS[currentQuizIndex].answer
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
    setQuizSubmitted(true)
  }

  const handleNextQuiz = () => {
    setSelectedAnswer(null)
    setQuizSubmitted(false)
    if (currentQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(prev => prev + 1)
    } else {
      setCurrentQuizIndex(0)
      setScore(0)
    }
  }

  const currentQuestion = QUIZ_QUESTIONS[currentQuizIndex]

  return (
    <div className="min-h-screen bg-[#f2f6f1] text-[#1e2d1a] selection:bg-jp-matcha selection:text-white font-sans antialiased pb-20 relative overflow-clip">
      
      {/* Soft Matcha Green Sun Glow */}
      <div className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-jp-matcha/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      {/* Traditional Shoji Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* Header / Navbar - Hijau Gelap, Sticky & Efek Neon Keren */}
      <header className="border-b border-green-900/30 bg-[#121b12]/95 sticky top-0 z-50 transition-all duration-300 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-jp-matcha flex items-center justify-center font-bold text-lg text-white border border-green-700/10 shrink-0">
              茶
            </div>
            <div>
              <span className="neon-text text-xl font-bold tracking-widest block font-display">
                BisaJepang
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Visual Progress Bar - Header */}
            <div className="hidden sm:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 text-xs shadow-sm text-white">
              <span className="text-white/60 font-medium">Progres:</span>
              <div className="w-20 bg-white/10 h-1.5 rounded-full overflow-hidden inline-block relative">
                <div 
                  className="h-full bg-gradient-to-r from-jp-matcha to-jp-gold transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="font-bold text-jp-gold font-mono">{progressPercentage}%</span>
            </div>
            <button 
              onClick={resetProgress}
              className="text-xs text-white/70 hover:text-white transition-colors duration-200 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-full border border-white/10 shadow-sm font-semibold"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 text-center relative z-10">

        
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-jp-tea-cream max-w-3xl mx-auto leading-none mb-6">
          Belajar & Coret Langsung{' '}
          <span className="text-jp-matcha relative inline-block">
            Aksara Jepang
            <span className="absolute bottom-1.5 left-0 w-full h-[4px] bg-jp-matcha/30 rounded-full"></span>
          </span>
        </h1>
        
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Kuasai cara penulisan stroke order yang benar dengan Canvas. Tulis hurufnya terlebih dahulu untuk membuka kartu kosa katanya.
        </p>

        {/* Global Progress Bar - Penyelarasan Warna Matcha */}
        <div className="max-w-md mx-auto bg-white border border-gray-200/80 p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-jp-matcha"></div>
          
          {/* Main Progress Info */}
          <div className="flex justify-between items-center text-xs mb-2.5 pl-2">
            <span className="text-jp-tea-cream/80 font-bold text-sm">Aksara Terbuka (Total)</span>
            <span className="font-bold text-jp-matcha font-mono text-sm">{unlockedCount} / {totalCards} Karakter</span>
          </div>
          <div className="w-full bg-[#f2f6f1]/60 h-2.5 rounded-full overflow-hidden ml-2 border border-gray-150/40 mb-4">
            <div 
              className="h-full bg-gradient-to-r from-jp-matcha to-jp-gold transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Breakdown Progress (Hiragana & Katakana side-by-side) */}
          <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-gray-100 ml-2">
            {/* Hiragana Progress Column */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1.5">
                <span className="text-gray-500 font-bold">あ Hiragana</span>
                <span className="font-bold text-jp-matcha font-mono">{unlockedHiraganaCount} / {totalHiragana}</span>
              </div>
              <div className="w-full bg-[#f2f6f1]/60 h-1.5 rounded-full overflow-hidden border border-gray-150/20">
                <div 
                  className="h-full bg-jp-matcha transition-all duration-500 ease-out"
                  style={{ width: `${hiraganaPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Katakana Progress Column */}
            <div>
              <div className="flex justify-between items-center text-[10px] mb-1.5">
                <span className="text-gray-500 font-bold">ア Katakana</span>
                <span className="font-bold text-jp-matcha font-mono">{unlockedKatakanaCount} / {totalKatakana}</span>
              </div>
              <div className="w-full bg-[#f2f6f1]/60 h-1.5 rounded-full overflow-hidden border border-gray-150/20">
                <div 
                  className="h-full bg-jp-matcha/70 transition-all duration-500 ease-out"
                  style={{ width: `${katakanaPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        
        {/* Navigation Tabs - Sticky top di bawah header saat di-scroll */}
        <div className="sticky top-16 z-40 bg-[#f2f6f1]/95 backdrop-blur-md py-3.5 mb-8 flex justify-center border-b border-gray-200/40 w-full overflow-hidden px-4">
          <div className="flex overflow-x-auto whitespace-nowrap bg-white p-1 rounded-xl border border-gray-200 shadow-sm max-w-full scrollbar-none scroll-smooth">
            <button
              onClick={() => { setActiveTab('hiragana'); setSearchQuery(''); setSelectedVowel(null); }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2 shrink-0 ${
                activeTab === 'hiragana' 
                  ? 'bg-jp-matcha text-white shadow-sm' 
                  : 'text-gray-500 hover:text-jp-matcha'
              }`}
            >
              <span className="font-sans font-bold text-sm">あ</span> Hiragana
            </button>
            <button
              onClick={() => { setActiveTab('katakana'); setSearchQuery(''); setSelectedVowel(null); }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2 shrink-0 ${
                activeTab === 'katakana' 
                  ? 'bg-jp-matcha text-white shadow-sm' 
                  : 'text-gray-500 hover:text-jp-matcha'
              }`}
            >
              <span className="font-sans font-bold text-sm">ア</span> Katakana
            </button>
            <button
              onClick={() => { setActiveTab('vocabulary'); setVocabSearchQuery(''); }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2 shrink-0 ${
                activeTab === 'vocabulary' 
                  ? 'bg-jp-matcha text-white shadow-sm' 
                  : 'text-gray-500 hover:text-jp-matcha'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Contoh Kata
            </button>
            <button
              onClick={() => { setActiveTab('quiz'); setSearchQuery(''); setSelectedVowel(null); }}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 flex items-center gap-2 shrink-0 ${
                activeTab === 'quiz' 
                  ? 'bg-jp-matcha text-white shadow-sm' 
                  : 'text-gray-500 hover:text-jp-matcha'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Kuis Kosa Kata
            </button>
          </div>
        </div>

        {/* Search Bar - Pencarian Karakter Saja */}
        {(activeTab === 'hiragana' || activeTab === 'katakana') && (
          <div className="max-w-md mx-auto mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4.5 w-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari aksara saja (misal: 'a' atau 'あ')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-[#1e2d1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jp-matcha/30 focus:border-jp-matcha transition-all duration-200 text-xs sm:text-sm shadow-sm"
            />
          </div>
        )}

        {/* FITUR BARU: Filter Vokal A, I, U, E, O */}
        {(activeTab === 'hiragana' || activeTab === 'katakana') && (
          <div className="flex items-center gap-2 mb-10 w-full overflow-hidden justify-center px-4">
            <span className="text-xs font-semibold text-gray-500 shrink-0">Filter:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-1 scroll-smooth max-w-full">
              <button 
                onClick={() => setSelectedVowel(null)} 
                className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all duration-150 shadow-xs border shrink-0 ${
                  selectedVowel === null 
                    ? 'bg-jp-matcha text-white border-jp-matcha' 
                    : 'bg-white text-[#1e2d1a] border-gray-200 hover:border-jp-matcha/50'
                }`}
              >
                Semua
              </button>
              {['a', 'i', 'u', 'e', 'o'].map(vowel => (
                <button 
                  key={vowel} 
                  onClick={() => setSelectedVowel(vowel)} 
                  className={`w-7.5 h-7.5 rounded-full text-[11px] sm:text-xs font-bold uppercase transition-all duration-150 flex items-center justify-center shadow-xs border shrink-0 ${
                    selectedVowel === vowel 
                      ? 'bg-jp-matcha text-white border-jp-matcha' 
                      : 'bg-white text-[#1e2d1a] border-gray-200 hover:border-jp-matcha/50'
                  }`}
                >
                  {vowel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hiragana Grid */}
        {activeTab === 'hiragana' && (
          <div>
            {filteredHiragana.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada karakter Hiragana yang cocok.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {filteredHiragana.map((item) => {
                  const isFlipped = !!flippedCards[item.id]
                  const isUnlocked = !!unlockedCards[item.id]
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className={`h-48 cursor-pointer rounded-2xl border flex flex-col justify-between p-4.5 relative overflow-hidden shadow-sm card-hardware-accelerated ${
                        isFlipped 
                          ? 'border-jp-matcha bg-jp-matcha/5 hover:border-jp-matcha' 
                          : isUnlocked
                            ? 'border-jp-matcha/40 bg-[#fafdfa] hover:border-jp-matcha'
                            : 'border-gray-200 bg-white hover:bg-jp-sumi-card-hover hover:border-gray-300'
                      }`}
                    >
                      {/* Badge status Kunci / Tulis */}
                      <div className="absolute top-2.5 right-2.5 z-20">
                        {!isUnlocked ? (
                          <span className="bg-[#557a46]/10 border border-[#557a46]/20 text-[#557a46] text-[8px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            LATIHAN
                          </span>
                        ) : (
                          <button
                            onClick={(e) => openWritingPracticeDirectly(e, item)}
                            className="bg-jp-matcha/10 hover:bg-jp-matcha/20 border border-jp-matcha/30 text-jp-matcha text-[8px] font-bold px-1.5 py-0.5 rounded transition-colors duration-150"
                            title="Ulang Latihan Menulis"
                          >
                            TULIS ULANG
                          </button>
                        )}
                      </div>

                      {isFlipped ? (
                        /* Back Face Content */
                        <div className="flex flex-col h-full justify-between w-full animate-fade-in text-left">
                          <div>
                            <span className="text-[8px] font-mono tracking-widest text-jp-matcha font-bold uppercase block">ROMAJI</span>
                            <span className="text-2xl font-extrabold text-jp-tea-cream font-display leading-tight">{item.romaji}</span>
                          </div>
                          
                          {/* Contoh kosa kata dasar singkat */}
                          <div className="mt-1 border-t border-gray-150 pt-1.5">
                            <span className="text-[8px] font-mono tracking-widest text-gray-400 block mb-0.5">CONTOH KATA</span>
                            <span className="text-xs text-jp-tea-cream font-bold block">{item.examples[0].word}</span>
                            <span className="text-[10px] text-gray-500 block leading-tight">{item.examples[0].romaji} - {item.examples[0].meaning}</span>
                          </div>

                          {/* Tombol Lihat Contoh Kosa Kata Lainnya */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setVocabTarget(item); }}
                            className="w-full text-center py-1 bg-jp-matcha hover:bg-jp-matcha-hover text-white text-[9px] font-bold rounded-md mt-2 transition-all duration-150 shadow-sm"
                          >
                            Contoh Lainnya
                          </button>
                        </div>
                      ) : (
                        /* Front Face Content */
                        <div className="flex flex-col h-full justify-between items-center w-full animate-fade-in">
                          <div className="w-full text-left">
                            <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-semibold">HIRAGANA</span>
                          </div>
                          <span className="text-4xl sm:text-5xl font-bold font-sans text-jp-tea-cream">
                            {item.char}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium">
                            {!isUnlocked ? 'Latih menulis untuk membuka' : 'Klik untuk melihat detail'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Katakana Grid */}
        {activeTab === 'katakana' && (
          <div>
            {filteredKatakana.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada karakter Katakana yang cocok.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {filteredKatakana.map((item) => {
                  const isFlipped = !!flippedCards[item.id]
                  const isUnlocked = !!unlockedCards[item.id]
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item)}
                      className={`h-48 cursor-pointer rounded-2xl border flex flex-col justify-between p-4.5 relative overflow-hidden shadow-sm card-hardware-accelerated ${
                        isFlipped 
                          ? 'border-jp-matcha bg-jp-matcha/5 hover:border-jp-matcha' 
                          : isUnlocked
                            ? 'border-jp-matcha/40 bg-[#fafdfa] hover:border-jp-matcha'
                            : 'border-gray-200 bg-white hover:bg-jp-sumi-card-hover hover:border-gray-300'
                      }`}
                    >
                      {/* Badge status Kunci / Tulis */}
                      <div className="absolute top-2.5 right-2.5 z-20">
                        {!isUnlocked ? (
                          <span className="bg-[#557a46]/10 border border-[#557a46]/20 text-[#557a46] text-[8px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            LATIHAN
                          </span>
                        ) : (
                          <button
                            onClick={(e) => openWritingPracticeDirectly(e, item)}
                            className="bg-jp-matcha/10 hover:bg-jp-matcha/20 border border-jp-matcha/30 text-jp-matcha text-[8px] font-bold px-1.5 py-0.5 rounded transition-colors duration-150"
                            title="Ulang Latihan Menulis"
                          >
                            TULIS ULANG
                          </button>
                        )}
                      </div>

                      {isFlipped ? (
                        /* Back Face Content */
                        <div className="flex flex-col h-full justify-between w-full animate-fade-in text-left">
                          <div>
                            <span className="text-[8px] font-mono tracking-widest text-jp-matcha font-bold uppercase block">ROMAJI</span>
                            <span className="text-2xl font-extrabold text-jp-tea-cream font-display leading-tight">{item.romaji}</span>
                          </div>
                          
                          {/* Contoh kosa kata dasar singkat */}
                          <div className="mt-1 border-t border-gray-150 pt-1.5">
                            <span className="text-[8px] font-mono tracking-widest text-gray-400 block mb-0.5">CONTOH KATA</span>
                            <span className="text-xs text-jp-tea-cream font-bold block">{item.examples[0].word}</span>
                            <span className="text-[10px] text-gray-500 block leading-tight">{item.examples[0].romaji} - {item.examples[0].meaning}</span>
                          </div>

                          {/* Tombol Lihat Contoh Kosa Kata Lainnya */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setVocabTarget(item); }}
                            className="w-full text-center py-1 bg-jp-matcha hover:bg-jp-matcha-hover text-white text-[9px] font-bold rounded-md mt-2 transition-all duration-150 shadow-sm"
                          >
                            Contoh Lainnya
                          </button>
                        </div>
                      ) : (
                        /* Front Face Content */
                        <div className="flex flex-col h-full justify-between items-center w-full animate-fade-in">
                          <div className="w-full text-left">
                            <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase font-semibold">KATAKANA</span>
                          </div>
                          <span className="text-4xl sm:text-5xl font-bold font-sans text-jp-tea-cream">
                            {item.char}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium">
                            {!isUnlocked ? 'Latih menulis untuk membuka' : 'Klik untuk melihat detail'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Contoh Kata - Kamus Mini */}
        {activeTab === 'vocabulary' && (
          <div className="max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="max-w-md mx-auto mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4.5 w-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari kosa kata (misal: 'anjing', 'inu', 'いぬ')..."
                value={vocabSearchQuery}
                onChange={(e) => setVocabSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[#1e2d1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jp-matcha/30 focus:border-jp-matcha transition-all duration-200 text-xs sm:text-sm shadow-sm"
              />
            </div>

            {/* List of Vocabulary */}
            {filteredVocabList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Kosa kata tidak ditemukan.</p>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                {filteredVocabList.map((item, idx) => {
                  const cleanWord = item.word.split(' ')[0] || item.word
                  const userWordDrawing = savedDrawings[`word-${cleanWord}`]

                  return (
                    <div 
                      key={idx}
                      onClick={() => handleStartWordWriting(item.word, item.romaji, item.meaning)}
                      className="bg-white border border-gray-200/80 p-4.5 rounded-2xl shadow-sm hover:border-jp-matcha/50 transition-all duration-150 cursor-pointer hover:shadow-md group flex items-center justify-between gap-4"
                      title="Klik untuk langsung mencoba menulis kosa kata ini"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Character Badge */}
                        <div className="bg-jp-matcha/10 text-jp-matcha text-[10px] font-bold px-2.5 py-1.5 rounded-xl font-mono group-hover:bg-jp-matcha group-hover:text-white transition-colors duration-150 shrink-0">
                          {item.char} ({item.charType})
                        </div>
                        
                        {/* Word Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                          <span className="text-base font-bold text-jp-tea-cream">{item.word}</span>
                          <span className="text-xs text-gray-500 font-medium">Lafal: {item.romaji}</span>
                          <span className="text-xs font-bold text-jp-matcha bg-jp-matcha/5 border border-jp-matcha/10 px-2 py-0.5 rounded-md group-hover:bg-jp-matcha/10 transition-colors duration-150 w-fit">
                            {item.meaning}
                          </span>
                        </div>
                      </div>
                      
                      {/* Right Section: Coretan & Status */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Menampilkan coretan kata hasil latihan pengguna */}
                        {userWordDrawing && (
                          <div className="relative w-11 h-11 bg-[#f8faf7] border border-gray-200 rounded-lg overflow-hidden shadow-inner flex items-center justify-center select-none">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none"></div>
                            <img src={userWordDrawing} alt="Coretan Kata Anda" className="w-full h-full object-contain relative z-10 pointer-events-none" />
                          </div>
                        )}
                        
                        {userWordDrawing ? (
                          <span className="text-[9px] text-[#405d33] bg-[#557a46]/10 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            ✍️ Sudah Ditulis
                          </span>
                        ) : (
                          <span className="text-[9px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-bold font-sans">
                            Coba Tulis
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Quiz Content */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-jp-matcha/5 rounded-full blur-xl pointer-events-none"></div>

            {/* Quiz Header */}
            <div className="flex justify-between items-center border-b border-gray-150 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-jp-matcha font-bold uppercase">UJI KEMAMPUAN</span>
                <h2 className="text-base sm:text-lg font-bold text-jp-tea-cream mt-0.5">Kuis Kosa Kata</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Soal</span>
                <span className="font-bold text-jp-tea-cream font-mono text-sm">
                  {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
            </div>

            {/* Quiz Body */}
            <div>
              <p className="text-xs sm:text-sm text-gray-505 mb-3">{currentQuestion.question}</p>
              <div className="bg-[#f8faf7] border border-gray-150 rounded-2xl py-7 px-4 text-center mb-6">
                <span className="text-3xl sm:text-4xl font-bold font-sans text-jp-matcha tracking-wide block">
                  {currentQuestion.word}
                </span>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
                {currentQuestion.options.map((option, idx) => {
                  let buttonStyle = "border-gray-200 bg-[#fbfdfb] hover:bg-[#f3f6f1] hover:border-gray-300 text-gray-700"
                  
                  if (selectedAnswer === option) {
                    if (quizSubmitted) {
                      const isCorrect = option === currentQuestion.answer
                      buttonStyle = isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                        : "border-red-400 bg-red-50 text-red-700 font-bold"
                    } else {
                      buttonStyle = "border-jp-gold bg-jp-gold/5 text-jp-gold font-bold"
                    }
                  } else if (quizSubmitted && option === currentQuestion.answer) {
                    buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold"
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={quizSubmitted}
                      className={`w-full py-3.5 px-5 border text-left rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 focus:outline-none flex items-center justify-between active:scale-[0.99] ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === option && !quizSubmitted && (
                        <span className="w-1.5 h-1.5 rounded-full bg-jp-gold"></span>
                      )}
                      {quizSubmitted && option === currentQuestion.answer && (
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {quizSubmitted && selectedAnswer === option && option !== currentQuestion.answer && (
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Action Area */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  {quizSubmitted && (
                    <div className="text-xs">
                      {selectedAnswer === currentQuestion.answer ? (
                        <span className="text-emerald-600 font-bold">Benar! Kerja bagus.</span>
                      ) : (
                        <span className="text-red-600 font-bold">Salah. Jawaban yang tepat: {currentQuestion.answer}</span>
                      )}
                    </div>
                  )}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={!selectedAnswer}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 ${
                      selectedAnswer 
                        ? 'bg-jp-matcha hover:bg-jp-matcha-hover text-white shadow-jp-matcha/10 hover:-translate-y-0.5' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="w-full sm:w-auto px-6 py-2.5 bg-jp-matcha hover:bg-jp-matcha-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {currentQuizIndex === QUIZ_QUESTIONS.length - 1 ? 'Reset Kuis' : 'Berikutnya'}
                  </button>
                )}
              </div>
            </div>

            {/* Score Tracker */}
            <div className="mt-8 pt-5 border-t border-gray-150 flex items-center justify-between text-[11px] text-gray-400">
              <span>Pilih jawaban dan submit skor Anda</span>
              <span className="font-mono">Skor: <strong className="text-jp-gold font-bold font-mono text-xs">{score}</strong></span>
            </div>
          </div>
        )}
      </main>

      {/* MODAL MODUL LATIHAN MENULIS DENGAN PENANDA VISUAL ABSOLUT & BEBAS LAG */}
      {/* MODAL MODUL LATIHAN MENULIS DENGAN PENANDA VISUAL ABSOLUT & BEBAS LAG */}
      {writingTarget && (() => {
        const getCanvasDimensions = (target: any) => {
          if (!target || !target.isWord) return { width: 256, height: 256, fontSizeClass: 'text-[10rem]', charPx: 160 }
          
          const N = target.word.length
          if (N === 2) {
            return { width: 340, height: 256, fontSizeClass: 'text-[8.5rem]', charPx: 136 }
          } else if (N === 3) {
            return { width: 400, height: 256, fontSizeClass: 'text-[6.5rem]', charPx: 104 }
          } else if (N === 4) {
            return { width: 450, height: 256, fontSizeClass: 'text-[5.5rem]', charPx: 88 }
          } else {
            return { width: 460, height: 256, fontSizeClass: 'text-[4.5rem]', charPx: 72 }
          }
        }
        
        const dims = getCanvasDimensions(writingTarget)
        const canvasWidth = dims.width
        const canvasHeight = dims.height
        const fontSizeClass = dims.fontSizeClass
        const charPx = dims.charPx

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080c08]/80 backdrop-blur-sm animate-fade-in">
            <div className={`w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 transition-all duration-300 ${
              writingTarget.isWord ? 'max-w-5xl' : 'max-w-4xl'
            }`}>
              
              {/* Close Button */}
              <button
                onClick={() => setWritingTarget(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-150 z-20"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Column: Canvas Drawing Area */}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-mono tracking-widest text-jp-gold font-bold uppercase block">
                    {writingTarget.isWord ? 'LATIHAN MENULIS KATA' : 'LATIHAN MENULIS'}
                  </span>
                  <h3 className="text-lg font-bold text-jp-tea-cream">
                    {writingTarget.isWord 
                      ? `Coret Kata "${writingTarget.word}" (${writingTarget.meaning})` 
                      : `Coret Huruf "${writingTarget.char}"`
                    }
                  </h3>
                </div>

                {/* Canvas Box Drawing Area */}
                <div 
                  className="relative bg-[#f8faf7] border border-gray-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none max-w-full"
                  style={{ 
                    width: `${canvasWidth}px`, 
                    height: `${canvasHeight}px`,
                    aspectRatio: `${canvasWidth} / ${canvasHeight}`
                  } as React.CSSProperties}
                >
                  
                  {/* Shoji Grid Background Guides */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                  
                  {/* Center partition lines */}
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-300 pointer-events-none"></div>
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-300 pointer-events-none"></div>

                  {/* Faint Tracing Character/Word Guide - Dipisah per-karakter agar posisi sejajar 100% presisi dengan stroke markers */}
                  {writingTarget.isWord ? (
                    <div className="absolute inset-0 pointer-events-none z-0 select-none">
                      {writingTarget.word.split('').map((char: string, charIdx: number) => {
                        const N = writingTarget.word.length
                        const P_char = (charPx / canvasWidth) * 100
                        const centerX = 50 + (charIdx - (N - 1) / 2) * P_char
                        
                        return (
                          <span
                            key={charIdx}
                            className={`absolute font-sans text-jp-matcha font-bold opacity-25 ${fontSizeClass}`}
                            style={{
                              left: `${centerX}%`,
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: `${charPx}px`,
                              textAlign: 'center'
                            }}
                          >
                            {char}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    <span className={`absolute select-none font-sans text-jp-matcha font-bold opacity-25 pointer-events-none z-0 ${fontSizeClass}`}>
                      {writingTarget.char}
                    </span>
                  )}

                  {/* STROKE MARKERS - Mendukung karakter tunggal & kata utuh dengan efek memudar saat menggambar */}
                  <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${isDrawing ? 'opacity-15' : 'opacity-100'}`}>
                    {writingTarget.isWord ? (
                      // Stroke markers untuk kata utuh
                      writingTarget.chars.flatMap((charItem: any, charIdx: number) => {
                        if (!charItem.strokeMarkers) return []
                        
                        const N = writingTarget.word.length
                        const P_char = (charPx / canvasWidth) * 100 // Lebar karakter dalam persen dari canvasWidth
                        
                        // Hitung pusat koordinat X dari karakter ke-charIdx (terpusat secara horizontal)
                        const centerX = 50 + (charIdx - (N - 1) / 2) * P_char
                        const centerY = 50

                        // Faktor skala horizontal & vertikal presisi berbasis resolusi database asli 256px dengan pengali 1.6
                        const scaleX = (charPx / canvasWidth) * 1.6
                        const scaleY = (charPx / 256) * 1.6

                        const numSizeClass = N >= 4 ? 'text-[8px]' : 'text-[9.5px]'
                        const arrowSizeClass = N >= 4 ? 'text-[7px]' : 'text-[8.5px]'

                        // Render penanda langkah coretan dinamis dan borderless
                        return charItem.strokeMarkers.map((marker: any, idx: number) => {
                          const targetX = centerX + (marker.x - 50) * scaleX
                          const targetY = centerY + (marker.y - 50) * scaleY

                          // Heuristic untuk menghitung sudut rotasi panah berdasarkan deskripsi teks coretan
                          const strokeStep = charItem.strokeSteps[idx] || ''
                          let angle = 0
                          const desc = strokeStep.toLowerCase()
                          if (desc.includes('vertikal') || desc.includes('ke bawah') || desc.includes('atas ke bawah')) {
                            angle = 90
                          } else if (desc.includes('miring') || desc.includes('serong') || desc.includes('kiri bawah') || desc.includes('melengkung ke kiri')) {
                            angle = 135
                          } else if (desc.includes('kanan bawah') || desc.includes('melengkung ke kanan') || desc.includes('titik') || desc.includes('coretan miring')) {
                            angle = 45
                          } else if (desc.includes('kiri ke kanan') || desc.includes('horizontal') || desc.includes('mendatar')) {
                            angle = 0
                          }

                          return (
                            <div
                              key={`w-${charIdx}-${idx}`}
                              className="absolute flex items-center gap-0.5 text-jp-matcha font-bold select-none pointer-events-none"
                              style={{
                                left: `${targetX}%`,
                                top: `${targetY}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                              title={`Karakter ${charIdx + 1}, Coretan ${idx + 1}`}
                            >
                              <span className={`font-display font-extrabold leading-none ${numSizeClass}`}>
                                {idx + 1}
                              </span>
                              <span 
                                className={`leading-none inline-block ${arrowSizeClass}`}
                                style={{
                                  transform: `rotate(${angle}deg)`,
                                }}
                              >
                                ➔
                              </span>
                            </div>
                          )
                        })
                      })
                    ) : (
                      // Stroke markers untuk karakter tunggal
                      writingTarget.strokeMarkers && writingTarget.strokeMarkers.map((marker: any, idx: number) => {
                        const strokeStep = writingTarget.strokeSteps[idx] || ''
                        let angle = 0
                        const desc = strokeStep.toLowerCase()
                        if (desc.includes('vertikal') || desc.includes('ke bawah') || desc.includes('atas ke bawah')) {
                          angle = 90
                        } else if (desc.includes('miring') || desc.includes('serong') || desc.includes('kiri bawah') || desc.includes('melengkung ke kiri')) {
                          angle = 135
                        } else if (desc.includes('kanan bawah') || desc.includes('melengkung ke kanan') || desc.includes('titik') || desc.includes('coretan miring')) {
                          angle = 45
                        } else if (desc.includes('kiri ke kanan') || desc.includes('horizontal') || desc.includes('mendatar')) {
                          angle = 0
                        }

                        return (
                          <div
                            key={idx}
                            className="absolute flex items-center gap-0.5 text-jp-matcha font-bold select-none pointer-events-none"
                            style={{
                              left: `${marker.x}%`,
                              top: `${marker.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <span 
                              className="font-display font-black text-[13px] leading-none"
                              style={{
                                textShadow: '0 0 3px #fff, 0 0 3px #fff, 0 0 3px #fff'
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span 
                              className="text-[11px] leading-none inline-block"
                              style={{
                                transform: `rotate(${angle}deg)`,
                                textShadow: '0 0 2.5px #fff, 0 0 2.5px #fff'
                              }}
                            >
                              ➔
                            </span>
                          </div>
                        )
                      })
                    )}
                  </div>
                  {/* Drawing Canvas */}
                  <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 z-10 w-full h-full cursor-crosshair touch-none bg-transparent"
                  />
                </div>

                {/* Controls */}
                <div className="flex gap-2.5 w-full max-w-[300px] mt-4">
                  <button
                    onClick={undoDrawing}
                    disabled={drawingHistory.length === 0}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 border flex items-center justify-center gap-1 active:scale-95 ${
                      drawingHistory.length > 0
                        ? 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:text-jp-matcha shadow-xs'
                        : 'border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed'
                    }`}
                    title="Urungkan coretan terakhir"
                  >
                    ↩️ Undo
                  </button>
                  <button
                    onClick={clearCanvas}
                    disabled={!hasDrawn}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 border flex items-center justify-center gap-1 active:scale-95 ${
                      hasDrawn
                        ? 'border-red-100 text-red-600 bg-red-50/30 hover:bg-red-50 hover:border-red-200 shadow-xs'
                        : 'border-gray-150 text-gray-300 bg-gray-50/50 cursor-not-allowed'
                    }`}
                    title="Hapus semua coretan"
                  >
                    🗑️ Hapus
                  </button>
                  <button
                    onClick={handleFinishWriting}
                    disabled={!hasDrawn}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 ${
                      hasDrawn 
                        ? 'bg-jp-matcha hover:bg-jp-matcha-hover text-white shadow-xs' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    ✅ Selesai
                  </button>
                </div>
              </div>

              {/* Right Column: Stroke Order Guide (Tata Cara Menulis) */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-5 md:pt-0 md:pl-6 flex flex-col justify-center">
                <span className="text-[10px] font-mono tracking-widest text-jp-matcha font-bold uppercase block mb-1">
                  TATA CARA PENULISAN (STROKE ORDER)
                </span>
                <h4 className="text-sm font-bold text-jp-tea-cream mb-3">
                  {writingTarget.isWord 
                    ? `Urutan Coretan Kata "${writingTarget.word}" (${writingTarget.romaji}):`
                    : `Urutan Goresan Huruf "${writingTarget.char}" (${writingTarget.romaji}):`
                  }
                </h4>
                
                {writingTarget.isWord ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {writingTarget.chars.map((charItem: any, cIdx: number) => (
                      <div key={cIdx} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <h5 className="text-[11px] font-bold text-jp-matcha mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-jp-matcha inline-block"></span>
                          Karakter {cIdx + 1}: {charItem.char} ({charItem.romaji})
                        </h5>
                        <div className="space-y-1.5">
                          {charItem.strokeSteps.map((step: string, sIdx: number) => (
                            <div key={sIdx} className="flex gap-2.5 items-start text-xs leading-relaxed text-gray-700 bg-[#f8faf7] p-2 rounded-lg border border-gray-150">
                              <span className="w-4.5 h-4.5 rounded-full bg-jp-matcha text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>

                        {/* Visual Step-by-Step Stroke Guide Grid */}
                        {charItem.strokeMarkers && charItem.strokeMarkers.length > 0 && (
                          <div className="mt-3">
                            <span className="text-[9px] font-mono tracking-wider text-gray-400 font-bold uppercase block mb-2">
                              BENTUK LANGKAH DEMI LANGKAH:
                            </span>
                            <div className="grid grid-cols-4 gap-2">
                              {Array.from({ length: charItem.strokeMarkers.length }).map((_, stepIdx) => {
                                return (
                                  <div key={stepIdx} className="flex flex-col items-center">
                                    <div className="relative w-12 h-12 bg-[#fcfdfc] border border-gray-150 rounded-lg overflow-hidden flex items-center justify-center select-none">
                                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none"></div>
                                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-150 pointer-events-none"></div>
                                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-150 pointer-events-none"></div>
                                      
                                      <span className="absolute font-sans text-gray-250 font-bold text-xl pointer-events-none z-0 opacity-20">
                                        {charItem.char}
                                      </span>
                                      
                                      {charItem.strokeMarkers.slice(0, stepIdx + 1).map((marker: any, idx: number) => {
                                        const isActive = idx === stepIdx
                                        const strokeStep = charItem.strokeSteps[idx] || ''
                                        let angle = 0
                                        const desc = strokeStep.toLowerCase()
                                        if (desc.includes('vertikal') || desc.includes('ke bawah') || desc.includes('atas ke bawah')) {
                                          angle = 90
                                        } else if (desc.includes('miring') || desc.includes('serong') || desc.includes('kiri bawah') || desc.includes('melengkung ke kiri')) {
                                          angle = 135
                                        } else if (desc.includes('kanan bawah') || desc.includes('melengkung ke kanan') || desc.includes('titik') || desc.includes('coretan miring')) {
                                          angle = 45
                                        } else if (desc.includes('kiri ke kanan') || desc.includes('horizontal') || desc.includes('mendatar')) {
                                          angle = 0
                                        }
                                        
                                        return (
                                          <div
                                            key={idx}
                                            className="absolute flex items-center gap-0.5 font-bold select-none pointer-events-none"
                                            style={{
                                              left: `${marker.x}%`,
                                              top: `${marker.y}%`,
                                              transform: 'translate(-50%, -50%)',
                                            }}
                                          >
                                            <span 
                                              className={`font-display font-black text-[7.5px] leading-none ${isActive ? 'text-jp-matcha animate-pulse z-10' : 'text-gray-400 z-0'}`}
                                              style={{
                                                textShadow: '0 0 1px #fff, 0 0 1px #fff, 0 0 1px #fff'
                                              }}
                                            >
                                              {idx + 1}
                                            </span>
                                            <span 
                                              className={`text-[6.5px] leading-none inline-block ${isActive ? 'text-jp-matcha animate-pulse z-10' : 'text-gray-400 z-0'}`}
                                              style={{
                                                transform: `rotate(${angle}deg)`,
                                                textShadow: '0 0 1px #fff, 0 0 1px #fff'
                                              }}
                                            >
                                              ➔
                                            </span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-400 mt-0.5">Langkah {stepIdx + 1}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2.5">
                      {writingTarget.strokeSteps.map((step: any, idx: number) => (
                        <div key={idx} className="flex gap-2.5 items-start text-xs leading-relaxed text-gray-700 bg-[#f8faf7] p-2.5 rounded-lg border border-gray-150">
                          <span className="w-5 h-5 rounded-full bg-jp-matcha text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Visual Step-by-Step Stroke Guide Grid */}
                    {writingTarget.strokeMarkers && writingTarget.strokeMarkers.length > 0 && (
                      <div className="mt-4 border-t border-gray-150 pt-4">
                        <span className="text-[10px] font-mono tracking-widest text-jp-matcha font-bold uppercase block mb-3">
                          BENTUK LANGKAH DEMI LANGKAH:
                        </span>
                        <div className="grid grid-cols-4 gap-3">
                          {Array.from({ length: writingTarget.strokeMarkers.length }).map((_, stepIdx) => {
                            return (
                              <div key={stepIdx} className="flex flex-col items-center">
                                <div className="relative w-16 h-16 bg-[#fcfdfc] border border-gray-150 rounded-xl overflow-hidden flex items-center justify-center select-none shadow-2xs">
                                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none"></div>
                                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-150 pointer-events-none"></div>
                                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-150 pointer-events-none"></div>
                                  
                                  <span className="absolute font-sans text-gray-250 font-bold text-3xl pointer-events-none z-0 opacity-20">
                                    {writingTarget.char}
                                  </span>
                                  
                                  {writingTarget.strokeMarkers.slice(0, stepIdx + 1).map((marker: any, idx: number) => {
                                    const isActive = idx === stepIdx
                                    const strokeStep = writingTarget.strokeSteps[idx] || ''
                                    let angle = 0
                                    const desc = strokeStep.toLowerCase()
                                    if (desc.includes('vertikal') || desc.includes('ke bawah') || desc.includes('atas ke bawah')) {
                                      angle = 90
                                    } else if (desc.includes('miring') || desc.includes('serong') || desc.includes('kiri bawah') || desc.includes('melengkung ke kiri')) {
                                      angle = 135
                                    } else if (desc.includes('kanan bawah') || desc.includes('melengkung ke kanan') || desc.includes('titik') || desc.includes('coretan miring')) {
                                      angle = 45
                                    } else if (desc.includes('kiri ke kanan') || desc.includes('horizontal') || desc.includes('mendatar')) {
                                      angle = 0
                                    }
                                    
                                    return (
                                      <div
                                        key={idx}
                                        className="absolute flex items-center gap-0.5 font-bold select-none pointer-events-none"
                                        style={{
                                          left: `${marker.x}%`,
                                          top: `${marker.y}%`,
                                          transform: 'translate(-50%, -50%)',
                                        }}
                                      >
                                        <span 
                                          className={`font-display font-black text-[9.5px] leading-none ${isActive ? 'text-jp-matcha animate-pulse z-10' : 'text-gray-400 z-0'}`}
                                          style={{
                                            textShadow: '0 0 1.5px #fff, 0 0 1.5px #fff, 0 0 1.5px #fff'
                                          }}
                                        >
                                          {idx + 1}
                                        </span>
                                        <span 
                                          className={`text-[8.5px] leading-none inline-block ${isActive ? 'text-jp-matcha animate-pulse z-10' : 'text-gray-400 z-0'}`}
                                          style={{
                                            transform: `rotate(${angle}deg)`,
                                            textShadow: '0 0 1.5px #fff, 0 0 1.5px #fff'
                                          }}
                                        >
                                          ➔
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 mt-1">Langkah {stepIdx + 1}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-4 text-[10px] text-gray-500 italic bg-amber-50/50 border border-amber-200/50 p-2.5 rounded-lg">
                  {writingTarget.isWord
                    ? '✍️ Tulislah masing-masing karakter pembentuk kata di atas kanvas secara bergantian, ikuti petunjuk urutan coretan aksara di atas.'
                    : '✍️ Mulailah goresan pada titik angka hijau di kanvas, ikuti petunjuk urutan cara menulis di atas secara runtut.'
                  }
                </div>
              </div>

            </div>
          </div>
        )
      })()}

      {/* POPUP MODAL DETAIL KOSA KATA LEBIH BANYAK (Dengan data lebih melimpah & Coretan Anda) */}
      {vocabTarget && (() => {
        const userDrawing = savedDrawings[vocabTarget.id]
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080c08]/80 backdrop-blur-sm animate-fade-in">
            <div className={`w-full bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl relative transition-all duration-300 ${
              userDrawing ? 'max-w-2xl' : 'max-w-md'
            }`}>
              
              {/* Close Button */}
              <button
                onClick={() => setVocabTarget(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-150 z-20"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-5 border-b border-gray-100 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-jp-matcha font-bold uppercase block mb-1">
                  DAFTAR KOSA KATA CONTOH
                </span>
                <h3 className="text-2xl font-bold text-jp-tea-cream flex items-center justify-center gap-2">
                  Aksara <span className="text-jp-matcha font-extrabold font-sans text-3xl">{vocabTarget.char}</span> ({vocabTarget.romaji})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Daftar lengkap kosakata contoh yang menggunakan karakter "{vocabTarget.char}".
                </p>
              </div>

              {/* Content Layout: Split jika coretan tersimpan */}
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Left Column: Coretan Pengguna (Hanya jika ada) */}
                {userDrawing && (
                  <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-5 md:pb-0 md:pr-6">
                    <span className="text-[10px] font-mono tracking-widest text-jp-gold font-bold uppercase block mb-2.5">
                      CORETAN ANDA
                    </span>
                    
                    <div className="relative w-44 h-44 bg-[#f8faf7] border border-gray-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none">
                      {/* Shoji Grid Background Guides */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none"></div>
                      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-200 pointer-events-none"></div>
                      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-200 pointer-events-none"></div>
                      
                      {/* Tracing character outline overlay under drawing */}
                      <span className="absolute select-none font-sans text-jp-matcha font-bold opacity-10 text-[7rem] pointer-events-none z-0">
                        {vocabTarget.char}
                      </span>

                      {/* Saved user stroke base64 img */}
                      <img 
                        src={userDrawing} 
                        alt="Coretan Anda" 
                        className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" 
                      />
                    </div>
                    
                    <p className="text-[10px] text-gray-400 mt-2.5 italic text-center max-w-[200px] leading-normal">
                      Bandingkan tulisan tangan Anda dengan kosakata di samping.
                    </p>
                  </div>
                )}

                {/* Right Column: Daftar Kosa Kata */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                    {vocabTarget.examples.map((ex, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleDirectToVocabAndWrite(ex)}
                        className="p-3 bg-[#f8faf7] hover:bg-[#edf3eb] border border-gray-150 hover:border-jp-matcha/40 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow"
                        title="Klik untuk lihat di Kamus & Latih Menulis Kata ini"
                      >
                        <div>
                          <span className="text-sm font-bold text-jp-tea-cream block">{ex.word}</span>
                          <span className="text-[10px] text-gray-500 font-medium">Lafal: {ex.romaji}</span>
                        </div>
                        <div className="text-right text-[11px] font-bold text-jp-matcha bg-jp-matcha/5 border border-jp-matcha/10 px-2 py-0.5 rounded-md">
                          {ex.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footnote */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <button
                  onClick={() => setVocabTarget(null)}
                  className="px-6 py-2 bg-jp-matcha hover:bg-jp-matcha-hover text-white text-xs font-bold rounded-lg transition-all duration-150 shadow-sm"
                >
                  Tutup Detail
                </button>
              </div>

            </div>
          </div>
        )
      })()}

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1dad0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default App
