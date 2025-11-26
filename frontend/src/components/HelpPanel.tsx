import { HelpCircle, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function HelpPanel() {
  return (
    <div className="hidden lg:block sticky top-32 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <HelpCircle className="w-5 h-5 text-primary" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[13px] text-muted-foreground">
            Our team is here to support you throughout the registration process.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[13px] font-medium">Hotline</p>
                <p className="text-[12px] text-muted-foreground">1900-xxxx</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[13px] font-medium">Email</p>
                <p className="text-[12px] text-muted-foreground">support@milkcare.vn</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px]">Privacy Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[12px] text-muted-foreground">
            Your personal information is protected and will only be used for milk donation coordination and health screening purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
