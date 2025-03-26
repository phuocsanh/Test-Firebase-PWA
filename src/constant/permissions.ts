export const permissions = {
  PROJECT_GROUP: 1, //Nhóm dự án
  PROJECT_OWNER: 2, //Chủ đầu tư
  CONTRACTOR: 1, //Nhà thầu
  BUDGET_FUND: 4, //Nguồn ngân sách
  AGENCY: 5, //Cơ quan ban hành
  DEPLOYMENT_PHASE: 6, //Giai đoạn triển khai dự án
  CONTRACTOR_TYPE: 7, //Danh sách loại nhà thầu
  TENDER_TYPE: 8, //Hình thức LCNT
  BIDDING_SECTOR: 9, //Lĩnh vực đấu thầu
  BIDDING_METHOD: 10, //Phương thức LCNT
  CONTRACT_TYPE: 11, //Loại hợp đồng
  COST_ITEM_TYPE: 12, //Loại chi phí
  COST_ITEM: 13, /// Khoản mục chi phí
  PROJECT: 14, // Dự án
  CONSTRUCTION_ITEM: 15, //Hạng mục
  CONSTRUCTION_TASK: 16, // Công tác thực hiện
  DOCUMENT_GROUP: 17, //Nhóm văn bản
  FILE_TYPE: 18, //Loại tập tin
  DEPARTMENT: 19, //Phòng chuyên môn
  POSITION: 20, //Chức vụ
  WORK_POSITION: 21, //Vị trí làm việc
  EVALUATION_RESULT: 22, //Kết quả, đánh giá, xếp loại
  EXPERTISE: 23, //Chuyên môn
  MAJOR: 24, //Chuyên ngành
  POLITICS: 25, //Chính trị
  CAREER_TRAINING: 26, //Bồi dưỡng nghiệp vụ
  IT_COURSE: 27, //Tin học
  FOREIGN_LANGUAGE: 28, //Ngoại ngữ
  EMPLOYEE_TYPE: 29, //Loại nhân viên
  GENDER_TYPE: 30, //Giới tính
  TRAINING_INSTITUTION: 31, //Cơ sở đào tạo
  DISTRICT: 32, //Huyện
  WARD: 33, //Phường, xã, thị trấn
  CORRESPONDENCE_TYPE: 34, //Loại thư
  INVENTORY_ITEM_TYPE: 35, //Loại vật tư, thiết bị
  INVENTORY_ITEM: 36, //Vật tư, thiết bị
  PROJECT_STATUS: 37, //Tình trạng dự án
  PROJECT_MANAGEMENT_TYPE: 38, //Hình thức quản lý dự án
  UNIT: 39, // Đơn vị tính
  ACCOUNT_FUND: 40, //// Tài khoản quỹ
  CONTRACT_APPENDIX_TYPE: 41, // Loại điều chỉnh PLHĐ
  STATE_MANAGEMENT: 42, //QLNN
  STATUS: 43, // Trạng thái
  APPROVAL_PROCESS: 44, // Thiết lập quy trình duyệt
  CONTRACTOR_SELECTION_PLAN: 45, //Kế hoạch lựa chọn nhà thầu
  CONTRACT_TASK_MANAGEMENT: 46, //Quản lý công việc hợp đồng
  TENDER_PACKAGE: 47, //Gói thầu
  CONTRACT: 48, //Hợp đồng
  CONTRACT_APPENDIX: 49, //Phụ lục hợp đồng
  ADJUSTED_INVESTMENT: 50, // Tổng mức đầu tư điều chỉnh
  ADJUSTED_COST_ESTIMATION: 51, // Dự toán điều chỉnh
  COMPLETION_ACCEPTANCE: 52, //Nghiệm thu thực hiện
  EMPLOYEE: 53, //Nhân sự
  TRAINING_MANAGEMENT: 54, //Theo dõi đào tạo
  LEAVE: 55, // Theo dõi nghỉ phép
  BORROW_DOCUMENT: 56, // Theo dõi cho mượn hồ sơ
  OVERTIME_REGISTRATION: 57, //Phiếu đăng ký làm thêm giờ
  BOARD_OF_DIRECTORS_WORK_SCHEDULE: 58, // Lịch làm việc của ban giám đốc
  DIRECTIVE_CONTENT: 59, // Nội dung chỉ đạo
  TARGET: 60, // Chỉ tiêu
  TASK: 61, // Nhiệm vụ
  WORK_MANAGEMENT_DIRECTIVE_CONTENT: 62, //QLCV - Nội dung chỉ đạo
  WORK_MANAGEMENT_TARGET: 63, // QLCV - Chỉ tiêu
  WORK_MANAGEMENT_TASK: 64, //QLCV - Nhiệm vụ
  WORK_MANAGEMENT_DESIGN_BID_ESTIMATION: 65, //QLCV - Thiết kế, dự toán gói thầu
  WORK_MANAGEMENT_OTHER: 66, //QLCV - Khác
  SALARY_SHEET: 67, //Bảng lương
  INSURANCE_CONTRIBUTION_REPORT: 68, ///  Danh sách nộp bảo hiểm
  REPORT_TEMPLATE: 69, // Thiết lập biểu mẫu báo cáo
  DOCUMENT_FORM_ENTRY: 70, // Nhập dữ liệu theo biểu mẫu chung
  PAYMENT_BENEFICIARY_REPORT: 71, // Bảng thanh toán cho đối tượng thụ hưởng
  REPORT_SERIAL_MANAGEMENT: 72, // Quản lý cho số báo cáo
  EMPLOYEE_PAYROLL_REPORT: 73, /// Bảng lương nhân viên chức
  SALARY_SHEET_FOR_LABOR_CONTRACT_REPORT: 74, //Bảng lương theo hợp đồng lao động
  OVERTIME_ATTENDANCE_TRACKING_REPORT: 75, //Bảng chấm công làm thêm giờ
  BUDGET_SOURCE_CODE: 76, // Mã nguồn NS
  GUARANTEE_LETTER_TRACKING: 77, //Theo dõi thư bảo lãnh
  SETUP_ANNUAL_HOLIDAY: 78, // Thiết lập ngày nghỉ trong năm
  ASSET_TYPE: 79, // Loại tài sản
  ASSET: 80, // Tài sản
  ASSET_INCREMENT: 81, // Ghi tăng tài sản
  OUTSTANDING_EQUIPMENT: 82, ///Thiết bị tồn đọng
  BACKLOG_PROJECT_MANAGEMENT: 83, // Quản lý dự án tồn đọng
  CAPITAL_INCREASE_PLAN: 84, // Kế hoạch giao vốn
  SPENDING_COMMITMENT: 85, // Cam kết chi
  PAYMENT_RECEIPT: 86, // Chứng từ thanh toán
  PROJECT_SCHEDULE_SETUP: 87, // Thiết lập tiến độ thực hiện dự án
  DOCUMENT_DECISION: 88, // Thiết lập căn cứ quyết định
  FORM_DOCUMENT_MANAGER: 89, //Quản lý biểu mẫu
  INVESTMENT_TYPE: 91, // Hình thức đầu tư
  INVESTMENT_FORM: 92, // Loại hình đầu tư
  CONSTRUCTION_TYPE: 93, // Loại công trình
  RPT_ANNUAL_TASK_LIST_STATISTICS: 94, //Chỉ tiêu, nhiệm vụ – Nội dung chỉ đạo – Tổng hợp
  CONTRACTOR_SELECTION_RESULT: 95, //Thống kê kết quả LCNT
  RPT_YEARLY_SUMMARY: 96, //Chỉ tiêu, nhiệm vụ – Nội dung chỉ đạo: Năm
  RPT_SUMMARY_TARGETS_TASKS_FIRST_6_MONTHS: 97, //Tiến độ thực hiện 6 tháng đầu năm
  RPT_SUMMARY_TARGETS_TASKS_LAST_6_MONTHS: 98, //Tiến độ thực hiện 6 tháng cuối năm
  RPT_REPORT_ON_IMPLEMENTATION_OF_DIRECTIVES: 99, //Thống kê kết quả thực hiện
  A_B_SETTLEMENT: 100, // Quyết toán A-B
  REPORT_ANNEX_3A: 101, // Phụ lục 3A
  DESIGN_TASK_MANAGEMENT: 102, // Quản lý công việc thiết ké
  CONTRACTOR_PARTICIPATION_TENDER_PACKAGE_LIST_REPORT: 103, // Danh sách nhà thầu tham gia thực hiện gói thầu
  SAVING_IN_BIDDING_REPORT: 104, // Báo cáo tiết kiệm trong đấu thầu
  SAVING_RATE_CONTRACTOR_SELECTION_PLAN_REPORT: 105, // Tỷ lệ tiết kiệm trong công tác LCNT
  CONTRACTOR_SELECTION_RESULT_BY_MANAGING_DIRECTOR_REPORT: 106, //báo cáo kết quả LCNT theo GĐDA
  CAPITAL_PLAN_DISBURSEMENT_PROGRESS_REPORT: 107, // Báo cáo tiến độ giải ngân kế hoạch vốn
  CONTRACTOR_SELECTION_RESULT_BY_DEPARTMENT_REPORT: 108, //báo cáo kết quả LCNT theo trưởng phòng
  PROJECT_DISBURSEMENT: 109, // Báo cáo giải ngân theo dự án
  A_B_ADJUSTMENT_SETTLEMENT: 110, // Quyết toán A-B điều chỉnh
  PROPOSED_SETTLEMENT_INVESTMENT_COST: 111, // Chi phí đầu tư đề nghị quyết toán
  CONTRACT_SETTLEMENT: 112, // Thanh lý hợp đồng
  ADVANCE_PAYMENT: 113, // Báo cáo tình hình tạm ứng
  PROJECT_DEPARTMENT_DISBURSEMENT_PROGRESS_REPORT: 114, // Bảng tiến độ giải ngân phòng QLDA
  TEMPLATE_STATISTICS_REPORT: 115, // Thống kê theo biểu mẫu báo cáo
  STATISTICS_BY_REPORT_TEMPLATE: 115, // Thống kê theo biểu mẫu báo cáo
  PROJECT_DEBT_STATUS_STATISTICS_REPORT: 116, ///Thống kê tình hình công nợ dự án
  DATA_RECONCILIATION_TABLE: 117, //Bảng đối chiếu số liệu
  REPORT_PUBLIC_INVESTMENT_SETTLEMENT: 118, ///Báo cáo quyết toán vốn đầu tư công nguồn ngân sách nhà nước theo năm ngân sách

  // Chưa có quyền
  HISTORY_ACTION: 50, // ?? Lịch sử thao tác

  SETUP_REPORT_TEMPLATE: 1,

  SALES_ORDER: 1,
  QUOTATION: 1,
  ORDER: 1, //// Order Alacarte
  ORDER_CUSTOMER: 2, //// Phiếu đặt tiệc
  PARTY_SCHEDULE_REPORT: 3, //// Lịch đặt tiệc
  ORDER_CUSTOMER_TRACKING: 4, //// Phiếu theo dõi tiệc
  INVOICE_LIST: 5, // SALES: 5,          //// Danh sách hóa đơn
  RETURN_KITCHEN: 6, //// Trả món
  RETURN_DISH: 6, // RETURN_KITCHEN      ////

  PURCHASE_REQUEST: 7, //// Yêu cầu mua hàng
  PURCHASE: 8, //// Mua hàng
  RETURN_SUPPLIER: 9, //// Trả hàng NCC
  RECEIPTS: 10, //// Phiếu thu
  PAYMENT: 11, //// Phiếu chi
  FUND_TRANS: 12, //// Phiếu chuyển tiền quỹ
  STOCK_IN: 13, //// Nhập kho
  STOCK_OUT: 14, //// Xuất kho
  STOCK_TRANSFER: 15, //// Chuyển kho
  STOCK_AUDIT: 16, //// Kiểm kho
  PRODUCT_BOM_PRICE: 17, //// Định lượng thức ăn
  SALES_DRINK_REFERENCE_BOOK: 18, //// Sổ đối chiêu bia bán trong ngày
  SALES_REPORT_PRODUCT_GROUP: 19, //// Báo cáo nhóm
  PURCHASE_DETAIL_BOOK: 20, //// Sổ nhập hàng chợ
  TOTAL_PAYMENT_BUY_AT_MARKET_BOOK: 21, //// Tổng chi hàng chợ
  CASH_BOOK: 22, //// Sổ quỹ tiền mặt
  DEBT_REPORT_BOOK: 23, //// Sổ báo cáo công nợ
  DEBT_RECEIPTS_BOOK: 24, //// Sổ trả công nợ
  SALES_BY_ROOM_TABLE_DETAIL_REPORT: 25, //// Báo cáo chi tiết theo bàn
  INVENTORY_IMPORT_EXPORT_REPORT: 26, //// Xuất nhập tồn NVL
  INVENTORY_IMPORT_EXPORT_DRINK_BOOK: 27, //// Xuất nhập tồn đồ uống
  CUSTOMER_DEBT_REPORT: 28, //// Công nợ khách hàng
  SUPPLIER_DEBT_REPORT: 29, //// Công nợ nhà cung cấp
  MIN_INVENTORY_REPORT: 30, //// Tồn dưới định mức
  RECEIPTS_AND_PAYMENTS_FUND_REPORT: 31, //// Thu chi tồn quỹ
  MATERIAL_GROUP: 32, //// Nhóm nguyên vật liệu
  MATERIAL: 33, //// Nguyên vật liệu
  MENU_GROUP: 34, //// Nhóm thực đơn
  PRODUCT: 35, //// Thực đơn
  WAREHOUSE: 36, //// Kho hàng

  KITCHEN_BAR: 38, //// Bếp, bar
  RECEIPTS_AND_EXPENSES_CONTENT: 39, //// Nội dung
  CUSTOMER_GROUP: 41, //// Nhóm khách hàng
  CUSTOMER: 42, //// Khách hàng
  SUPPLIER_GROUP: 43, //// Nhóm nhà cung cấp
  SUPPLIER: 44, //// Nhà cung cấp
  STAFF_GROUP: 45, //// Nhóm nhân viên
  STAFF: 46, //// Nhân viên
  ROOM_PRODUCT: 47, //// Vật dụng trong phóng
  REASON_CANCEL: 48, //// Lý do hủy món/hủy order
  REASON_CANCEL_ORDER: 48, ////
  COMPANY: 49, //// Thông tin công ty
  PERMISSION_GROUP: 50, //// Nhóm quyền
  USER: 51, //// Người dùng
  EDIT_PERMISSION: 51, // Quyền số mấy không biết
  WORK_SHIFT: 52, //// Ca làm việc
  AREA: 53, //// Khu vực
  RESTAURANT_MAP: 54, //// Sơ đồ nhà hàng
  PRINT_FORM: 55, //// Thiết kế mẫu in
  ORDER_MOBILE: 56, //// Order mobile
  CONFIRM_RETURN_DISH: 57, //// Nhân viên xác nhận trả món
  DASHBOARD: 49,
  USER_PROFILE: 49,
  CUSTOMER_ANNIVERSARY_REPORT: 58, ////
  SALE_PROFIT: 59, ////
  HR_SALARY_TABLE: 60, /// bảng lương
  HR_ATTENDANCE: 61, /// chấm công
  HR_ATTENDANCE_LOG: 62, /// chi tiết chấm công
  HR_CALCULATE_SALARY: 63, /// tính lương
};

export const PERMISSIONS = Object.freeze(permissions);
