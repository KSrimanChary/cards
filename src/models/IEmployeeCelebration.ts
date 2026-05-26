export interface IEmployeeCelebration {
  /**
   * Item ID from SharePoint list
   */
  Id: number;

  /**
   * Employee name/title
   */
  Title: string;

  /**
   * Employee email or user object
   */
  EmployeeEmail: string | any;

  /**
   * Employee photo - URL to image
   * Note: SharePoint stores this as an object with Url and Description properties
   */
  EmployeePhoto: string;

  /**
   * Job designation/title
   */
  Designation: string;

  /**
   * Type of celebration: Anniversary, Birthday, Work Anniversary
   */
  EventType: string;

  /**
   * Date of the event (ISO format)
   */
  EventDate: string;

  /**
   * Whether this record is active
   */
  IsActive: boolean;

  /**
   * Custom message for the celebration
   */
  CustomMessage: string;

  /**
   * Years completed (optional, not in current schema)
   */
  YearsCompleted?: number;
}

/**
 * Response structure from SharePoint API when fetching Employee_x0020_Photo field
 * The URL field returns an object with Description and Url properties
 */
export interface IUrlFieldValue {
  Description: string;
  Url: string;
}

/**
 * Response structure from SharePoint API when fetching User field
 * User fields can return expanded user information
 */
export interface IUserFieldValue {
  __metadata?: {
    type: string;
    uri: string;
  };
  Id?: number;
  Title?: string;
  Email?: string;
  LoginName?: string;
}