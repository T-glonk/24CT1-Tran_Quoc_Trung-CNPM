// ─── SERVICES & INVENTORY SEED DATA ─────────────────────────────────────────

const INITIAL_SERVICES = [
  { id: 's1', name: 'Nước khoáng Aquafina (500ml)', category: 'Nước uống', price: 10000, cost: 5000, stock: 120, unit: 'Chai', icon: '💧' },
  { id: 's2', name: 'Nước điện giải Revive bù khoáng', category: 'Nước uống', price: 15000, cost: 8000, stock: 85, unit: 'Chai', icon: '🍋' },
  { id: 's3', name: 'Pocari Sweat ion supply', category: 'Nước uống', price: 20000, cost: 12000, stock: 45, unit: 'Chai', icon: '🥤' },
  { id: 's4', name: 'Bò húc RedBull / Rockstar', category: 'Nước uống', price: 20000, cost: 12000, stock: 32, unit: 'Lon', icon: '⚡' },
  { id: 's5', name: 'Ống cầu lông Hải Yến S90 (12 quả)', category: 'Phụ Kiện', price: 240000, cost: 195000, stock: 18, unit: 'Ống', icon: '🏸' },
  { id: 's6', name: 'Ống cầu lông Yonex AS-40', category: 'Phụ Kiện', price: 420000, cost: 350000, stock: 6, unit: 'Ống', icon: '🏸' },
  { id: 's7', name: 'Thuê vợt Yonex Astrox (1 lượt)', category: 'Cho thuê', price: 30000, cost: 0, stock: 15, unit: 'Cây/lượt', icon: '🏸' },
  { id: 's8', name: 'Thuê máy bắn bóng PP-Smart Pro (Giờ)', category: 'Dịch vụ', price: 60000, cost: 0, stock: 3, unit: 'Giờ', icon: '🤖' },
  { id: 's9', name: 'Thuê giày cầu lông (kèm tất sạch)', category: 'Cho thuê', price: 30000, cost: 5000, stock: 20, unit: 'Đôi/lượt', icon: '👟' },
  { id: 's10', name: 'Dịch vụ căng cước vợt 4 nút chuẩn BWF', category: 'Dịch vụ', price: 80000, cost: 40000, stock: 999, unit: 'Lần', icon: '🔧' },
  { id: 's11', name: 'Quấn cán vợt VS Grip chống mồ hôi', category: 'Phụ Kiện', price: 15000, cost: 7000, stock: 65, unit: 'Cái', icon: '🎗️' },
];

module.exports = { INITIAL_SERVICES };
