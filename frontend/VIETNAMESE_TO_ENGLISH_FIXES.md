# Vietnamese to English Conversion - Quick Reference

## Critical Files Fixed Manually

### Guards and Core Components

- `guards/DonorGuard.jsx` - "Vui lòng đăng nhập" → "Please login"
- `components/NewUserBanner.jsx` - Registration prompts
- `components/dashboard/VisitScheduleCard.jsx` - Schedule messages
- `components/dashboard/DonationRecordCard.jsx` - Donation history
- `pages/donor/DonorPendingPage.jsx` - Pending status messages
- `pages/donor/DonorDashboardPage.jsx` - Dashboard labels

## Files Needing Manual Translation

See list in conversation - over 50+ occurrences across components

## Command to Find All Vietnamese Text

```bash
cd frontend/src
grep -r "Vui lòng\|Chào mừng\|Đang\|Chưa\|Tổng\|Thông báo\|Không có\|đăng ký\|điểm\|Trạng thái" --include="*.jsx" --include="*.tsx"
```
