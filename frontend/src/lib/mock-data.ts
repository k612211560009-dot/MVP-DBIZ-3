// Mock data for Mother Milk Donation Management System

export interface Donor {
  id: string;
  name: string;
  dob: string;
  phone: string;
  ehrId: string;
  status: 'pending' | 'interviewed' | 'needs_tests' | 'approved' | 'rejected';
  registeredAt: string;
  email: string;
  address: string;
  emergencyContact: string;
}

export interface Appointment {
  id: string;
  donorId: string;
  donorName: string;
  type: 'screening' | 'donation';
  date: string;
  time: string;
  staff: string;
  status: 'scheduled' | 'arrived' | 'completed' | 'failed';
  notes?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  date: string;
  volume: number;
  containers: number;
  staff: string;
  points: number;
  notes?: string;
  healthStatus: 'good' | 'bad';
}

export interface EHRTest {
  id: string;
  donorId: string;
  donorName: string;
  testType: 'HIV' | 'Hepatitis B' | 'Hepatitis C' | 'Syphilis';
  result: 'negative' | 'positive' | 'pending';
  date: string;
  lab: string;
  validity: 'valid' | 'expired' | 'expiring_soon';
  expiryDate: string;
}

export interface Alert {
  id: string;
  type: 'test_expiring' | 'screening_incomplete' | 'unsigned_consent' | 'payment_pending';
  donorId: string;
  donorName: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  status: 'active' | 'resolved';
}

export interface Payment {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  status: 'pending' | 'transferred' | 'failed';
  requestedAt: string;
  transferredAt?: string;
  receiptUrl?: string;
}

export interface RewardRule {
  id: string;
  name: string;
  volumeThreshold: number;
  points: number;
  effectiveFrom: string;
  effectiveTo?: string;
  active: boolean;
}

export const mockDonors: Donor[] = [
  {
    id: 'MB-000123',
    name: 'Nguyễn Thị A',
    dob: '1990-05-10',
    phone: '0912345678',
    ehrId: 'EHR-12345',
    status: 'pending',
    registeredAt: '2025-10-01',
    email: 'nguyenthia@email.com',
    address: 'Quận 1, TP.HCM',
    emergencyContact: '0987654321'
  },
  {
    id: 'MB-000124',
    name: 'Trần Thị B',
    dob: '1992-08-15',
    phone: '0923456789',
    ehrId: 'EHR-12346',
    status: 'interviewed',
    registeredAt: '2025-10-02',
    email: 'tranthib@email.com',
    address: 'Quận 3, TP.HCM',
    emergencyContact: '0976543210'
  },
  {
    id: 'MB-000125',
    name: 'Lê Thị C',
    dob: '1988-03-20',
    phone: '0934567890',
    ehrId: 'EHR-12347',
    status: 'approved',
    registeredAt: '2025-09-28',
    email: 'lethic@email.com',
    address: 'Quận 5, TP.HCM',
    emergencyContact: '0965432109'
  },
  {
    id: 'MB-000126',
    name: 'Phạm Thị D',
    dob: '1995-11-05',
    phone: '0945678901',
    ehrId: 'EHR-12348',
    status: 'needs_tests',
    registeredAt: '2025-10-03',
    email: 'phamthid@email.com',
    address: 'Quận 7, TP.HCM',
    emergencyContact: '0954321098'
  },
  {
    id: 'MB-000127',
    name: 'Hoàng Thị E',
    dob: '1993-07-12',
    phone: '0956789012',
    ehrId: 'EHR-12349',
    status: 'approved',
    registeredAt: '2025-09-25',
    email: 'hoangthie@email.com',
    address: 'Quận 10, TP.HCM',
    emergencyContact: '0943210987'
  },
  {
    id: 'MB-000128',
    name: 'Võ Thị F',
    dob: '1991-02-28',
    phone: '0967890123',
    ehrId: 'EHR-12350',
    status: 'rejected',
    registeredAt: '2025-09-20',
    email: 'vothif@email.com',
    address: 'Quận Bình Thạnh, TP.HCM',
    emergencyContact: '0932109876'
  },
  {
    id: 'MB-000129',
    name: 'Đỗ Thị G',
    dob: '1994-09-18',
    phone: '0978901234',
    ehrId: 'EHR-12351',
    status: 'pending',
    registeredAt: '2025-10-04',
    email: 'dothig@email.com',
    address: 'Quận Tân Bình, TP.HCM',
    emergencyContact: '0921098765'
  },
  {
    id: 'MB-000130',
    name: 'Bùi Thị H',
    dob: '1989-12-25',
    phone: '0989012345',
    ehrId: 'EHR-12352',
    status: 'approved',
    registeredAt: '2025-09-22',
    email: 'buithih@email.com',
    address: 'Quận Phú Nhuận, TP.HCM',
    emergencyContact: '0910987654'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'AP-20251021-01',
    donorId: 'MB-000123',
    donorName: 'Nguyễn Thị A',
    type: 'screening',
    date: '2025-10-21',
    time: '09:00',
    staff: 'Bs. Lê Văn B',
    status: 'scheduled'
  },
  {
    id: 'AP-20251021-02',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    type: 'donation',
    date: '2025-10-21',
    time: '10:30',
    staff: 'Bs. Trần Thị D',
    status: 'arrived'
  },
  {
    id: 'AP-20251021-03',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    type: 'donation',
    date: '2025-10-21',
    time: '14:00',
    staff: 'Bs. Lê Văn B',
    status: 'completed'
  },
  {
    id: 'AP-20251022-01',
    donorId: 'MB-000124',
    donorName: 'Trần Thị B',
    type: 'screening',
    date: '2025-10-22',
    time: '09:30',
    staff: 'Bs. Nguyễn Thị F',
    status: 'scheduled'
  },
  {
    id: 'AP-20251022-02',
    donorId: 'MB-000128',
    donorName: 'Võ Thị F',
    type: 'screening',
    date: '2025-10-22',
    time: '11:00',
    staff: 'Bs. Lê Văn B',
    status: 'scheduled'
  }
];

export const mockDonations: Donation[] = [
  {
    id: 'D-20251015-01',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    date: '2025-10-15',
    volume: 350,
    containers: 2,
    staff: 'Bs. Lê Văn B',
    points: 10,
    healthStatus: 'good',
    notes: 'Sức khỏe tốt'
  },
  {
    id: 'D-20251018-01',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    date: '2025-10-18',
    volume: 400,
    containers: 2,
    staff: 'Bs. Trần Thị D',
    points: 12,
    healthStatus: 'good'
  },
  {
    id: 'D-20251020-01',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    date: '2025-10-20',
    volume: 380,
    containers: 2,
    staff: 'Bs. Nguyễn Thị F',
    points: 11,
    healthStatus: 'good'
  },
  {
    id: 'D-20251019-01',
    donorId: 'MB-000130',
    donorName: 'Bùi Thị H',
    date: '2025-10-19',
    volume: 320,
    containers: 2,
    staff: 'Bs. Lê Văn B',
    points: 9,
    healthStatus: 'good'
  }
];

export const mockEHRTests: EHRTest[] = [
  {
    id: 'TEST-001',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    testType: 'HIV',
    result: 'negative',
    date: '2025-09-20',
    lab: 'Phòng xét nghiệm Pasteur',
    validity: 'valid',
    expiryDate: '2026-03-20'
  },
  {
    id: 'TEST-002',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    testType: 'Hepatitis B',
    result: 'negative',
    date: '2025-09-20',
    lab: 'Phòng xét nghiệm Pasteur',
    validity: 'valid',
    expiryDate: '2026-03-20'
  },
  {
    id: 'TEST-003',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    testType: 'HIV',
    result: 'negative',
    date: '2025-08-15',
    lab: 'Bệnh viện Từ Dũ',
    validity: 'expiring_soon',
    expiryDate: '2026-02-15'
  },
  {
    id: 'TEST-004',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    testType: 'Syphilis',
    result: 'negative',
    date: '2025-08-15',
    lab: 'Bệnh viện Từ Dũ',
    validity: 'expiring_soon',
    expiryDate: '2026-02-15'
  },
  {
    id: 'TEST-005',
    donorId: 'MB-000130',
    donorName: 'Bùi Thị H',
    testType: 'HIV',
    result: 'negative',
    date: '2025-07-10',
    lab: 'Phòng xét nghiệm Medlatec',
    validity: 'expired',
    expiryDate: '2026-01-10'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'test_expiring',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    message: 'Xét nghiệm HIV và Syphilis sắp hết hạn (15/02/2026)',
    priority: 'high',
    createdAt: '2025-10-20',
    status: 'active'
  },
  {
    id: 'ALT-002',
    type: 'screening_incomplete',
    donorId: 'MB-000124',
    donorName: 'Trần Thị B',
    message: 'Phiếu sàng lọc chưa hoàn thành',
    priority: 'medium',
    createdAt: '2025-10-19',
    status: 'active'
  },
  {
    id: 'ALT-003',
    type: 'unsigned_consent',
    donorId: 'MB-000126',
    donorName: 'Phạm Thị D',
    message: 'Chưa ký cam kết hiến sữa',
    priority: 'high',
    createdAt: '2025-10-18',
    status: 'active'
  },
  {
    id: 'ALT-004',
    type: 'test_expiring',
    donorId: 'MB-000130',
    donorName: 'Bùi Thị H',
    message: 'Xét nghiệm HIV đã hết hạn',
    priority: 'high',
    createdAt: '2025-10-15',
    status: 'active'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY-001',
    donorId: 'MB-000125',
    donorName: 'Lê Thị C',
    amount: 500000,
    status: 'pending',
    requestedAt: '2025-10-20'
  },
  {
    id: 'PAY-002',
    donorId: 'MB-000127',
    donorName: 'Hoàng Thị E',
    amount: 300000,
    status: 'transferred',
    requestedAt: '2025-10-15',
    transferredAt: '2025-10-18',
    receiptUrl: '/receipts/pay-002.pdf'
  },
  {
    id: 'PAY-003',
    donorId: 'MB-000130',
    donorName: 'Bùi Thị H',
    amount: 200000,
    status: 'pending',
    requestedAt: '2025-10-19'
  }
];

export const mockRewardRules: RewardRule[] = [
  {
    id: 'RULE-001',
    name: 'Mức cơ bản',
    volumeThreshold: 100,
    points: 5,
    effectiveFrom: '2025-01-01',
    active: true
  },
  {
    id: 'RULE-002',
    name: 'Mức khuyến khích',
    volumeThreshold: 300,
    points: 10,
    effectiveFrom: '2025-01-01',
    active: true
  },
  {
    id: 'RULE-003',
    name: 'Mức cao',
    volumeThreshold: 500,
    points: 15,
    effectiveFrom: '2025-01-01',
    active: true
  }
];

export const screeningQuestions = [
  { id: 'q1', text: 'Bạn có đang cho con bú không?', required: true },
  { id: 'q2', text: 'Bạn có bị bệnh truyền nhiễm không?', required: true },
  { id: 'q3', text: 'Bạn có đang dùng thuốc kháng sinh không?', required: true },
  { id: 'q4', text: 'Bạn có hút thuốc hoặc uống rượu không?', required: true },
  { id: 'q5', text: 'Bạn có tiền sử bệnh tim mạch không?', required: true },
  { id: 'q6', text: 'Bạn có đang điều trị bệnh mãn tính không?', required: true },
  { id: 'q7', text: 'Bạn có xăm mình trong 12 tháng qua không?', required: true },
  { id: 'q8', text: 'Bạn có truyền máu trong 12 tháng qua không?', required: true },
  { id: 'q9', text: 'Bạn có sẵn sàng cam kết hiến sữa định kỳ không?', required: true },
  { id: 'q10', text: 'Bạn có đồng ý cho phép lưu trữ thông tin y tế không?', required: true }
];
