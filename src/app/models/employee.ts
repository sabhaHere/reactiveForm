export interface Employee {
  name: string;
  email: string;
  department: string;
  joiningDate: Date | null;
  skills: string[];
  agreeToTerm: boolean;
}
export const DEPARTMENTS = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Product', value: 'product' },
  { label: 'HR', value: 'hr' },
  { label: 'Sales', value: 'sales' },
];