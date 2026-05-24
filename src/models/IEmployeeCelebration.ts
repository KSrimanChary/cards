export interface IEmployeeCelebration {
  Id?: number;
  Title?: string;
  EmployeeEmail?: string;
  EmployeePhoto?: string;
  Designation?: string;
  EventType?: 'Birthday' | 'Work Anniversary';
  EventDate?: string;
  IsActive?: boolean;
  CustomMessage?: string;
  YearsCompleted?: number;
}
