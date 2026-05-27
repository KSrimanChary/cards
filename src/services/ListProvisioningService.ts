import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class ListProvisioningService {
  private context: any;
  private listTitle = "Employee Celebration Details";

  constructor(context: any) {
    this.context = context;
  }

  public async ensureList(): Promise<void> {
    const webUrl = this.context.pageContext.web.absoluteUrl;

    try {
      const checkResponse: SPHttpClientResponse = await this.context.spHttpClient.get(
        `${webUrl}/_api/web/lists/GetByTitle('${this.listTitle}')`,
        SPHttpClient.configurations.v1
      );

      if (checkResponse.ok) {
        console.log("List exists, ensuring fields...");
        // await this.createFields();
        return;
      }
    } catch {
      console.warn("List not found. Creating...");
    }

    // ✅ Create List
    const createResponse = await this.context.spHttpClient.post(
      `${webUrl}/_api/web/lists`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Title: this.listTitle,
          BaseTemplate: 100,
        })
      }
    );

    if (!createResponse.ok) {
      throw new Error("Failed to create list");
    }

    console.log("✅ List created");
 
    await this.createFields();
  }

  private async createFields(): Promise<void> {
    const webUrl = this.context.pageContext.web.absoluteUrl;
    const listUrl = `${webUrl}/_api/web/lists/getByTitle('${this.listTitle}')`;

    const simpleFields = [
      {
        Title: "Designation",
        InternalName: "Designation",
        FieldTypeKind: 2 // Text
      },
      {
        Title: "Event Date",
        InternalName: "EventDate",
        FieldTypeKind: 4 // DateTime
      },
      {
        Title: "Custom Message",
        InternalName: "CustomMessage",
        FieldTypeKind: 2 // Text
      },
      {
        Title: "Date of Join",
        InternalName: "DateOfJoin",
        FieldTypeKind: 4 // DateTime
      },
      {
        Title: "Is Active",
        InternalName: "IsActive",
        FieldTypeKind: 8 // Boolean
      }
    ];

    // Create simple fields
    for (const field of simpleFields) {
      await this.createSimpleField(listUrl, field);
    }

    // Create User field using XML
    await this.createUserFieldXml(listUrl);

    // Create Choice field using XML
    await this.createChoiceFieldXml(listUrl);

    await this.createImageFieldXml(listUrl);
  
    console.log("✅ Fields ensured");
  }

  private async createSimpleField(listUrl: string, field: any): Promise<void> {
    try {
      const payload = {
        Title: field.Title,
        InternalName: field.InternalName,
        FieldTypeKind: field.FieldTypeKind,
        Required: false,
        CanBeDeleted: true
      };

      const res = await this.context.spHttpClient.post(
        `${listUrl}/fields`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Field "${field.Title}" may already exist:`, err);
      } else {
        console.log(`✅ Field "${field.Title}" created successfully`);
      }

    } catch (e) {
      console.warn(`Field "${field.Title}" creation error:`, e);
    }
  }

  private async createUserFieldXml(listUrl: string): Promise<void> {
    try {
      const fieldXml = `<Field Type="User" DisplayName="Employee" Name="Employee" StaticName="Employee" UserSelectionMode="PeopleOnly" />`;

      const res = await this.context.spHttpClient.post(
        `${listUrl}/fields/CreateFieldAsXml`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parameters: {
              SchemaXml: fieldXml
            }
          })
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Field "Employee" may already exist:`, err);
      } else {
        console.log(`✅ Field "Employee" created successfully`);
      }

    } catch (e) {
      console.warn(`Field "Employee" creation error:`, e);
    }
  }

  private async createChoiceFieldXml(listUrl: string): Promise<void> {
    try {
      const fieldXml = `<Field Type="Choice" DisplayName="Event Type" Name="EventType" StaticName="EventType" Required="FALSE" Format="Dropdown">
        <CHOICES>
          <CHOICE>Anniversary</CHOICE>
          <CHOICE>Birthday</CHOICE>
          <CHOICE>Work Anniversary</CHOICE>
        </CHOICES>
        <Default>Anniversary</Default>
      </Field>`;

      const res = await this.context.spHttpClient.post(
        `${listUrl}/fields/CreateFieldAsXml`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parameters: {
              SchemaXml: fieldXml
            }
          })
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Field "Event Type" may already exist:`, err);
      } else {
        console.log(`✅ Field "Event Type" created successfully`);
      }

    } catch (e) {
      console.warn(`Field "Event Type" creation error:`, e);
    }
  }


  private async createImageFieldXml(listUrl: string): Promise<void> {
    try {

      const fieldXml = `
        <Field
          Type="Thumbnail"
          DisplayName="Employee Photo"
          Name="EmployeePhoto"
          StaticName="EmployeePhoto"
          Group="Custom Columns"
        />
      `;

      const res = await this.context.spHttpClient.post(
        `${listUrl}/fields/CreateFieldAsXml`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parameters: {
              SchemaXml: fieldXml
            }
          })
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.warn(`Field "Employee Photo" may already exist:`, err);
      } else {
        console.log(`✅ Field "Employee Photo" created successfully`);
      }

    } catch (e) {
      console.warn(`Field "Employee Photo" creation error:`, e);
    }
  }


}