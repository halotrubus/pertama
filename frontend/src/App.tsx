import { Navigate, Route, Routes } from 'react-router-dom';
import { getSession, homeFor } from '@/lib/auth';
import { RoleGuard } from '@/components/layout/RoleGuard';
import AdminLayout from '@/components/layout/AdminLayout';
import MobileLayout from '@/components/layout/MobileLayout';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Students from '@/pages/admin/Students';
import StudentProfile from '@/pages/admin/StudentProfile';
import Registration from '@/pages/admin/Registration';
import Teachers from '@/pages/admin/Teachers';
import Parents from '@/pages/admin/Parents';
import Classes from '@/pages/admin/Classes';
import AttendanceAdmin from '@/pages/admin/AttendanceAdmin';
import Billing from '@/pages/admin/Billing';
import CalendarAdmin from '@/pages/admin/CalendarAdmin';
import AnnouncementsAdmin from '@/pages/admin/AnnouncementsAdmin';
import Reports from '@/pages/admin/Reports';
import ActivityLogPage from '@/pages/admin/ActivityLogPage';
import Settings from '@/pages/admin/Settings';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import TeacherAttendance from '@/pages/teacher/TeacherAttendance';
import TeacherDailyLog from '@/pages/teacher/TeacherDailyLog';
import TeacherIncidents from '@/pages/teacher/TeacherIncidents';
import TeacherCalendar from '@/pages/teacher/TeacherCalendar';
import TeacherNotifications from '@/pages/teacher/TeacherNotifications';
import TeacherProfile from '@/pages/teacher/TeacherProfile';
import ParentDashboard from '@/pages/parent/ParentDashboard';
import ParentChild from '@/pages/parent/ParentChild';
import ParentAttendance from '@/pages/parent/ParentAttendance';
import ParentDailyLog from '@/pages/parent/ParentDailyLog';
import ParentBilling from '@/pages/parent/ParentBilling';
import ParentCalendar from '@/pages/parent/ParentCalendar';
import ParentAnnouncements from '@/pages/parent/ParentAnnouncements';
import ParentNotifications from '@/pages/parent/ParentNotifications';
import ParentProfile from '@/pages/parent/ParentProfile';

function HomeRedirect() {
  const session = getSession();
  return <Navigate to={session ? homeFor(session.role) : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      {/* Portal Pentadbir — desktop-first */}
      <Route
        path="/admin"
        element={
          <RoleGuard role="ADMIN">
            <AdminLayout />
          </RoleGuard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="registration" element={<Registration />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="parents" element={<Parents />} />
        <Route path="classes" element={<Classes />} />
        <Route path="attendance" element={<AttendanceAdmin />} />
        <Route path="billing" element={<Billing />} />
        <Route path="calendar" element={<CalendarAdmin />} />
        <Route path="announcements" element={<AnnouncementsAdmin />} />
        <Route path="reports" element={<Reports />} />
        <Route path="activity-log" element={<ActivityLogPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Portal Guru — mobile-first */}
      <Route
        path="/teacher"
        element={
          <RoleGuard role="TEACHER">
            <MobileLayout role="TEACHER" />
          </RoleGuard>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="daily-log" element={<TeacherDailyLog />} />
        <Route path="incidents" element={<TeacherIncidents />} />
        <Route path="calendar" element={<TeacherCalendar />} />
        <Route path="notifications" element={<TeacherNotifications />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Portal Ibu Bapa — mobile-first */}
      <Route
        path="/parent"
        element={
          <RoleGuard role="PARENT">
            <MobileLayout role="PARENT" />
          </RoleGuard>
        }
      >
        <Route index element={<ParentDashboard />} />
        <Route path="child" element={<ParentChild />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="daily-log" element={<ParentDailyLog />} />
        <Route path="billing" element={<ParentBilling />} />
        <Route path="calendar" element={<ParentCalendar />} />
        <Route path="announcements" element={<ParentAnnouncements />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="profile" element={<ParentProfile />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
