// ============================================================================
// FIGMA PLUGIN: BƯỚC 4 - PROTOTYPE BẢN MẪU TƯƠNG TÁC (APP BOOKING SÂN CẦU LÔNG)
// Thiết kế 7 màn hình chức năng & Tự động nối các mũi tên tương tác từ Trang Chủ
// Đề tài: ALOBO SPORT / QT SPORT (24CT1 - Trần Quốc Trung)
// ============================================================================

async function run() {
  try {
    // 1. Tải font chữ chuẩn Figma
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });

    const cWhite = { r: 1, g: 1, b: 1 };
    const cBlack = { r: 0.08, g: 0.08, b: 0.08 };
    const cGrayDark = { r: 0.35, g: 0.38, b: 0.42 };
    const cGrayLight = { r: 0.95, g: 0.96, b: 0.98 };
    const cStroke = { r: 0.2, g: 0.2, b: 0.2 };
    const cStrokeSubtle = { r: 0.82, g: 0.84, b: 0.86 };
    const cBlueLink = { r: 0.15, g: 0.39, b: 0.92 };
    const cGreenSuccess = { r: 0.09, g: 0.64, b: 0.29 };

    function makeText(str, size = 11, bold = false, color = cBlack) {
      const t = figma.createText();
      t.fontName = { family: "Inter", style: bold ? "Bold" : "Regular" };
      t.characters = str;
      t.fontSize = size;
      t.fills = [{ type: "SOLID", color: color }];
      return t;
    }

    function makeRect(x, y, w, h, radius = 0, strokeW = 1, fill = cWhite, strokeC = cStroke) {
      const r = figma.createRectangle();
      r.x = x;
      r.y = y;
      r.resize(w, h);
      r.cornerRadius = radius;
      r.fills = fill ? [{ type: "SOLID", color: fill }] : [];
      if (strokeW > 0) {
        r.strokes = [{ type: "SOLID", color: strokeC }];
        r.strokeWeight = strokeW;
      } else {
        r.strokes = [];
      }
      return r;
    }

    function createPhoneBase(name, x, y, titleLabel) {
      const p = figma.createFrame();
      p.name = name;
      p.resize(390, 844);
      p.x = x;
      p.y = y;
      p.cornerRadius = 40;
      p.clipsContent = true;
      p.fills = [{ type: "SOLID", color: cWhite }];
      p.strokes = [{ type: "SOLID", color: cBlack }];
      p.strokeWeight = 3;

      // Header Tag bên ngoài
      const tag = makeRect(x, y - 36, 390, 28, 6, 1, { r: 0.9, g: 0.94, b: 1 }, cBlueLink);
      tag.name = `Label_${name}`;
      const tagT = makeText(titleLabel, 11, true, cBlueLink);
      tagT.x = x + 12;
      tagT.y = y - 30;

      // Status Bar
      const sbTime = makeText("8:35", 11, true, cBlack);
      sbTime.x = 24;
      sbTime.y = 14;
      p.appendChild(sbTime);

      const sbPunch = figma.createEllipse();
      sbPunch.resize(14, 14);
      sbPunch.x = 188;
      sbPunch.y = 12;
      sbPunch.fills = [{ type: "SOLID", color: cBlack }];
      p.appendChild(sbPunch);

      const sbIcons = makeText("[5G] [Pin]", 11, true, cBlack);
      sbIcons.x = 315;
      sbIcons.y = 14;
      p.appendChild(sbIcons);

      // Home indicator
      const ind = makeRect(130, 830, 130, 4, 2, 0, cBlack, cBlack);
      p.appendChild(ind);

      return p;
    }

    // =========================================================================
    // 1. MÀN HÌNH 1: TRANG CHỦ (HomeScreen) - Đặt ở tọa độ trung tâm (X: 550, Y: 500)
    // =========================================================================
    const scrHome = createPhoneBase("01_HomeScreen", 550, 500, "[MÀN HÌNH 1]: TRANG CHỦ USER (HomeScreen)");

    // Header
    const hBox = makeRect(16, 42, 358, 54, 8, 1, cWhite, cStroke);
    scrHome.appendChild(hBox);
    const av = figma.createEllipse();
    av.resize(38, 38);
    av.x = 24; av.y = 50;
    av.fills = [{ type: "SOLID", color: cGrayLight }];
    av.strokes = [{ type: "SOLID", color: cStroke }];
    scrHome.appendChild(av);
    const avT = makeText("[Avatar]", 8, true, cGrayDark);
    avT.x = 26; avT.y = 62;
    scrHome.appendChild(avT);

    const hDate = makeText("QT SPORT · Thứ năm, 29/10/2026", 9, false, cGrayDark);
    hDate.x = 70; hDate.y = 52;
    scrHome.appendChild(hDate);
    const hName = makeText("h0210", 14, true, cBlack);
    hName.x = 70; hName.y = 68;
    scrHome.appendChild(hName);

    const btnPin = figma.createEllipse();
    btnPin.resize(30, 30); btnPin.x = 294; btnPin.y = 54;
    btnPin.fills = [{ type: "SOLID", color: cWhite }];
    btnPin.strokes = [{ type: "SOLID", color: cStroke }];
    scrHome.appendChild(btnPin);
    const pinT = makeText("[Ghim]", 7.5, true, cBlack);
    pinT.x = 296; pinT.y = 62;
    scrHome.appendChild(pinT);

    const btnBell = figma.createEllipse();
    btnBell.resize(30, 30); btnBell.x = 334; btnBell.y = 54;
    btnBell.fills = [{ type: "SOLID", color: cWhite }];
    btnBell.strokes = [{ type: "SOLID", color: cStroke }];
    scrHome.appendChild(btnBell);
    const bellT = makeText("[Chuông]", 7, true, cBlack);
    bellT.x = 335; bellT.y = 62;
    scrHome.appendChild(bellT);

    // Search
    const sInput = makeRect(16, 104, 308, 38, 19, 1.2, cWhite, cStroke);
    scrHome.appendChild(sInput);
    const sPlace = makeText("  [ Ô nhập: Tìm theo cơ sở, quận, tên sân... ]", 10.5, false, cGrayDark);
    sPlace.x = 26; sPlace.y = 115;
    scrHome.appendChild(sPlace);

    const btnFil = figma.createEllipse();
    btnFil.resize(38, 38); btnFil.x = 336; btnFil.y = 104;
    btnFil.fills = [{ type: "SOLID", color: cWhite }];
    btnFil.strokes = [{ type: "SOLID", color: cStroke }];
    scrHome.appendChild(btnFil);
    const filT = makeText("[Lọc]", 9, true, cBlack);
    filT.x = 344; filT.y = 116;
    scrHome.appendChild(filT);

    // 4 Quick Actions
    const qaItems = [
      { label: "[Đặt sân nhanh]", x: 16, w: 84 },
      { label: "[Bản đồ sân]", x: 106, w: 84 },
      { label: "[Lịch của tôi]", x: 196, w: 86 },
      { label: "[Yêu thích]", x: 288, w: 86 }
    ];
    qaItems.forEach(item => {
      const q = makeRect(item.x, 150, item.w, 44, 8, 1, cWhite, cStroke);
      scrHome.appendChild(q);
      const qT = makeText(item.label, 9, true, cBlack);
      qT.x = item.x + (item.w - qT.width) / 2;
      qT.y = 164;
      scrHome.appendChild(qT);
    });

    // Banner
    const bnr = makeRect(16, 204, 358, 86, 12, 1.5, cWhite, cStroke);
    scrHome.appendChild(bnr);
    const bTag = makeRect(26, 212, 180, 18, 9, 1, cGrayLight, cStroke);
    scrHome.appendChild(bTag);
    const bTagT = makeText("[HỆ THỐNG SÂN CHUẨN THI ĐẤU]", 8.5, true, cBlack);
    bTagT.x = 32; bTagT.y = 215;
    scrHome.appendChild(bTagT);
    const bTitle = makeText("ALOBO SPORT", 13, true, cBlack);
    bTitle.x = 26; bTitle.y = 234;
    scrHome.appendChild(bTitle);
    const bSub = makeText("HỆ THỐNG QT SPORT (CƠ SỞ 1 - 8)", 10.5, true, cBlack);
    bSub.x = 26; bSub.y = 252;
    scrHome.appendChild(bSub);
    const bDesc = makeText("Thảm BWF tiêu chuẩn quốc tế · Đặt lịch linh hoạt 24/7", 9, false, cGrayDark);
    bDesc.x = 26; bDesc.y = 269;
    scrHome.appendChild(bDesc);

    // Mini Map
    const mMap = makeRect(16, 298, 358, 152, 12, 1.5, cWhite, cStroke);
    scrHome.appendChild(mMap);
    const mMapT = makeText("[Bản Đồ Sân Cầu Lông]", 11, true, cBlack);
    mMapT.x = 26; mMapT.y = 306;
    scrHome.appendChild(mMapT);
    const mExp = makeRect(248, 304, 116, 20, 10, 1, cWhite, cStroke);
    scrHome.appendChild(mExp);
    const mExpT = makeText("[Mở toàn màn hình ↗]", 8.5, true, cBlack);
    mExpT.x = 252; mExpT.y = 308;
    scrHome.appendChild(mExpT);

    const mCanv = makeRect(26, 330, 338, 76, 6, 1, cGrayLight, cStrokeSubtle);
    scrHome.appendChild(mCanv);
    const mCanvT1 = makeText("[ X - BẢN ĐỒ MINI ]", 10, true, cBlack);
    mCanvT1.x = 135; mCanvT1.y = 340;
    scrHome.appendChild(mCanvT1);
    const mCanvT2 = makeText("Đà Nẵng · 8 CLB Cầu Lông Tiêu Chuẩn", 9, false, cGrayDark);
    mCanvT2.x = 100; mCanvT2.y = 356;
    scrHome.appendChild(mCanvT2);
    const mBtnInt = makeRect(88, 372, 214, 22, 11, 1, cWhite, cStroke);
    scrHome.appendChild(mBtnInt);
    const mBtnIntT = makeText("[ Chạm để xem bản đồ tương tác ]", 8.5, true, cBlack);
    mBtnIntT.x = 105; mBtnIntT.y = 376;
    scrHome.appendChild(mBtnIntT);
    const mLoc = makeText("[Ghim]: QT Sport - Cơ sở 1: Sân Hoa Thiên Lý\n207 Quách Thị Trang, Cẩm Lệ, Đà Nẵng", 8.5, false, cBlack);
    mLoc.x = 26; mLoc.y = 414;
    scrHome.appendChild(mLoc);

    // List title
    const sTitle = makeText("Hệ Thống Cơ Sở QT Sport (8)", 12, true, cBlack);
    sTitle.x = 16; sTitle.y = 460;
    scrHome.appendChild(sTitle);
    const sMore = makeText("[Xem tất cả →]", 10, true, cBlack);
    sMore.x = 296; sMore.y = 461;
    scrHome.appendChild(sMore);

    // Card 1
    const card1 = makeRect(16, 482, 358, 126, 12, 1.2, cWhite, cStroke);
    scrHome.appendChild(card1);
    const c1Img = makeRect(24, 490, 76, 110, 6, 1, cGrayLight, cStrokeSubtle);
    scrHome.appendChild(c1Img);
    const c1ImgT = makeText("[ X ]\n[ẢNH SÂN]\nVợt cầu", 8.5, true, cGrayDark);
    c1ImgT.x = 35; c1ImgT.y = 525;
    scrHome.appendChild(c1ImgT);

    const c1Title = makeText("QT Sport - Cơ sở 1: Sân Hoa Thiên Lý", 10.5, true, cBlack);
    c1Title.x = 108; c1Title.y = 514;
    scrHome.appendChild(c1Title);
    const c1Addr = makeText("207 Quách Thị Trang, Cẩm Lệ, Đà Nẵng\nGiờ: 05:00 - 23:00  |  Đánh giá: 4.9 (156)", 8.5, false, cGrayDark);
    c1Addr.x = 108; c1Addr.y = 530;
    scrHome.appendChild(c1Addr);

    const btnHomeBook = makeRect(108, 566, 258, 28, 14, 1.5, cWhite, cBlack);
    btnHomeBook.name = "Btn_DatSan_Trigger";
    scrHome.appendChild(btnHomeBook);
    const btnHomeBookT = makeText("[ ĐẶT SÂN ]", 10, true, cBlack);
    btnHomeBookT.x = 208; btnHomeBookT.y = 573;
    scrHome.appendChild(btnHomeBookT);

    // Bottom Tab Bar
    const btmBar = makeRect(0, 764, 390, 80, 0, 1.5, cWhite, cStroke);
    scrHome.appendChild(btmBar);
    const tHome = makeText("[Trang chủ]\n● (Active)", 8.5, true, cBlack);
    tHome.x = 16; tHome.y = 780;
    scrHome.appendChild(tHome);
    const tMap = makeText("[Bản đồ]", 8.5, false, cBlack);
    tMap.x = 84; tMap.y = 780;
    scrHome.appendChild(tMap);

    const tCenter = figma.createEllipse();
    tCenter.resize(58, 58); tCenter.x = 166; tCenter.y = 746;
    tCenter.fills = [{ type: "SOLID", color: cWhite }];
    tCenter.strokes = [{ type: "SOLID", color: cBlack }];
    tCenter.strokeWeight = 2;
    scrHome.appendChild(tCenter);
    const tCenterT = makeText("[Khám phá\n/ Đặt lịch]", 8, true, cBlack);
    tCenterT.x = 171; tCenterT.y = 762;
    scrHome.appendChild(tCenterT);

    const tFeat = makeText("[Nổi bật]", 8.5, false, cBlack);
    tFeat.x = 254; tFeat.y = 780;
    scrHome.appendChild(tFeat);
    const tAcc = makeText("[Tài khoản]", 8.5, false, cBlack);
    tAcc.x = 318; tAcc.y = 780;
    scrHome.appendChild(tAcc);

    // =========================================================================
    // 2. MÀN HÌNH 2: ĐẶT SÂN & CHỌN LỊCH (BookingScreen) - X: 1050, Y: 100
    // =========================================================================
    const scrBook = createPhoneBase("02_BookingScreen", 1050, 100, "[MÀN HÌNH 2]: ĐẶT SÂN & CHỌN LỊCH (BookingScreen)");

    const bNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrBook.appendChild(bNav);
    const bNavT = makeText("[← Quay lại]        Đặt Sân - Sân Hoa Thiên Lý", 11, true, cBlack);
    bNavT.x = 26; bNavT.y = 56;
    scrBook.appendChild(bNavT);

    const bStep1 = makeRect(16, 96, 358, 64, 8, 1, cGrayLight, cStrokeSubtle);
    scrBook.appendChild(bStep1);
    const bStep1T = makeText("1. Chọn ngày chơi:\n[Hôm nay 29/10 (Đang chọn)]  [Mai 30/10]  [31/10]", 10, true, cBlack);
    bStep1T.x = 26; bStep1T.y = 108;
    scrBook.appendChild(bStep1T);

    const bStep2 = makeRect(16, 170, 358, 230, 8, 1, cWhite, cStroke);
    scrBook.appendChild(bStep2);
    const bStep2T1 = makeText("2. Lưới chọn sân & Khung giờ (Court Grid Matrix):", 11, true, cBlack);
    bStep2T1.x = 26; bStep2T1.y = 180;
    scrBook.appendChild(bStep2T1);

    const bGridContent = makeText(
      "• [Sân 1 - BWF]:   [17h-18h: Trống]   [18h-19h: ĐÃ ĐẶT]   [19h-20h: Trống]\n" +
      "• [Sân 2 - BWF]:   ★ [18h-19h: ĐANG CHỌN]   ★ [19h-20h: ĐANG CHỌN]\n" +
      "• [Sân 3 - Thảm đỏ]: [17h-18h: Trống]   [18h-19h: Trống]   [19h-20h: ĐÃ ĐẶT]\n" +
      "• [Sân 4 - Thảm xanh]: [17h-18h: Trống]   [18h-19h: Trống]   [19h-20h: Trống]",
      9.5, false, cBlack
    );
    bGridContent.x = 26; bGridContent.y = 210;
    scrBook.appendChild(bGridContent);

    const bLgd = makeText("Quy ước: [Trắng: Trống] | [Đậm ★: Đang chọn] | [Gạch: Đã đặt]", 8.5, false, cGrayDark);
    bLgd.x = 26; bLgd.y = 370;
    scrBook.appendChild(bLgd);

    const bSum = makeRect(16, 412, 358, 54, 8, 1, cGrayLight, cStrokeSubtle);
    scrBook.appendChild(bSum);
    const bSumT = makeText("Đã chọn: Sân 2 (18:00 - 20:00 · 2 tiếng)\nĐơn giá: 80.000đ/h  •  Tạm tính: 160.000đ", 10.5, true, cBlack);
    bSumT.x = 26; bSumT.y = 422;
    scrBook.appendChild(bSumT);

    const bNextBtn = makeRect(16, 480, 358, 44, 22, 2, cWhite, cBlack);
    bNextBtn.name = "Btn_TiepTucXacNhan";
    scrBook.appendChild(bNextBtn);
    const bNextBtnT = makeText("[ NÚT: TIẾP TỤC XÁC NHẬN → ]", 11, true, cBlack);
    bNextBtnT.x = 100; bNextBtnT.y = 494;
    scrBook.appendChild(bNextBtnT);

    // =========================================================================
    // 3. MÀN HÌNH 3: XÁC NHẬN & THANH TOÁN (PaymentStep) - X: 1050, Y: 1000
    // =========================================================================
    const scrPay = createPhoneBase("03_PaymentScreen", 1050, 1000, "[MÀN HÌNH 3]: XÁC NHẬN & THANH TOÁN (PaymentStep)");

    const pNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrPay.appendChild(pNav);
    const pNavT = makeText("[← Quay lại]        Xác Nhận & Thanh Toán", 11, true, cBlack);
    pNavT.x = 26; pNavT.y = 56;
    scrPay.appendChild(pNavT);

    const pSummary = makeRect(16, 96, 358, 100, 8, 1, cWhite, cStroke);
    scrPay.appendChild(pSummary);
    const pSumT = makeText(
      "Chi tiết đơn đặt sân:\n" +
      "• Cơ sở: QT Sport - Cơ sở 1: Sân Hoa Thiên Lý\n" +
      "• Vị trí: Sân số 2 (Chuẩn BWF) | Ngày: 29/10/2026\n" +
      "• Khung giờ: 18:00 - 20:00 (2 giờ)\n" +
      "• Tiền thuê sân: 160.000 VNĐ",
      9.5, false, cBlack
    );
    pSumT.x = 26; pSumT.y = 106;
    scrPay.appendChild(pSumT);

    const pService = makeRect(16, 206, 358, 64, 8, 1, cWhite, cStroke);
    scrPay.appendChild(pService);
    const pServT = makeText(
      "Dịch vụ tiện ích kèm theo:\n" +
      "[x] Thuê vợt cầu lông Yonex (2 cây: +30.000đ)\n" +
      "[x] 2 Chai nước khoáng Revive (+20.000đ)",
      9.5, false, cBlack
    );
    pServT.x = 26; pServT.y = 214;
    scrPay.appendChild(pServT);

    const pMethod = makeRect(16, 280, 358, 70, 8, 1, cGrayLight, cStrokeSubtle);
    scrPay.appendChild(pMethod);
    const pMethT = makeText(
      "Phương thức thanh toán:\n" +
      "(•) Chuyển khoản VietQR / MoMo (Khuyên dùng)\n" +
      "( ) Thanh toán tiền mặt tại quầy lễ tân",
      9.5, true, cBlack
    );
    pMethT.x = 26; pMethT.y = 292;
    scrPay.appendChild(pMethT);

    const pTotal = makeRect(16, 360, 358, 54, 8, 1, cWhite, cBlack);
    scrPay.appendChild(pTotal);
    const pTotT = makeText("TỔNG CỘNG: 189.000 VNĐ\n(Đã áp dụng giảm giá Khách VIP h0210 -10%)", 11, true, cBlack);
    pTotT.x = 45; pTotT.y = 370;
    scrPay.appendChild(pTotT);

    const pConfirmBtn = makeRect(16, 426, 358, 44, 22, 2, cWhite, cBlack);
    pConfirmBtn.name = "Btn_HoanTatDatSan";
    scrPay.appendChild(pConfirmBtn);
    const pConfirmBtnT = makeText("[ HOÀN TẤT ĐẶT SÂN & XUẤT VÉ QR ]", 10.5, true, cBlack);
    pConfirmBtnT.x = 75; pConfirmBtnT.y = 440;
    scrPay.appendChild(pConfirmBtnT);

    // =========================================================================
    // 4. MÀN HÌNH 4: BẢN ĐỒ TOÀN CẢNH (MapScreen) - X: 550, Y: -500
    // =========================================================================
    const scrMap = createPhoneBase("04_MapScreen", 550, -500, "[MÀN HÌNH 4]: BẢN ĐỒ CƠ SỞ SÂN (MapScreen)");

    const mNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrMap.appendChild(mNav);
    const mNavT = makeText("[← Quay lại]        Bản Đồ Cụm Sân Cầu Lông", 11, true, cBlack);
    mNavT.x = 26; mNavT.y = 56;
    scrMap.appendChild(mNavT);

    const mMapSearch = makeRect(16, 96, 358, 36, 18, 1, cWhite, cStroke);
    scrMap.appendChild(mMapSearch);
    const mMapSearchT = makeText("  [ Ô nhập: Nhập vị trí hoặc quận huyện... ]", 10, false, cGrayDark);
    mMapSearchT.x = 26; mMapSearchT.y = 106;
    scrMap.appendChild(mMapSearchT);

    const mMapBig = makeRect(16, 142, 358, 440, 10, 1, cGrayLight, cStrokeSubtle);
    scrMap.appendChild(mBigText = makeText(
      "[ X - BẢN ĐỒ GOOGLE MAPS TOÀN MÀN HÌNH ]\n\n" +
      "📍 Ghim 1: QT Sport 1 - Sân Hoa Thiên Lý (Cách 1.2km)\n" +
      "📍 Ghim 2: QT Sport 2 - Sân Hải Châu (Cách 3.4km)\n" +
      "📍 Ghim 3: QT Sport 3 - Sân Kỳ Đồng (Cách 4.1km)\n" +
      "📍 Ghim 4: QT Sport 4 - Sân Sơn Trà (Cách 5.0km)\n\n" +
      "[ Chạm vào ghim để xem thông tin chi tiết ]",
      10.5, false, cBlack
    ));
    mBigText.x = 35; mBigText.y = 220;
    scrMap.appendChild(mMapBig);

    const mFloatCard = makeRect(26, 470, 338, 100, 10, 1.5, cWhite, cBlack);
    scrMap.appendChild(mFloatCard);
    const mFloatT = makeText(
      "📍 Sân gần bạn nhất: QT Sport 1 - Sân Hoa Thiên Lý\n" +
      "207 Quách Thị Trang, Cẩm Lệ • 6 sân thảm BWF\n" +
      "[ Nút: Chỉ đường ]      [ Nút: Đặt sân này ngay ]",
      9.5, true, cBlack
    );
    mFloatT.x = 36; mFloatT.y = 485;
    scrMap.appendChild(mFloatT);

    // =========================================================================
    // 5. MÀN HÌNH 5: LỊCH ĐẶT CỦA TÔI (MyBookingsScreen) - X: 50, Y: 500
    // =========================================================================
    const scrMyB = createPhoneBase("05_MyBookingsScreen", 50, 500, "[MÀN HÌNH 5]: LỊCH ĐẶT CỦA TÔI (MyBookingsScreen)");

    const mybNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrMyB.appendChild(mybNav);
    const mybNavT = makeText("[← Trang chủ]        Quản Lý Lịch Của Tôi", 11, true, cBlack);
    mybNavT.x = 26; mybNavT.y = 56;
    scrMyB.appendChild(mybNavT);

    const mybTabs = makeRect(16, 96, 358, 32, 6, 1, cGrayLight, cStrokeSubtle);
    scrMyB.appendChild(mybTabs);
    const mybTabsT = makeText("[Tất cả]   [Đã duyệt (1) (Active)]   [Chờ duyệt (1)]   [Đã hủy]", 9, true, cBlack);
    mybTabsT.x = 24; mybTabsT.y = 106;
    scrMyB.appendChild(mybTabsT);

    // Đơn 1
    const oCard1 = makeRect(16, 140, 358, 120, 10, 1.5, cWhite, cBlack);
    scrMyB.appendChild(oCard1);
    const oCard1T = makeText(
      "MÃ VÉ: BK-1029  •  [TRẠNG THÁI: ĐÃ DUYỆT]\n" +
      "Cơ sở: QT Sport - Sân Hoa Thiên Lý\n" +
      "Sân số 2  |  Hôm nay 29/10 (18:00 - 20:00)\n" +
      "Tổng tiền: 189.000 VNĐ (Đã thanh toán VietQR)\n" +
      "[ NÚT: XEM MÃ QR CHECK-IN VÀO SÂN ]",
      9.5, true, cBlack
    );
    oCard1T.x = 26; oCard1T.y = 152;
    scrMyB.appendChild(oCard1T);

    // Đơn 2
    const oCard2 = makeRect(16, 272, 358, 100, 10, 1, cWhite, cStroke);
    scrMyB.appendChild(oCard2);
    const oCard2T = makeText(
      "MÃ VÉ: BK-1024  •  [TRẠNG THÁI: CHỜ DUYỆT]\n" +
      "Cơ sở: QT Sport 3 - Sân Kỳ Đồng (Sân số 4)\n" +
      "Khung giờ: 19:00 - 21:00 Ngày mai 30/10\n" +
      "[ Hủy đặt sân ]          [ Liên hệ quản lý sân ]",
      9.5, false, cBlack
    );
    oCard2T.x = 26; oCard2T.y = 284;
    scrMyB.appendChild(oCard2T);

    // =========================================================================
    // 6. MÀN HÌNH 6: SÂN YÊU THÍCH (FavoritesScreen) - X: 50, Y: -500
    // =========================================================================
    const scrFav = createPhoneBase("06_FavoritesScreen", 50, -500, "[MÀN HÌNH 6]: SÂN YÊU THÍCH (FavoritesScreen)");

    const fNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrFav.appendChild(fNav);
    const fNavT = makeText("[← Quay lại]        Sân Yêu Thích Đã Lưu (2)", 11, true, cBlack);
    fNavT.x = 26; fNavT.y = 56;
    scrFav.appendChild(fNavT);

    const fCard1 = makeRect(16, 96, 358, 86, 10, 1.2, cWhite, cStroke);
    scrFav.appendChild(fCard1);
    const fCard1T = makeText(
      "1. QT Sport - Cơ sở 1: Sân Hoa Thiên Lý  [Đã lưu ❤️]\n" +
      "207 Quách Thị Trang, Cẩm Lệ • 6 sân thảm BWF\n" +
      "05:00 - 23:00  •  Giá: 80.000đ - 120.000đ/h\n" +
      "[ NÚT: ĐẶT SÂN NGAY ]          [ Bỏ lưu ]",
      9.5, true, cBlack
    );
    fCard1T.x = 26; fCard1T.y = 108;
    scrFav.appendChild(fCard1T);

    const fCard2 = makeRect(16, 194, 358, 86, 10, 1.2, cWhite, cStroke);
    scrFav.appendChild(fCard2);
    const fCard2T = makeText(
      "2. QT Sport - Cơ sở 2: Sân Kỳ Đồng  [Đã lưu ❤️]\n" +
      "15 Kỳ Đồng, Thanh Khê • 8 sân thảm xanh\n" +
      "05:30 - 23:00  •  Giá: 70.000đ - 110.000đ/h\n" +
      "[ NÚT: ĐẶT SÂN NGAY ]          [ Bỏ lưu ]",
      9.5, true, cBlack
    );
    fCard2T.x = 26; fCard2T.y = 206;
    scrFav.appendChild(fCard2T);

    // =========================================================================
    // 7. MÀN HÌNH 7: TÀI KHOẢN (AccountScreen) - X: 550, Y: 1500
    // =========================================================================
    const scrAcc = createPhoneBase("07_AccountScreen", 550, 1500, "[MÀN HÌNH 7]: TÀI KHOẢN HỘI VIÊN (AccountScreen)");

    const aNav = makeRect(16, 42, 358, 44, 8, 1, cWhite, cStroke);
    scrAcc.appendChild(aNav);
    const aNavT = makeText("[← Trang chủ]        Hồ Sơ & Tài Khoản", 11, true, cBlack);
    aNavT.x = 26; aNavT.y = 56;
    scrAcc.appendChild(aNavT);

    const aProf = makeRect(16, 96, 358, 70, 8, 1, cGrayLight, cStrokeSubtle);
    scrAcc.appendChild(aProf);
    const aProfT = makeText(
      "[Avatar]  Trần Quốc Trung (Username: h0210)\n" +
      "Hạng: Hội viên VIP (Ưu đãi giảm 10% khi đặt sân)\n" +
      "SĐT: 0905.xxx.xxx  •  Email: trung.tran@example.com",
      9.5, true, cBlack
    );
    aProfT.x = 26; aProfT.y = 108;
    scrAcc.appendChild(aProfT);

    const aMenu = makeRect(16, 178, 358, 120, 8, 1, cWhite, cStroke);
    scrAcc.appendChild(aMenu);
    const aMenuT = makeText(
      "• [Chỉnh sửa thông tin cá nhân & SĐT]\n" +
      "• [Lịch sử giao dịch & Hóa đơn điện tử]\n" +
      "• [Cài đặt thông báo & Bảo mật tài khoản]\n" +
      "• [Chính sách điều khoản & Hotline hỗ trợ sân]",
      10, false, cBlack
    );
    aMenuT.x = 26; aMenuT.y = 190;
    scrAcc.appendChild(aMenuT);

    const aLogout = makeRect(16, 310, 358, 40, 20, 1.5, cWhite, cBlack);
    scrAcc.appendChild(aLogout);
    const aLogoutT = makeText("[ NÚT: ĐĂNG XUẤT TÀI KHOẢN ]", 10.5, true, cBlack);
    aLogoutT.x = 105; aLogoutT.y = 322;
    scrAcc.appendChild(aLogoutT);

    // =========================================================================
    // TẠO CÁC ĐƯỜNG KẾT NỐI MŨI TÊN TƯƠNG TÁC (PROTOTYPE CONNECTORS)
    // =========================================================================
    function makeConnector(x1, y1, x2, y2, labelText, color = cBlueLink) {
      const line = figma.createLine();
      line.x = x1;
      line.y = y1;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      line.resize(len, 0);
      line.rotation = (Math.atan2(dy, dx) * 180) / Math.PI;
      line.strokes = [{ type: "SOLID", color: color }];
      line.strokeWeight = 3;

      // Nhãn mũi tên
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const tagBox = makeRect(midX - 70, midY - 14, 140, 26, 6, 1, cWhite, color);
      tagBox.name = `Arrow_${labelText}`;
      const txt = makeText(labelText, 9, true, color);
      txt.x = midX - 60;
      txt.y = midY - 8;
    }

    // 1. HomeScreen [ĐẶT SÂN] -> BookingScreen
    makeConnector(940, 1070, 1050, 520, "1. Bấm [ĐẶT SÂN]");

    // 2. BookingScreen [TIẾP TỤC] -> PaymentScreen
    makeConnector(1245, 944, 1245, 1000, "2. Bấm [TIẾP TỤC]");

    // 3. PaymentScreen [HOÀN TẤT] -> MyBookingsScreen
    makeConnector(1050, 1450, 440, 1100, "3. [HOÀN TẤT VÉ QR]", cGreenSuccess);

    // 4. HomeScreen [Bản đồ] -> MapScreen
    makeConnector(745, 500, 745, 344, "4. Bấm [Bản đồ]");

    // 5. HomeScreen [Lịch của tôi] -> MyBookingsScreen
    makeConnector(550, 720, 440, 720, "5. Bấm [Lịch của tôi]");

    // 6. HomeScreen [Yêu thích] -> FavoritesScreen
    makeConnector(550, 680, 440, 200, "6. Bấm [Yêu thích]");

    // 7. HomeScreen Tab [Tài khoản] -> AccountScreen
    makeConnector(745, 1344, 745, 1500, "7. Tab [Tài khoản]");

    // Đưa tất cả vào viewport và thông báo
    figma.viewport.scrollAndZoomIntoView([scrHome, scrBook, scrPay, scrMap, scrMyB, scrFav, scrAcc]);
    figma.closePlugin("✅ Đã thiết kế xong 7 màn hình chức năng và nối mũi tên Prototype tương tác trên Figma!");

  } catch (err) {
    figma.closePlugin("❌ Lỗi: " + err.message);
  }
}

run();
