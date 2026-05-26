import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'CelebCardsWebPartStrings';
import CelebrationCarousel from './components/celebrationHeader/CelebrationCarousel';
import ListProvisioningService from '../../services/ListProvisioningService';


export interface ICelebCardsWebPartProps {
  description: string;
  cardsToShow: number;
}

export default class CelebCardsWebPart
  extends BaseClientSideWebPart<ICelebCardsWebPartProps> {

 
protected async onInit(): Promise<void> {
  await super.onInit();

  try {
    const provisioningService = new ListProvisioningService(this.context);
    await provisioningService.ensureList();

  } catch (error) {
    console.error("Error during list provisioning:", error);
  }
}

 

  public render(): void {
    const element = React.createElement(
      CelebrationCarousel,
      {
        context: this.context,
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
                  label: 'Number of cards visible in carousel',
                })
              ]
            }
          ]
        }
      ]
    };
  }
}