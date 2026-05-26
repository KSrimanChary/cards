import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPHttpClient } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";
import { IEmployeeCelebration } from '../models/IEmployeeCelebration';

export interface ICelebrationService {
  getTodaysCelebrations(): Promise<IEmployeeCelebration[]>;
}

const LIST_NAME = 'Employee Celebration Details';

export default class CelebrationService implements ICelebrationService {
  public static readonly serviceKey: ServiceKey<ICelebrationService> =
    ServiceKey.create<ICelebrationService>('celebration:ICelebrationService', CelebrationService);

  private _spHttpClient!: SPHttpClient;
  private _pageContext!: PageContext;
  private _listId: string = '';

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      this._spHttpClient = serviceScope.consume(SPHttpClient.serviceKey);
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
    });
  }

  private async getListId(): Promise<string> {
    if (this._listId) {
      return this._listId;
    }

    try {
      const response = await this._spHttpClient.get(
        `${this._pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${LIST_NAME}')?$select=Id`,
        SPHttpClient.configurations.v1
      );

      if (response.ok) {
        const data: any = await response.json();
        this._listId = data.Id;
        console.log(`List ID retrieved: ${this._listId}`);
        return this._listId;
      } else {
        console.warn(`List not found (${response.status}). It will be created via feature deployment.`);
        throw new Error(`List '${LIST_NAME}' not found`);
      }
    } catch (error) {
      console.error('Error getting list ID:', error);
      throw error;
    }
  }

  public async getTodaysCelebrations(): Promise<IEmployeeCelebration[]> {
    try {
      const listId = await this.getListId();
      
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
 
      const response = await this._spHttpClient.get(
        `${this._pageContext.web.absoluteUrl}/_api/web/lists(guid'${listId}')/items?$select=ID,Title,Designation,Employee,Employee_x0020_Photo,Event_x0020_Type,Event_x0020_Date,Is_x0020_Active,Custom_x0020_Message,Date_x0020_of_x0020_Join,Employee/Email&$expand=Employee&$filter=Is_x0020_Active eq 1`,
        SPHttpClient.configurations.v1
      );
      console.log(`API response status: ${response.status}`);
      if (!response.ok) {
        console.error(`Error fetching items: ${response.status}`);
        return [];
      }

      const data: any = await response.json();

      if (!data.value || data.value.length === 0) {
        console.log('No items found in the list');
        return [];
      }

      return data.value
        .filter((item: any) => {
          try {
            if (!item.Is_x0020_Active) {
              return false;
            }

            const eventDate = new Date(item.Event_x0020_Date);
            const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
            const eventDay = String(eventDate.getDate()).padStart(2, '0');

            return eventMonth === month && eventDay === day;
          } catch (error) {
            console.warn('Error filtering item:', error);
            return false;
          }
        })
        .map((item: any) => {
          let photoUrl = '';
          if (item.Employee_x0020_Photo) {
            if (typeof item.Employee_x0020_Photo === 'object' && item.Employee_x0020_Photo.Url) {
              photoUrl = item.Employee_x0020_Photo.Url;
            } else if (typeof item.Employee_x0020_Photo === 'string') {
              photoUrl = item.Employee_x0020_Photo;
            }
          }

          return {
            Id: item.ID,
            Title: item.Title || '',
            EmployeeEmail: item.Employee?.Email || item.Employee || '', // Extract email from User field or fallback to Employee
            EmployeePhoto: photoUrl, // ✅ URL field returns object with Url property
            Designation: item.Designation || '',
            EventType: item.Event_x0020_Type || 'Birthday',
            EventDate: item.Event_x0020_Date || new Date().toISOString(),
            IsActive: item.Is_x0020_Active ?? true,
            CustomMessage: item.Custom_x0020_Message || '',
            Employee: item.Employee, 
          } as IEmployeeCelebration;
        });
    } catch (error) {
      console.error('Error fetching celebrations:', error);
      return [];
    }
  }
}