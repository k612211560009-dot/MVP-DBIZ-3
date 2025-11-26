import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { DonorList } from './pages/DonorList';
import { AppointmentList } from './pages/AppointmentList';
import { ScreeningForm } from './pages/ScreeningForm';
import { DonorProfile } from './pages/DonorProfile';
import { DonationLog } from './pages/DonationLog';
import { RecordDonation } from './pages/RecordDonation';
import { EHRTests } from './pages/EHRTests';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { Rewards } from './pages/Rewards';
import { Payments } from './pages/Payments';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donors" element={<DonorList />} />
          <Route path="/donors/:id" element={<DonorProfile />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/screening" element={<ScreeningForm />} />
          <Route path="/donations" element={<DonationLog />} />
          <Route path="/record-donation" element={<RecordDonation />} />
          <Route path="/ehr-tests" element={<EHRTests />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}