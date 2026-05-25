import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CelebCardsWebPartStrings';
import CelebrationCarousel from './components/celebrationHeader/CelebrationCarousel';
import { IEmployeeCelebration } from '../../models/IEmployeeCelebration';
// PnPjs v2
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface ICelebCardsWebPartProps {
  description: string;
  cardsToShow: number;
}

export default class CelebCardsWebPart
  extends BaseClientSideWebPart<ICelebCardsWebPartProps> {

  private _celebrations: IEmployeeCelebration[] = [];
 
  protected async onInit(): Promise<void> {

    await super.onInit();
 
    sp.setup({
      spfxContext: this.context as any
    });

    await this.loadCelebrations();
  }
 
  private async loadCelebrations(): Promise<void> {

    try {

      const items = await sp.web.lists
        .getByTitle("Employee Celebrations")
        .items
        .select(
          "Id",
          "Title",
          "EmployeeEmail",
          "EmployeePhoto",
          "Designation",
          "EventType",
          "EventDate",
          "CustomMessage",
          "YearsCompleted",
          "IsActive",
          "Person/Id",
          "Person/Title",
          "Person/EMail"
        )
        .expand("Person")
        .filter("IsActive eq 1")
        .orderBy("EventDate", false)
        .top(100)();

      this._celebrations = items as IEmployeeCelebration[];

      this.render();

    } catch (error) {
      console.error("Error loading celebrations:", error);
    }
  }

  public render(): void {

    const element = React.createElement(
      CelebrationCarousel,
      {
        celebrations: this._celebrations,
        cardsToShow: Number(this.properties.cardsToShow) || 3
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {

    if (!currentTheme) return;

    const { semanticColors } = currentTheme;

    if (semanticColors) {

      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('cardsToShow', {
                  label: 'Number of cards visible in carousel'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}