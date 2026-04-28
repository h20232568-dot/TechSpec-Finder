import { Device } from './types';

export const MOCK_DEVICES: Device[] = [
  {
    id: 'lumina-x-pro',
    name: '루미나 X 프로',
    brand: 'Lumina',
    year: 2024,
    price: 999,
    display: '6.7인치 LTPO OLED',
    displaySize: 6.7,
    battery: 5000,
    weight: 221,
    chipset: '바이오닉 A17 칩셋',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpii39wC5t_mrU3985gfHnWy-7M7FvjB8m34jYsQ3miVtljfStht8ByaZYpBjeLuy3y7u_0De_kKYzjDfFCpDqQzY567XDa3Yq2jgH3NUk7DoBuAmf1LGK9MWk-ZW9HBoObKuf_nluOxJXMN-cBhpoEEzf3O39zqawHVqjBux-iweLx8Hhfj4IwutuLUIx0ZW0pN-XMhpUYVPHEGuRdQ1-sYviDLdPTnIi55tWFoxzpVOyTXwvdOoaizU2-I7SCC2A1TcQ3csrAVY',
    rating: 4.8,
    score: 98,
    os: 'Android',
    category: 'Premium',
    description: '비교할 수 없는 성능과 디스플레이 기술을 갖춘 궁극의 전문가용 기기입니다.',
    tags: ['에디터 추천', '컴팩트 플래그십']
  },
  {
    id: 'nebula-s24-ultra',
    name: '네뷸라 S24 울트라',
    brand: 'Nebula',
    year: 2024,
    price: 1199,
    display: '6.8인치 Dynamic AMOLED',
    displaySize: 6.8,
    battery: 5000,
    weight: 232,
    chipset: '스냅드래곤 8 Gen 3',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA48GchPHzvRyKbUH2WGY-4TDnt-YKgRiJeHJQ72RyGy6K7UIaQ74rYuzGQ0_-KjhLb3kVmgfBBZ5VKyaJ1H-HqTedMDK6wiO3T_DMAPHJyaEC7utQ9283xyWmZPHIBKoaZANq5Zh-0QgyHV2wTBCAlKJXv4AG8RQK_znNqQOINc8sztkOC0dvCGjnz68BKSfz0yqlmTON3Jc0WiRVcQmW0J7_iyuTRDbt3s87UQ4kZKZ2Cyqc-7pN0B0FXkJXhN19S_tRfbOFF8Zg',
    rating: 4.9,
    score: 95,
    os: 'Android',
    category: 'Premium',
    description: '생산성을 위한 최고의 선택, 티타늄 바디와 AI 기능을 경험하세요.',
    tags: ['대용량 배터리']
  },
  {
    id: 'velo-lite-12',
    name: 'Velo Lite 12',
    brand: 'Velo',
    year: 2023,
    price: 549,
    display: '6.1인치 OLED',
    displaySize: 6.1,
    battery: 4500,
    weight: 185,
    chipset: 'Dimensity 9200',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzBwUlAcZfDrblXq881iPeymwxhehS0K1wRM_eFXTqtphtFwrIXh7RaQVUP4phJ71Qp7XqCiwutZyq6Zqk9i2o3MKZ6rdgFX5LWtzfPgJFFtfsb7f46AXrxm1SFa6p1jpNw6WgVjQh910QqMh9Rt9vHAZ0f-TTLwb86CUjrfRBD__C2lYwCGTXdyf2kjTqDXxxiRY_HKHDSL9fndnYpNWhr410-LX9DwT2wAmVprEgdyjBzX5NrDqKwGGDSgtIHS3PWGKAzC8MLUo',
    rating: 4.5,
    score: 82,
    os: 'Android',
    category: 'Value',
    description: '가벼운 무게와 강력한 성능의 조화, 합리적인 프리미엄 폰입니다.',
    tags: ['가벼운 무게', '가성비 5G']
  }
];

export const CHAT_SUGGESTIONS: Device[] = [
  {
    id: 'galaxy-a54',
    name: 'Galaxy A54 5G',
    brand: 'Samsung',
    year: 2023,
    price: 495000,
    display: '6.4인치 Super AMOLED',
    displaySize: 6.4,
    battery: 5000,
    weight: 202,
    chipset: 'Exynos 1380',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc9ZorNbTHl8_BnRYoTV3-o9PtqpQPkXHThRWQie2AyE2Mw1IprWKw-R78SAXdL4WpTSBlXMNakkeGcPT7NZWoT_CzGPGugElhOmJLrQOkwgchAVOQYMgEcRbmDKqbJNaoMtTlnoTliTIinXBL3I9j1MqfockuDxNxR3DHgvs5nV1QWDagC02QDrg3odSgjQ0VbTn5OGaYYAG8HKc53HwKhIShmsaCbyiGfHCYGYCH43UV2fINehfhduNJRO9rOqtnt2rOjuW0ufo',
    os: 'Android'
  },
  {
    id: 'redmi-note-12',
    name: 'Redmi Note 12 Pro',
    brand: 'Xiaomi',
    year: 2023,
    price: 382000,
    display: '6.67인치 OLED',
    displaySize: 6.67,
    battery: 5000,
    weight: 187,
    chipset: 'Dimensity 1080',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7bNRE9YUH0Dgc40EfHmcQD4RofhiDYwWerFHD_1JDDHWKf-LAtPGcbsHNNMgOIDgtFm_9DwT6SuJghYWd6x_xZARswmqrY84c9eXiRnb6GKx-JXX9b1ljrH7gB3F0_AIs-VLZpcDOMVQY2W6HHVBPlf-wCF3Xswyc__FbW8mMB13kMDZLaLnOOFekLcsscBHhH7RglnargxEuylKSHQ2q_-dZvCfbwue4TFXLp3W9Z1EeBpOyLcqXDf00lXZ4UIaSgGg0LtQWArQ',
    os: 'Android'
  },
  {
    id: 'nothing-phone-1',
    name: 'Nothing Phone (1)',
    brand: 'Nothing',
    year: 2022,
    price: 529000,
    display: '6.55인치 OLED',
    displaySize: 6.55,
    battery: 4500,
    weight: 193,
    chipset: 'Snapdragon 778G+',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCfiEXisa6FX0M4rZnK4MBAE0rEgxBbmcPOy6a3t7jGx5PQoOf9ZCftEBdsvhRoXpB_tqzfHWTqCLL2hNo7n0PnldeZHyqe71SugHhCz_Pw_xkb26ALZj1M2BmQBK7ZUfHVIdUBkSDUi5qIreUc944QS6XSG2Iiiiui8Qyy4EyhzFTg0acT4u2jlqa8n_W0HGAO2CArsHFVLDZeUyugoe14-BGzKWtdT8AM8yPp6Eh5Eg57oPBBIm27KaZc6G23oxgvApaIus4MV0',
    os: 'Android'
  }
];
