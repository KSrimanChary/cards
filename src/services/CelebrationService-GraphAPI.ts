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

      // Use REST API to query the list with proper CAML query
      const response = await this._spHttpClient.get(
        `${this._pageContext.web.absoluteUrl}/_api/web/lists(guid'${listId}')/items?$select=ID,Title,EmployeeEmail,EmployeePhoto,Designation,EventType,EventDate,IsActive,CustomMessage,YearsCompleted`,
        SPHttpClient.configurations.v1
      );

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
            if (!item.IsActive) {
              return false;
            }

            const eventDate = new Date(item.EventDate);
            const eventMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
            const eventDay = String(eventDate.getDate()).padStart(2, '0');

            return eventMonth === month && eventDay === day;
          } catch (error) {
            console.warn('Error filtering item:', error);
            return false;
          }
        })
        .map((item: any) => ({
          Id: item.ID,
          Title: item.Title || '',
          EmployeeEmail: item.EmployeeEmail || '',
          EmployeePhoto: item.EmployeePhoto || '',
          Designation: item.Designation || '',
          EventType: item.EventType || 'Birthday',
          EventDate: item.EventDate || new Date().toISOString(),
          IsActive: item.IsActive ?? true,
          CustomMessage: item.CustomMessage || '',
          YearsCompleted: item.YearsCompleted || 0,
        } as IEmployeeCelebration));
    } catch (error) {
      console.error('Error fetching celebrations:', error);
      return [];
    }
  }
}