export interface DeliveryZone {
  id: string;
  name: string;
  icon: string;
  estimatedTime: string;
  deliveryFee: number;
  available: boolean;
  areas: string[];
}

export const deliveryZones: DeliveryZone[] = [
  {
    id: 'inside-ringroad',
    name: 'Inside Ring Road',
    icon: '🏙️',
    estimatedTime: '1-2 hours',
    deliveryFee: 0,
    available: true,
    areas: [
      'Thamel', 'Durbar Marg', 'New Road', 'Asan', 'Indrachowk',
      'Ratna Park', 'Putalisadak', 'Kamaladi', 'Baneshwor',
      'Battisputali', 'New Baneshwor', 'Thapathali', 'Kupondole',
      'Dilli Bazaar', 'Maitighar', 'Lazimpat'
    ]
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu (Outside Ring Road)',
    icon: '🌆',
    estimatedTime: '2-3 hours',
    deliveryFee: 150,
    available: true,
    areas: [
      'Balaju', 'Swayambhu', 'Kalanki', 'Kirtipur', 'Gongabu',
      'Balkhu', 'Matatirtha', 'Tokha', 'Budhanilkantha',
      'Shivapuri', 'Thankot', 'Chandragiri', 'Sitapaila',
      'Chabahil', 'Jorpati', 'Boudha', 'Lalitpur Gate'
    ]
  },
  {
    id: 'lalitpur',
    name: 'Lalitpur',
    icon: '🏛️',
    estimatedTime: '2-3 hours',
    deliveryFee: 100,
    available: true,
    areas: [
      'Jawalakhel', 'Patan Durbar Square', 'Lagankhel',
      'Mangal Bazaar', 'Satdobato', 'Ekantakuna', 'Thankot',
      'Pulchowk', 'Godavari', 'Imadol', 'Mahalaxmi',
      'Khumaltar', 'Patan (Old)', 'Sanepa', 'Balkumari'
    ]
  },
  {
    id: 'bhaktapur',
    name: 'Bhaktapur',
    icon: '🏺',
    estimatedTime: '3-4 hours',
    deliveryFee: 200,
    available: true,
    areas: [
      'Bhaktapur Durbar Square', 'Taumadhi Square',
      'Dattatreya Square', 'Pottery Square', 'Suryamadhhi',
      'Lokanthali', 'Thimi', 'Madhyapur Thimi', 'Balkumari',
      'Nagadesh', 'Chyamasingh', 'Jhaukhel', 'Sipadol'
    ]
  }
];
