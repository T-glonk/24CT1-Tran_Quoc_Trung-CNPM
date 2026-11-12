// Utility xử lý thời gian thực cho ứng dụng đặt sân QT Sport

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Lấy chuỗi DD/MM/YYYY của một Date (mặc định là hôm nay)
 */
export const formatDateToVN = (d = new Date()) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Lấy chuỗi DD/MM của một Date
 */
export const formatDateToShort = (d = new Date()) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

/**
 * Lấy tên viết tắt thứ trong tuần (T2, T3, ..., CN)
 */
export const getDayOfWeekShort = (d = new Date()) => {
  return DAY_NAMES[d.getDay()];
};

/**
 * Lấy ngày hôm nay định dạng DD/MM/YYYY
 */
export const getTodayDateStr = () => {
  return formatDateToVN(new Date());
};

/**
 * Sinh danh sách ngày đặt sân linh hoạt bắt đầu từ ngày hôm nay (mặc định 21 ngày)
 */
export const generateBookingDays = (count = 21) => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dateStr = formatDateToVN(d);
    const shortStr = formatDateToShort(d);
    const dayOfWeek = getDayOfWeekShort(d);

    days.push({
      date: dateStr,
      displayDate: shortStr,
      day: i === 0 ? 'Hôm nay' : dayOfWeek,
      rawDayOfWeek: dayOfWeek,
      isToday: i === 0,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      fullDate: d,
    });
  }

  return days;
};

/**
 * Kiểm tra xem một khung giờ cụ thể (slotHour) vào ngày (dateStr dạng DD/MM/YYYY)
 * đã trôi qua so với thời gian thực tế hiện tại (new Date()) hay chưa.
 * 
 * Ví dụ: Bây giờ là 7h30 ngày 12/11/2026:
 * - Khung 7:00 ngày 12/11/2026 -> Đã qua 7h00 -> returns true (Khoá/Không cho đặt)
 * - Khung 8:00 ngày 12/11/2026 -> Chưa tới 8h00 -> returns false (Cho phép đặt)
 * - Khung bất kỳ của ngày hôm qua (11/11/2026) -> returns true (Tất cả đã qua)
 * - Khung bất kỳ của ngày mai (13/11/2026) -> returns false (Chưa tới)
 */
export const isPastSlot = (dateStr, slotHour) => {
  if (!dateStr) return false;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const now = new Date();
  
  // Thời điểm bắt đầu của slot: ngày đó lúc slotHour:00:00
  const slotStartTime = new Date(year, month, day, slotHour, 0, 0);

  // Nếu slotStartTime <= now thì khung giờ này đã hoặc đang trôi qua so với thời điểm thực tế
  return slotStartTime <= now;
};

/**
 * Hiển thị tiêu đề tháng/năm dựa trên ngày được chọn (dạng "Tháng 11, 2026")
 */
export const getMonthYearDisplay = (dateStr) => {
  if (!dateStr) {
    const now = new Date();
    return `Tháng ${now.getMonth() + 1}, ${now.getFullYear()}`;
  }
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `Tháng ${parseInt(parts[1], 10)}, ${parts[2]}`;
  }
  return dateStr;
};
