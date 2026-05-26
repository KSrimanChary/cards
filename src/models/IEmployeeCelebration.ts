export interface IEmployeeCelebration {
  Id: number;
  Title: string;
  EmployeeEmail?: string | undefined;
  Employee? : IUserFieldValue ; // Support both User field object and simple string
  EmployeePhoto: string;
  Designation: string;
  EventType: string;
  EventDate: string;
  IsActive: boolean;
  CustomMessage: string;
  YearsCompleted?: number;
}

 export interface IUrlFieldValue {
  Description: string;
  Url: string;
}
export interface IUserFieldValue {
  __metadata?: {
    type: string;
    uri: string;
  };
  Id?: number;
  Title?: string;
  Email?: string;
  Picture?:{
    Url: string;
  }
  LoginName?: string;
}