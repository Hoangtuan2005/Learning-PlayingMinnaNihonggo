export interface JapaneseRealm {
  id: string;
  name: string;
  jpName: string;
  icon: string;
  file: string;
  targetScale: number;
  initialPos: { x: number; y: number; z: number };
  maxRadius: number;
  description: string;
}

export const JAPANESE_REALMS: JapaneseRealm[] = [
  {
    id: 'kyoto',
    name: 'Phố Cổ Kyoto',
    jpName: '京都の古い町',
    icon: '🏮',
    file: '/kyoto_japan.glb',
    targetScale: 36,
    initialPos: { x: -2.0, y: 6.69, z: -3.0 },
    maxRadius: 15.5,
    description: 'Khu phố Machiya truyền thống, quán trà và hoa anh đào nở rộ',
  },
  {
    id: 'retro_pavilion',
    name: 'Hồ Thủy Tạ & Cầu Gỗ',
    jpName: '池のパビリオン',
    icon: '🏯',
    file: '/retro_pavilion.glb',
    targetScale: 28,
    initialPos: { x: 3.5, y: 3.91, z: 2.0 },
    maxRadius: 12.0,
    description: 'Thủy tạ gỗ ngắm cảnh, cầu bắc qua hồ sen & rặng liễu rủ',
  },
  {
    id: 'bonsai_garden',
    name: 'Vườn Bonsai & Đền Zen',
    jpName: '盆栽の庭',
    icon: '⛩️',
    file: '/bonsai_garden.glb',
    targetScale: 32,
    initialPos: { x: 0.0, y: 13.0, z: -4.0 },
    maxRadius: 14.0,
    description: 'Vườn cây Bonsai cổ thụ, đá phong thủy và thềm đền Thần đạo',
  },
];
