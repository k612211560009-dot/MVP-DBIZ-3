import { Input } from './ui/input';
import { Label } from './ui/label';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, error, required }: PhoneInputProps) {
  const formatPhone = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    // Format as Vietnamese phone number
    if (digits.startsWith('84')) {
      return '+' + digits;
    } else if (digits.startsWith('0')) {
      return '+84' + digits.substring(1);
    } else {
      return '+84' + digits;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <Label>
        Phone Number {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="+84 912 888 123"
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-[12px] text-destructive">{error}</p>}
    </div>
  );
}
