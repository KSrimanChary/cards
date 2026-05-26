// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

// export default class ListProvisioningService {
//   private context: any;
//   private listTitle = "Employee Celebration Details";

//   constructor(context: any) {
//     this.context = context;
//   }

//   public async ensureList(): Promise<void> {
//     const webUrl = this.context.pageContext.web.absoluteUrl;

//     try {
//       // ✅ Check if list exists
//       const checkResponse: SPHttpClientResponse = await this.context.spHttpClient.get(
//         `${webUrl}/_api/web/lists/GetByTitle('${this.listTitle}')`,
//         SPHttpClient.configurations.v1
//       );

//       if (checkResponse.ok) {
//         console.log("List exists, ensuring fields...");
//         await this.createFields(); // ✅ IMPORTANT
//         return;
//       }
//     } catch {
//       console.warn("List not found. Creating...");
//     }

//     // ✅ Create List
//     const createResponse = await this.context.spHttpClient.post(
//       `${webUrl}/_api/web/lists`,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           Title: this.listTitle,
//           BaseTemplate: 100,
//         })
//       }
//     );

//     if (!createResponse.ok) {
//       throw new Error("Failed to create list");
//     }

//     console.log("✅ List created");

//     // ✅ Add fields
//     await this.createFields();
//   }

//   private async createFields(): Promise<void> {
//     const webUrl = this.context.pageContext.web.absoluteUrl;

//     const fieldsXml = [
//       `<Field ID="{A7F2B1C3-4D5E-4F6A-8B9C-1D2E3F4A5B6C}" 
//         Name="Employee" StaticName="Employee"
//         DisplayName="Employee"
//         Type="User"
//         UserSelectionMode="PeopleOnly"
//         UserSelectionScope="0" />`,

//       `<Field ID="{B8A3C2D4-5E6F-5B7C-9C0D-2E3F4A5B6C7D}" 
//         Name="Designation" StaticName="Designation"
//         DisplayName="Designation"
//         Type="Text" />`,

//       `<Field ID="{C9B4D3E5-6F7A-6C8D-0D1E-3F4A5B6C7D8E}" 
//         Name="EventType" StaticName="EventType"
//         DisplayName="Event Type"
//         Type="Choice"
//         Format="Dropdown">
//           <CHOICES>
//             <CHOICE>Anniversary</CHOICE>
//             <CHOICE>Birthday</CHOICE>
//             <CHOICE>Work Anniversary</CHOICE>
//           </CHOICES>
//       </Field>`,

//       `<Field ID="{D0C5E4F6-7A8B-7D9E-1E2F-4A5B6C7D8E9F}" 
//         Name="EmployeePhoto" StaticName="EmployeePhoto"
//         DisplayName="Employee Photo"
//         Type="URL"
//         Format="Image" />`,

//       `<Field ID="{E1D6F5A7-8B9C-8E0F-2F3A-5B6C7D8E9F0A}" 
//         Name="EventDate" StaticName="EventDate"
//         DisplayName="Event Date"
//         Type="DateTime" />`,

//       `<Field ID="{F2E7A6B8-9C0D-9F1A-3A4B-6C7D8E9F0A1B}" 
//         Name="CustomMessage" StaticName="CustomMessage"
//         DisplayName="Custom Message"
//         Type="Text" />`,

//       `<Field ID="{A3F8B7C9-0D1E-0A2B-4B5C-7D8E9F0A1B2C}" 
//         Name="DateOfJoin" StaticName="DateOfJoin"
//         DisplayName="Date of Join"
//         Type="DateTime" />`,

//       `<Field ID="{B4A9C8D0-1E2F-1B3C-5C6D-8E9F0A1B2C3D}" 
//         Name="IsActive" StaticName="IsActive"
//         DisplayName="Is Active"
//         Type="Boolean" />`
//     ];

//     for (const fieldXml of fieldsXml) {
//       try {
//         const res = await this.context.spHttpClient.post(
//           `${webUrl}/_api/web/lists/getByTitle('${this.listTitle}')/fields/createfieldasxml`,
//           SPHttpClient.configurations.v1,
//           {
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//               SchemaXml: fieldXml
//             })
//           }
//         );

//         if (!res.ok) {
//           const err = await res.text();
//           console.error("❌ Field creation failed:", err);
//         } else {
//           console.log("✅ Field created");
//         }

//       } catch (e) {
//         console.warn("Field may already exist:", e);
//       }
//     }

//     console.log("✅ Fields ensured");
//   }
// }



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
      // ✅ Check if list exists
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

    // ✅ Add fields
    await this.createFields();
  }

  private async createFields(): Promise<void> {
    const webUrl = this.context.pageContext.web.absoluteUrl;
    const listUrl = `${webUrl}/_api/web/lists/getByTitle('${this.listTitle}')`;

    // Simple fields (Text, DateTime, Boolean, URL)
    const simpleFields = [
      {
        Title: "Designation",
        InternalName: "Designation",
        FieldTypeKind: 2 // Text
      },
      {
        Title: "Employee Photo",
        InternalName: "EmployeePhoto",
        FieldTypeKind: 11 // URL
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
}